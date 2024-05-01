import * as cdk from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

interface ApiGatewayStackProps extends cdk.StackProps {
  apiLambda: NodejsFunction
}

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props)

    const { apiLambda } = props

    new apigateway.LambdaRestApi(this, 'ApiLambda', {
      handler: apiLambda,
    })
  }
}
