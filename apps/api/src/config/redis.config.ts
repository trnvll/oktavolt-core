const getRedisConfig = () => {
  return {
    redis: {
      username: process.env.REDIS_USERNAME,
      host: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
      port: process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT, 10)
        : 6379,
      password: process.env.REDIS_PASSWORD,
    },
  }
}

export const redisConfig = getRedisConfig
export type RedisConfig = ReturnType<typeof getRedisConfig>['redis']
export type RootRedisConfig = ReturnType<typeof getRedisConfig>
