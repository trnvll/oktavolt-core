import { App } from 'aws-cdk-lib'
import { RdsStack, VpcStack } from './cfn'

const app = new App()

const vpcStack = new VpcStack(app, 'VpcStack')
const _rdsStack = new RdsStack(app, 'RdsStack', { vpc: vpcStack.vpc })
