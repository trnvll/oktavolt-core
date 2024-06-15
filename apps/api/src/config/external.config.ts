const getExternalConfig = () => {
  return {
    external: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      novuApiKey: process.env.NOVU_API_KEY,
    },
  }
}

export const externalConfig = getExternalConfig
export type ExternalConfig = ReturnType<typeof getExternalConfig>['external']
export type RootExternalConfig = ReturnType<typeof getExternalConfig>
