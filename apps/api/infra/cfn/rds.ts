import * as cdk from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import { AuroraPostgresDatabaseConstruct } from 'infra'
import { Vpc } from 'aws-cdk-lib/aws-ec2'

interface RdsStackProps extends cdk.StackProps {
  vpc: Vpc
}

export class RdsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RdsStackProps) {
    super(scope, id, props)

    new AuroraPostgresDatabaseConstruct(this, 'AuroraPostgresDatabase', {
      id: 'PostgresDatabase',
      vpc: props.vpc,
    })
  }
}
