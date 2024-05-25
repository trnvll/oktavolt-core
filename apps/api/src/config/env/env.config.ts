import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'
import {
  EnvironmentVariables,
  NodeEnvEnum,
} from '@/config/env/environment-variables'
import dotenv from 'dotenv'

dotenv.config()

class EnvConfig {
  private readonly envConfig: EnvironmentVariables

  constructor() {
    this.envConfig = this.validateConfig(process.env)
  }

  private validateConfig(
    envVariables: NodeJS.ProcessEnv,
  ): EnvironmentVariables {
    // Using plainToClass to automatically apply decorators
    const transformedConfig = plainToClass(EnvironmentVariables, envVariables, {
      enableImplicitConversion: true,
    })

    if (envVariables.NODE_ENV === NodeEnvEnum.TEST) {
      return transformedConfig
    }
    const errors = validateSync(transformedConfig)
    if (errors.length > 0) {
      throw new Error(
        `Configuration validation error:\n${errors
          .map((e) => Object.values(e.constraints as any).join(', '))
          .join('\n')}`,
      )
    }

    return transformedConfig
  }

  get<T extends keyof EnvironmentVariables>(key: T): EnvironmentVariables[T] {
    return this.envConfig[key]
  }
}

const getEnvConfig = () => {
  const envConfig = new EnvConfig()
  return envConfig
}

export const envConfig = getEnvConfig()
