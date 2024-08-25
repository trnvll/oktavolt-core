const getAwsConfig = () => {
  return {
    aws: {
      region: process.env.CDK_DEFAULT_REGION ?? 'eu-central-1',
      accountId: process.env.CDK_DEFAULT_ACCOUNT,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }
}

export const awsConfig = getAwsConfig
export type AwsConfig = ReturnType<typeof getAwsConfig>['aws']
export type RootAwsConfig = ReturnType<typeof getAwsConfig>
