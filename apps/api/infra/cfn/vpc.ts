import * as cdk from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import { VpcConstruct } from 'infra'

type VpcStackProps = cdk.StackProps

export class VpcStack extends cdk.Stack {
  public readonly vpc: VpcConstruct['vpc']

  constructor(scope: Construct, id: string, props?: VpcStackProps) {
    super(scope, id, props)

    const vpc = new VpcConstruct(this, 'Vpc', { id: 'GeneralVpc' })
    this.vpc = vpc.vpc
  }
}
