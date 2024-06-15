const getAuthConfig = () => {
  return {
    auth: {
      mgmtClientId: process.env.AUTH0_MGMT_CLIENT_ID,
      mgmtClientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET,
      pulumiProviderClientId: process.env.AUTH0_PULUMI_PROVIDER_CLIENT_ID,
      pulumiProviderClientSecret:
        process.env.AUTH0_PULUMI_PROVIDER_CLIENT_SECRET,
    },
  }
}

export const authConfig = getAuthConfig
export type AuthConfig = ReturnType<typeof getAuthConfig>['auth']
export type RootAuthConfig = ReturnType<typeof getAuthConfig>
