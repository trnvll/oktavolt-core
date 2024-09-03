import { LogLevelEnum } from 'utils'

const getBaseConfig = () => {
  return {
    base: {
      nodeEnv:
        (process.env.NODE_ENV as 'production' | 'development') ?? 'development',
      isTsNode: process.env.IS_TS_NODE === String(true),
      loggingLevels: process.env.LOGGING_LEVELS?.split(',') ?? [
        LogLevelEnum.ERROR,
        LogLevelEnum.WARN,
        LogLevelEnum.LOG,
      ],
      sqsUserEventsQueueUrl: process.env.SQS_USER_EVENTS_QUEUE_URL,
    },
  }
}

export const baseConfig = getBaseConfig
export type BaseConfig = ReturnType<typeof getBaseConfig>['base']
export type RootBaseConfig = ReturnType<typeof getBaseConfig>
