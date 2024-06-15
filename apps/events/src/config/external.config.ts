const getExternalConfig = () => {
  return {
    external: {
      mixpanelToken: process.env.MIXPANEL_TOKEN,
    },
  }
}

export const externalConfig = getExternalConfig
export type ExternalConfig = ReturnType<typeof getExternalConfig>['external']
export type RootExternalConfig = ReturnType<typeof getExternalConfig>
