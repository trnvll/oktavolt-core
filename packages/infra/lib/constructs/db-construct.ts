import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
  DatabaseInstanceProps,
  Credentials,
} from 'aws-cdk-lib/aws-rds'
import { Vpc, SubnetType, InstanceType } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

interface PostgresDatabaseConstructProps
  extends Partial<DatabaseInstanceProps> {
  id: string
  vpc: Vpc
}

export class PostgresDatabaseConstruct extends Construct {
  public readonly instance: DatabaseInstance

  constructor(
    scope: Construct,
    id: string,
    props: PostgresDatabaseConstructProps,
  ) {
    super(scope, id)

    this.instance = new DatabaseInstance(this, props.id, {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_16,
      }),
      instanceType: props.instanceType || new InstanceType('t3.micro'),
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      },
      allocatedStorage: props.allocatedStorage || 20,
      maxAllocatedStorage: props.maxAllocatedStorage || 100,
      credentials:
        props.credentials || Credentials.fromGeneratedSecret('postgres'),
      deletionProtection: props.deletionProtection || false,
      ...props,
    })
  }
}
