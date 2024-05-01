import { ManagedPolicy, Role } from 'aws-cdk-lib/aws-iam'

const attachRolesFromManagedPolicyNames = (
  role: Role,
  managedPolicyNames: string[],
) => {
  managedPolicyNames.forEach((policyName) => {
    role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName(policyName))
  })
}

export { attachRolesFromManagedPolicyNames }
