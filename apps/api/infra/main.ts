import { App } from 'aws-cdk-lib'
import { RdsStack, IamStack, LambdaStack, ApiGatewayStack } from './cfn'

const app = new App()

const iamStack = new IamStack(app, 'IamStack')
const _rdsStack = new RdsStack(app, 'RdsStack')
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  adminRole: iamStack.adminRole,
})
const _apiGatewayStack = new ApiGatewayStack(app, 'ApiGatewayStack', {
  apiLambda: lambdaStack.apiLambda,
})
