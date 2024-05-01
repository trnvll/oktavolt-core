import * as cdk from 'aws-cdk-lib/core'
import { Construct } from 'constructs'
import { Vpc, SubnetType, IpAddresses } from 'aws-cdk-lib/aws-ec2'
import { SecurityGroup, Peer, Port } from 'aws-cdk-lib/aws-ec2'
import {
  DatabaseCluster,
  DatabaseClusterEngine,
  AuroraPostgresEngineVersion,
  CfnDBCluster,
  ClusterInstance,
  Credentials,
} from 'aws-cdk-lib/aws-rds'
import { Aspects } from 'aws-cdk-lib/core'

export class RdsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // create a vpc
    const vpc = new Vpc(this, 'VPC', {
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [{ name: 'egress', subnetType: SubnetType.PUBLIC }], // only one subnet is needed
      natGateways: 0, // disable NAT gateways
    })

    // create a security group for aurora db
    const dbSecurityGroup = new SecurityGroup(this, 'DbSecurityGroup', {
      vpc, // use the vpc created above
      allowAllOutbound: true, // allow outbound traffic to anywhere
    })

    // allow inbound traffic from anywhere to the db
    dbSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432), // allow inbound traffic on port 5432 (postgres)
      'allow inbound traffic from anywhere to the db on port 5432',
    )

    const dbName = 'reconneqt_platform_db'
    const port = 5432

    // create a db cluster
    // https://github.com/aws/aws-cdk/issues/20197#issuecomment-1117555047
    const dbCluster = new DatabaseCluster(this, 'DbCluster', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_14_8,
      }),
      credentials: Credentials.fromGeneratedSecret('master_user'),
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
      vpc,
      vpcSubnets: vpc.selectSubnets({
        subnetType: SubnetType.PUBLIC,
      }),
      securityGroups: [dbSecurityGroup],
      port, // use port 5432 instead of 3306
      defaultDatabaseName: dbName,
    })

    // add capacity to the db cluster to enable scaling
    Aspects.of(dbCluster).add({
      visit(node) {
        if (node instanceof CfnDBCluster) {
          node.serverlessV2ScalingConfiguration = {
            minCapacity: 0.5, // min capacity is 0.5 vCPU
            maxCapacity: 1, // max capacity is 1 vCPU (default)
          }
        }
      },
    })
  }
}
