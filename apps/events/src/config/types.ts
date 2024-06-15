import { RootBaseConfig } from '@/config/base.config'
import { RootDatabaseConfig } from '@/config/database.config'
import { RootExternalConfig } from '@/config/external.config'

export type RootConfig = RootBaseConfig &
  RootDatabaseConfig &
  RootExternalConfig
