import * as cdk from 'aws-cdk-lib/core'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { getEnvVars } from '@/utils/environment.util'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Role } from 'aws-cdk-lib/aws-iam'

interface LambdaStackProps extends cdk.StackProps {
  adminRole: Role
}

export class LambdaStack extends cdk.Stack {
  public readonly apiLambda: NodejsFunction

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props)

    const { adminRole } = props

    const lambdaEnvVars = getEnvVars(
      'IS_TS_NODE',
      'NODE_ENV',
      'AUTH0_ISSUER_URL',
      'AUTH0_AUDIENCE',
      'DATABASE_URL',
      'AWS_ACCOUNT_NUMBER',
      'AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET',
      'AUTH0_DB_CONNECTION_NAME',
    )

    const apiLambda = new NodejsFunction(this, 'NestJsLambda', {
      entry: 'dist/src/lambda.js',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: lambdaEnvVars,
      timeout: cdk.Duration.seconds(60),
      memorySize: 2048,
      bundling: {
        loader: {
          '.prisma': 'file',
          '.so.node': 'file',
        },
        assetHash: '',
        commandHooks: {
          beforeInstall: (i, o) => [
            // Copy prisma directory to Lambda code asset
            // the directory must be located at the same directory as your Lambda code
            `cp -r ${i}/databases ${o}`,
          ],
          beforeBundling: (i, o) => [],
          afterBundling(i: string, o: string): string[] {
            return [
              // Commands to rename the files back to their original names
              `mv ${o}/libquery_engine-rhel-openssl-1.0.x.so-*.node ${o}/libquery_engine-rhel-openssl-1.0.x.so.node`,
              `mv ${o}/schema-*.prisma ${o}/schema.prisma`,
            ]
          },
        },
        externalModules: [
          'cache-manager',
          '@nestjs/websockets',
          '@nestjs/microservices',
          'class-transformer/storage',
        ],
      },
      role: adminRole,
    })

    this.apiLambda = apiLambda
  }
}
