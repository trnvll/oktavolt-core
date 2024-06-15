const getAwsConfig = () => {
  return {
    aws: {
      region: process.env.AWS_REGION ?? 'eu-central-1',
      accountId: process.env.AWS_ACCOUNT_ID,
    },
  }
}

export const awsConfig = getAwsConfig
export type AwsConfig = ReturnType<typeof getAwsConfig>['aws']
export type RootAwsConfig = ReturnType<typeof getAwsConfig>
