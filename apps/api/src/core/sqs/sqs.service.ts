import { Injectable } from '@nestjs/common'
import { SQS } from 'aws-sdk'
import { ConfigService } from '@nestjs/config'
import { AwsConfig } from '@/config/aws.config'
import { BaseConfig } from '@/config/base.config'

@Injectable()
export class SqsService {
  private readonly sqs: SQS
  private readonly queueUrl: string

  constructor(private readonly configService: ConfigService) {
    const baseConfig = configService.get<BaseConfig>('base')
    const awsConfig = configService.get<AwsConfig>('aws')

    if (!awsConfig?.region) {
      throw new Error('AWS region is missing.')
    }

    if (!baseConfig?.sqsUserEventsQueueUrl) {
      throw new Error('SQS user events queue URL is missing.')
    }

    this.sqs = new SQS({ region: awsConfig.region })
    this.queueUrl = baseConfig.sqsUserEventsQueueUrl
  }

  async sendMessage(messageBody: any): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
    }
    await this.sqs.sendMessage(params).promise()
  }
}
