import { Stack, StackProps, Duration } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as sqs from 'aws-cdk-lib/aws-sqs'

export class EventsSQSStack extends Stack {
  public readonly queue: sqs.Queue

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.queue = new sqs.Queue(this, 'EventsQueue', {
      visibilityTimeout: Duration.seconds(300),
    })
  }
}
