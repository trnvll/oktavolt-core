const getBaseConfig = () => {
  return {
    base: {
      nodeEnv: process.env.NODE_ENV ?? 'development',
      loggingLevels: process.env.LOGGING_LEVELS?.split(',') ?? [
        'ERROR',
        'WARN',
        'LOG',
      ],
    },
  }
}

export const baseConfig = getBaseConfig
export type BaseConfig = ReturnType<typeof getBaseConfig>['base']
export type RootBaseConfig = ReturnType<typeof getBaseConfig>
