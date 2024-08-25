import { Injectable } from '@nestjs/common'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { ConfigService } from '@nestjs/config'
import { AwsConfig } from '@/config/aws.config'
import { BaseConfig } from '@/config/base.config'

@Injectable()
export class SqsService {
  private readonly sqs: SQSClient
  private readonly queueUrl: string

  constructor(private readonly configService: ConfigService) {
    const baseConfig = configService.get<BaseConfig>('base')
    const awsConfig = configService.get<AwsConfig>('aws')

    if (!awsConfig?.region) {
      throw new Error('AWS region is missing.')
    }

    if (!awsConfig?.accessKeyId || !awsConfig?.secretAccessKey) {
      throw new Error('AWS credentials are missing.')
    }

    if (!baseConfig?.sqsUserEventsQueueUrl) {
      throw new Error('SQS user events queue URL is missing.')
    }

    this.sqs = new SQSClient({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    })
    this.queueUrl = baseConfig.sqsUserEventsQueueUrl
  }

  async sendMessage(messageBody: any): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
    })
    await this.sqs.send(command)
  }
}
