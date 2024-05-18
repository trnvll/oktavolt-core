import { Injectable } from '@nestjs/common'
import { SQS } from 'aws-sdk'
import { envConfig } from '@/config/env/env.config'

@Injectable()
export class SqsService {
  private readonly sqs: SQS
  private readonly queueUrl: string

  constructor() {
    this.sqs = new SQS({ region: envConfig.get('AWS_REGION') })
    this.queueUrl = envConfig.get('SQS_USER_EVENTS_QUEUE_URL')
  }

  async sendMessage(messageBody: any): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
    }
    await this.sqs.sendMessage(params).promise()
  }
}
