import { App } from 'aws-cdk-lib'
import { EventsS3Stack } from './stacks/s3/s3-stack'
import { EventsSQSStack } from './stacks/sqs/sqs-stack'
import { EventsLambdaStack } from './stacks/lambda/lambda-stack'
import { EventsConnectionStack } from './stacks/connection/connection-stack'

const app = new App()
const defaultProps = {
  env: { region: 'eu-central-1' },
}

const s3Stack = new EventsS3Stack(app, 'EventsS3Stack', defaultProps)
const sqsStack = new EventsSQSStack(app, 'EventsSQSStack', defaultProps)
const lambdaStack = new EventsLambdaStack(app, 'EventsLambdaStack', {
  ...defaultProps,
  eventsBucket: s3Stack.bucket,
})

new EventsConnectionStack(app, 'EventsConnectionStack', {
  ...defaultProps,
  eventsBucket: s3Stack.bucket,
  eventsQueue: sqsStack.queue,
  eventsHandler: lambdaStack.eventsHandler,
})
