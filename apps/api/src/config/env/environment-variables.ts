import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { LogLevelEnum } from 'utils'

enum NodeEnvEnum {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

const defaultEnv: Partial<EnvironmentVariables> = {
  IS_TS_NODE: true,
  NODE_ENV: NodeEnvEnum.DEVELOPMENT,
  LOGGING_LEVELS: [LogLevelEnum.ERROR, LogLevelEnum.WARN, LogLevelEnum.LOG],
  PORT: 8080,
  AUTH0_DOMAIN: 'https://platform.oktavolt.com',
}

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value, 10) : defaultEnv.PORT))
  PORT: number

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value ? Boolean(value) : defaultEnv.IS_TS_NODE))
  IS_TS_NODE: boolean

  @IsOptional()
  @IsEnum(NodeEnvEnum)
  @Transform(({ value }) => value ?? defaultEnv.IS_TS_NODE)
  NODE_ENV: NodeEnvEnum

  @IsOptional()
  @IsEnum(LogLevelEnum, { each: true })
  @Transform(({ value }) =>
    value ? value.split(',') : defaultEnv.LOGGING_LEVELS,
  )
  LOGGING_LEVELS: LogLevelEnum[]

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value : defaultEnv.AUTH0_DOMAIN))
  AUTH0_DOMAIN: string
}
