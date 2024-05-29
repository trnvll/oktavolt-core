import { Transform } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export enum NodeEnvEnum {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

const defaultEnv: Partial<EnvironmentVariables> = {
  NODE_ENV: NodeEnvEnum.DEVELOPMENT,
  AUTH0_DOMAIN: 'oktavolt.eu.auth0.com',
}

export class EnvironmentVariables {
  @IsOptional()
  @IsEnum(NodeEnvEnum)
  @Transform(({ value }) => value ?? defaultEnv.NODE_ENV)
  NODE_ENV: NodeEnvEnum

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value : defaultEnv.AUTH0_DOMAIN))
  AUTH0_DOMAIN: string
}
