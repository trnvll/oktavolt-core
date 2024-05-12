import { Construct } from 'constructs'
import { Vpc, VpcProps, SubnetType, IpAddresses } from 'aws-cdk-lib/aws-ec2'

interface VpcConstructProps extends Partial<VpcProps> {
  id: string
}

export class VpcConstruct extends Construct {
  public readonly vpc: Vpc

  constructor(scope: Construct, id: string, props: VpcConstructProps) {
    super(scope, id)

    this.vpc = new Vpc(this, props.id, {
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 3,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'database',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
      ...props,
    })
  }
}
