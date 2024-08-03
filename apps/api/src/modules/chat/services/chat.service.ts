import { Injectable } from '@nestjs/common'
import { LlmChatService } from '@/core/llm/services/llm-chat.service'
import path from 'path'
import fs from 'fs'

@Injectable()
export class ChatService {
  private prompts: Record<'systemBase', string>

  constructor(private readonly llmChatService: LlmChatService) {
    this.loadPrompts()
  }

  async chat(message: string) {
    return this.llmChatService.chat(message, {
      systemPrompt: this.prompts.systemBase,
    })
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
