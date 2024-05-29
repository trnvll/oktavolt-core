import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { LogLevelEnum } from 'utils'

export enum NodeEnvEnum {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

const defaultEnv: Partial<EnvironmentVariables> = {
  AWS_REGION: 'eu-central-1',
  IS_TS_NODE: true,
  NODE_ENV: NodeEnvEnum.DEVELOPMENT,
  LOGGING_LEVELS: [LogLevelEnum.ERROR, LogLevelEnum.WARN, LogLevelEnum.LOG],
  PORT: 8080,
  AUTH0_DOMAIN: 'https://platform.oktavolt.com',
  REDIS_HOST: '0.0.0.0',
  REDIS_PORT: 6379,
  REDIS_USERNAME: 'default',
}

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string

  @IsString()
  SQS_USER_EVENTS_QUEUE_URL: string

  @IsString()
  OPENAI_API_KEY: string

  @IsString()
  NOVU_API_KEY: string

  @IsOptional()
  @IsString()
  REDIS_HOST: string

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    value ? parseInt(value, 10) : defaultEnv.REDIS_PORT,
  )
  REDIS_PORT: number

  @IsOptional()
  @IsString()
  REDIS_USERNAME?: string

  @IsOptional()
  @IsString()
  REDIS_PASSWORD: string

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value : defaultEnv.AWS_REGION))
  AWS_REGION: string

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
