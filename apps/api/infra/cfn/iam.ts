import * as cdk from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { attachRolesFromManagedPolicyNames } from '../util'

export class IamStack extends cdk.Stack {
  public readonly adminRole: Role

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const adminRole = new Role(this, 'AdminRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    })

    attachRolesFromManagedPolicyNames(adminRole, [
      'service-role/AWSLambdaBasicExecutionRole',
      'service-role/AWSLambdaVPCAccessExecutionRole',
      'AmazonS3FullAccess',
      'AmazonSSMReadOnlyAccess',
      'SecretsManagerReadWrite',
      'AmazonEventBridgeFullAccess',
    ])

    this.adminRole = adminRole
  }
}
