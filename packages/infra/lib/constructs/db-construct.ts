import {
  DatabaseInstanceProps,
  Credentials,
  DatabaseCluster,
  DatabaseClusterEngine,
  AuroraPostgresEngineVersion,
  ClusterInstance,
} from 'aws-cdk-lib/aws-rds'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import { RemovalPolicy } from 'aws-cdk-lib'

interface AuroraPostgresDatabaseConstructProps
  extends Partial<DatabaseInstanceProps> {
  id: string
  vpc: Vpc
}

export class AuroraPostgresDatabaseConstruct extends Construct {
  public readonly cluster: DatabaseCluster

  constructor(
    scope: Construct,
    id: string,
    props: AuroraPostgresDatabaseConstructProps,
  ) {
    super(scope, id)

    this.cluster = new DatabaseCluster(this, props.id, {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_15_5,
      }),
      writer: ClusterInstance.serverlessV2('writer-serverless', {
        autoMinorVersionUpgrade: true,
        publiclyAccessible: true,
      }),
      readers: [
        ClusterInstance.serverlessV2('reader-1-serverless', {
          autoMinorVersionUpgrade: true,
          publiclyAccessible: true,
          scaleWithWriter: true,
        }),
      ],
      vpc: props.vpc,
      defaultDatabaseName: 'main',
      credentials:
        props.credentials ||
        Credentials.fromGeneratedSecret('aurora-postgres-admin'),
      storageEncrypted: true,
      removalPolicy: RemovalPolicy.DESTROY,
    })
  }
}
