import { RootExternalConfig } from '@/config/external.config'
import { RootAuthConfig } from '@/config/auth.config'
import { RootBaseConfig } from '@/config/base.config'
import { RootAwsConfig } from '@/config/aws.config'
import { RootDatabaseConfig } from '@/config/database.config'
import { RootRedisConfig } from '@/config/redis.config'

export enum NodeEnvEnum {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

export type RootConfig = RootAuthConfig &
  RootBaseConfig &
  RootAwsConfig &
  RootExternalConfig &
  RootRedisConfig &
  RootDatabaseConfig
