import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class IamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const apiUser = new iam.User(this, 'api-user', {
      userName: 'api-user',
    })

    // Add SQS permissions
    const apiPolicy = new iam.PolicyStatement(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'sqs:SendMessage',
          'sqs:ReceiveMessage',
          'sqs:DeleteMessage',
          'sqs:GetQueueAttributes',
        ],
        resources: ['arn:aws:sqs:*:*:*'], // Restrict to specific queue ARNs in production
      }),
    )

    apiUser.addToPolicy(apiPolicy)
  }
}
