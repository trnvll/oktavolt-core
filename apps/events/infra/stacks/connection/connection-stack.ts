import { Stack, StackProps } from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'
import * as sources from 'aws-cdk-lib/aws-lambda-event-sources'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

interface EventsConnectionStackProps extends StackProps {
  eventsBucket: s3.Bucket
  eventsQueue: sqs.Queue
  eventsHandler: NodejsFunction
}

export class EventsConnectionStack extends Stack {
  constructor(scope: Construct, id: string, props: EventsConnectionStackProps) {
    super(scope, id, props)

    const { eventsBucket, eventsQueue, eventsHandler } = props

    eventsHandler.addEventSource(new sources.SqsEventSource(eventsQueue))
    eventsBucket.grantReadWrite(eventsHandler)
  }
}
