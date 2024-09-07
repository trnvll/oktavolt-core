import { Injectable } from '@nestjs/common'
import { LogActivity, LogLevelEnum } from 'utils'
import { LlmConversationTypeEnum } from '@/modules/chats/types/llm-conversation-type'
import { ResourcesQueryService } from '@/modules/resources/services/resources-query.service'
import { UsersQueryService } from '@/modules/users/services/queries/users-query.service'

@Injectable()
export class LlmRagService {
  constructor(
    private readonly usersQueryService: UsersQueryService,
    private readonly resourcesQueryService: ResourcesQueryService,
  ) {}

  @LogActivity({ level: LogLevelEnum.DEBUG, logEntry: false })
  async getUserData(
    userId: number,
    params: {
      localTime?: string
      location?: string
      ipAddress?: string
      timezone?: string
    },
  ) {
    const userData = await this.usersQueryService.one(userId)
    if (!userData) return ''

    const context = {
      'First name': userData.firstName,
      'Last name': userData.lastName,
      'Date of birth': userData.dob,
      'Place of birth': 'Sweden, Linköping',
      Age: Math.floor(
        (Date.now() - new Date(userData.dob).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000),
      ),
      'Current location': params.location,
      'Local time': params.localTime,
      'Additional context': userData.context,
      'Ip address': params.ipAddress,
    }

    return this.toText(context)
  }

  @LogActivity({ level: LogLevelEnum.DEBUG, logEntry: false })
  async getRelevantResources(
    embedding: number[],
    userId: number,
    convType: LlmConversationTypeEnum,
    limit = 2,
    minSimilarity = 0.3,
  ) {
    const resources = await this.resourcesQueryService.findSimilarResources(
      embedding,
      userId,
      convType,
      { limit, minSimilarity },
    )

    return resources.map((resource) => resource.content).join('\n')
  }

  private toText(obj: Record<string, any>) {
    return Object.entries(obj)
      .filter(([_, value]) => value !== undefined || value !== null)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  }
}
