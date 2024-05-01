import { Construct } from 'constructs'
import { Role, IRole, RoleProps, ServicePrincipal } from 'aws-cdk-lib/aws-iam'

interface IamRoleConstructProps extends Partial<RoleProps> {
  id: string
}

export class IamRoleConstruct extends Construct {
  public readonly role: IRole

  constructor(scope: Construct, id: string, props: IamRoleConstructProps) {
    super(scope, id)

    this.role = new Role(this, props.id, {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      ...props,
    })
  }
}
