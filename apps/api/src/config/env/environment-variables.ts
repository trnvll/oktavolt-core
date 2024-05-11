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
  LOGGING_LEVELS: [LogLevelEnum.ERROR, LogLevelEnum.WARN, LogLevelEnum.INFO],
  PORT: 8080,
}

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value, 10) : defaultEnv.PORT))
  PORT: number

  @IsBoolean()
  @Transform(({ value }) => (value ? Boolean(value) : defaultEnv.IS_TS_NODE))
  IS_TS_NODE: boolean

  @IsEnum(NodeEnvEnum)
  @Transform(({ value }) => value ?? defaultEnv.IS_TS_NODE)
  NODE_ENV: NodeEnvEnum

  @IsOptional()
  @IsEnum(LogLevelEnum, { each: true })
  @Transform(({ value }) =>
    value ? value.split(',') : defaultEnv.LOGGING_LEVELS,
  )
  LOGGING_LEVELS: LogLevelEnum[]
}
