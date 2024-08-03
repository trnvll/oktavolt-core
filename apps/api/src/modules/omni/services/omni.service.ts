import { Injectable } from '@nestjs/common'
import { LlmOpenapiActionsService } from '@/core/llm/services/llm-openapi-actions.service'
import * as fs from 'fs'
import path from 'path'
import { JsonObject } from 'langchain/tools'

@Injectable()
export class OmniService {
  constructor(
    private readonly llmOpenapiActionsService: LlmOpenapiActionsService,
  ) {}

  async omni(query: string) {
    const openapiJsonSpecPath = path.join(__dirname, '../../../../openapi.json')
    const openapiJsonSpec = fs.readFileSync(openapiJsonSpecPath, 'utf8')

    if (!openapiJsonSpec) {
      throw new Error('Could not read openapi.json')
    }

    let openapiJsonSpecParsed
    try {
      openapiJsonSpecParsed = JSON.parse(openapiJsonSpec) as JsonObject
    } catch (err) {
      throw new Error('Could not parse openapi.json')
    }

    await this.llmOpenapiActionsService.init(openapiJsonSpecParsed)
    return this.llmOpenapiActionsService.executeAction(query)
  }
}
