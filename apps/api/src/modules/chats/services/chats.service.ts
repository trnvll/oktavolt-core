import { Injectable } from '@nestjs/common'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import path from 'path'
import fs from 'fs'
import { InjectQueue } from '@nestjs/bull'
import { QueueEnum } from '@/types/queues/queue.enum'
import { Queue } from 'bull'
import { DatabaseService } from '@/core/database/database.service'
import { Chats, ChatTypeEnum, Embeddings, SelectUser } from 'database'
import { CreateChatDto } from '@/modules/chats/dtos/create-chat.dto'
import { ChatsEventsConsumerEnum } from '@/modules/chats/consumers/chats-events.consumer'
import { EventsEnum } from '@/core/events/types/events.enum'
import { CreateEventUserDataUpdatedDto } from '@/core/events/dtos/create-event-user-data-updated.dto'
import { EntityTypeEnum, EventActionEnum, json } from 'shared'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { and, desc, eq, gt, or, cosineDistance, sql } from 'drizzle-orm'
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'
import { LlmEmbeddingsService } from '@/core/llm/services/llm-embeddings.service'
import { LogActivity, LogLevelEnum } from 'utils'
import { ChatsFnsService } from '@/modules/chats/services/chats-fns.service'
import { getToolsFromToolDefs } from '@/utils/fns/get-tools-from-tool-defs'
import { UsersLlmToolsService } from '@/modules/users/services/users-llm-tools.service'
import { ToolExecsFnsService } from '@/modules/tool-execs/services/tool-execs-fns.service'
import { ToolExecsLlmToolsService } from '@/modules/tool-execs/services/tool-execs-llm-tools.service'
import { ToolExecsService } from '@/modules/tool-execs/services/tool-execs.service'

@Injectable()
export class ChatsService {
  private prompts: Record<'systemBase', string>

  constructor(
    private readonly database: DatabaseService,
    private readonly eventEmitter: EventEmitter2,
    private readonly llmChatService: LlmChatService,
    private readonly llmEmbeddingsService: LlmEmbeddingsService,
    private readonly usersLlmToolsService: UsersLlmToolsService,
    @InjectQueue(QueueEnum.ChatsEvents)
    private readonly chatsEventsQueue: Queue,
    private readonly chatsFnsService: ChatsFnsService,
    private readonly toolExecsLlmToolsService: ToolExecsLlmToolsService,
    private readonly toolExecsFnsService: ToolExecsFnsService,
    private readonly toolExecsService: ToolExecsService,
  ) {
    this.loadPrompts()
  }

  async chat(user: SelectUser, createChatDto: CreateChatDto) {
    const result = await this.chatsFnsService.createChat(user, createChatDto)

    const embedding = await this.llmEmbeddingsService.generateEmbeddings([
      result[0].content,
    ])

    const userToolDefs = this.usersLlmToolsService.getToolDefs()
    const toolExecsLlmToolDefs = this.toolExecsLlmToolsService.getToolDefs()

    const tools = [
      ...getToolsFromToolDefs(userToolDefs),
      ...getToolsFromToolDefs(toolExecsLlmToolDefs),
    ]

    const [historicalChats, relevantChats] = await Promise.all([
      this.getChatHistory(user.userId),
      this.getRelevantChats(embedding[0], user.userId),
    ])

    let response = await this.llmChatService.chat(result[0].content, {
      history: [...relevantChats, ...historicalChats],
      systemPrompt: this.prompts.systemBase,
      tools,
    })
    // TODO: raw response vs natural language
    // TODO: if any other than confirmation tool is called, create in db and execute or not depending on `confirm` property of tool def
    // TODO: if no tool is called, default to returning plain response and answering the user's question

    if (response && this.toolExecsFnsService.hasToolCalls(response)) {
      console.log(
        'Has tool calls:',
        json(response.lc_kwargs.tool_calls.map((tool: any) => tool.name)),
      )

      const toolExecResult = await this.toolExecsService.executeToolCall(
        response,
        result[0].chatId,
      )

      if (createChatDto.raw) {
        return toolExecResult
      }

      const llmToolExecResult = new HumanMessage(
        `Here is the tool ${toolExecResult.name} (${
          toolExecResult.description
        }) execution result ${json(toolExecResult.response)}`,
      )

      console.log('Tool execution result:', json(llmToolExecResult.content))

      response = await this.llmChatService.chat(result[0].content, {
        history: [llmToolExecResult],
        systemPrompt:
          this.prompts.systemBase +
          '\nGiven the context and previous conversation, answer the user query with existing data.',
      })
    }

    const responseResult = await this.database.db
      .insert(Chats)
      .values({
        content: response?.content as string, // FIXME: what should I get?
        type: ChatTypeEnum.Assistant,
        userId: user.userId,
      })
      .returning()

    this.eventEmitter.emit(
      EventsEnum.UserDataUpdated,
      new CreateEventUserDataUpdatedDto({
        userId: user.userId,
        data: {
          entityType: EntityTypeEnum.Chat,
          entityIds: responseResult.map((entity) => entity.chatId),
          dataChange: {
            newValue: responseResult,
          },
          action: EventActionEnum.Create,
        },
      }),
    )

    await this.chatsEventsQueue.add(
      ChatsEventsConsumerEnum.CreateChatsEmbedding,
      responseResult[0],
    )

    return {
      chatId: result[0].chatId,
      response: responseResult[0].content,
    }
  }

  @LogActivity({ level: LogLevelEnum.DEBUG })
  private async getChatHistory(userId: number, limit = 3) {
    const chats = await this.database.db.query.chats.findMany({
      where: and(
        eq(Chats.userId, userId),
        or(
          eq(Chats.type, ChatTypeEnum.Human),
          eq(Chats.type, ChatTypeEnum.Assistant),
        ),
      ),
      orderBy: [desc(Chats.createdAt)],
      limit,
    })

    return chats
      .map((chat) =>
        this.getMessageInstanceFromChatType(chat.content, chat.type),
      )
      .filter(Boolean) as BaseMessage[]
  }

  @LogActivity({ level: LogLevelEnum.DEBUG, logEntry: false })
  private async getRelevantChats(
    embedding: number[],
    userId: number,
    limit = 2,
    minSimilarity = 0.3,
  ) {
    const similarity = sql<number>`1 - (${cosineDistance(
      Embeddings.embedding,
      embedding,
    )})`

    const chats = await this.database.db
      .select({ similarity, content: Chats.content, type: Chats.type })
      .from(Embeddings)
      .innerJoin(Chats, eq(Embeddings.chatId, Chats.chatId))
      .where(and(eq(Chats.userId, userId), gt(similarity, minSimilarity)))
      .orderBy((t) => desc(t.similarity))
      .limit(limit)

    return chats
      .map((chat) =>
        this.getMessageInstanceFromChatType(chat.content, chat.type),
      )
      .filter(Boolean) as BaseMessage[]
  }

  private getMessageInstanceFromChatType(
    content: string,
    chatType: ChatTypeEnum,
  ) {
    switch (chatType) {
      case ChatTypeEnum.Assistant:
        return new AIMessage(content)
      case ChatTypeEnum.Human:
        return new HumanMessage(content)
      default:
        console.error('Invalid chat type, skipping from history:', chatType)
    }
  }

  private loadPrompts() {
    const getSystemFilePath = (fileName: string) => {
      const basePath = path.join(__dirname, '../prompts/system')
      return path.join(basePath, fileName)
    }

    const systemBasePrompt = fs.readFileSync(
      getSystemFilePath('base.txt'),
      'utf8',
    )
    this.prompts = {
      systemBase: systemBasePrompt,
    }
  }
}
