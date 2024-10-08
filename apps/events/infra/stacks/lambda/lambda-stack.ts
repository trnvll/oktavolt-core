import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

interface EventsLambdaStackProps extends StackProps {
  eventsBucket: s3.Bucket
}

export class EventsLambdaStack extends Stack {
  public readonly eventsHandler: NodejsFunction

  constructor(scope: Construct, id: string, props: EventsLambdaStackProps) {
    super(scope, id, props)

    const { eventsBucket } = props

    this.eventsHandler = new NodejsFunction(this, 'EventsHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'dist/entries/lambdas/user-events/handler.js',
      handler: 'handler',
      environment: {
        EVENTS_BUCKET_NAME: eventsBucket.bucketName,
        TS_DATABASE_URL: process.env.TS_DATABASE_URL ?? '',
        MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN ?? '', // FIXME: need to do this in proper way, maybe just use dotenv
      },
      bundling: {
        externalModules: [
          '@nestjs/websockets',
          '@nestjs/microservices',
          'class-transformer/storage',
        ],
      },
    })
  }
}
