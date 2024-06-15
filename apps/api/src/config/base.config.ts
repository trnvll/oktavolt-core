const getBaseConfig = () => {
  return {
    base: {
      nodeEnv: process.env.NODE_ENV ?? 'development',
      isTsNode: process.env.IS_TS_NODE === String(true),
      sqsUserEventsQueueUrl: process.env.SQS_USER_EVENTS_QUEUE_URL,
    },
  }
}

export const baseConfig = getBaseConfig
export type BaseConfig = ReturnType<typeof getBaseConfig>['base']
export type RootBaseConfig = ReturnType<typeof getBaseConfig>
