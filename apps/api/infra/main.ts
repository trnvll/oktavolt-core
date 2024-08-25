import { App } from 'aws-cdk-lib'
import { IamStack } from './cfn/iam'
import { stackName } from './utils/misc'

const app = new App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

const projectName = 'api'
const getStackName = stackName(projectName)

const _iamStack = new IamStack(app, getStackName('iam-stack'), { env })
