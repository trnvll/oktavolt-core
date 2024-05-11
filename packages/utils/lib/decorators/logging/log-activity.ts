import { Logger, LogLevel } from '@nestjs/common'
import { LogLevelEnum } from '@/enums'

interface LogOptions {
  allowedLevels?: LogLevelEnum[]
  level?: LogLevel
  logEntry?: boolean
  logExit?: boolean
  logError?: boolean
  message?: string // Optional log message
}

export function LogActivity(options: LogOptions = {}) {
  const {
    allowedLevels = process.env.LOGGING_LEVELS?.split(','),
    level = 'log',
    logEntry = true,
    logExit = true,
    logError = true,
    message = '',
  } = options

  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    // Determine if the method is static by checking if target is a function (constructor for static methods) or an object (prototype for instance methods)
    const isStaticMethod = typeof target === 'function'
    // Adjust the class name retrieval for static methods
    const className = isStaticMethod ? target.name : target.constructor.name

    const shouldLog = allowedLevels
      ? allowedLevels.includes(level as LogLevelEnum)
      : true

    descriptor.value = function (...args: any[]) {
      const logger = new Logger(className)
      if (shouldLog && logEntry) {
        logger[level](
          `${message}, Method: ${key}, Args: ${JSON.stringify(args)}`,
        )
      }

      try {
        const result = originalMethod.apply(this, args)
        // Check if the result is a Promise (asynchronous method)
        const isPromise = result instanceof Promise

        const handleResult = (resolvedResult: any) => {
          if (shouldLog && logExit) {
            logger[level](
              `${message}, Method: ${key}, Result: ${JSON.stringify(
                resolvedResult,
              )}`,
            )
          }
          return resolvedResult
        }

        // If the method is asynchronous, wait for the promise to resolve before logging the exit
        return isPromise ? result.then(handleResult) : handleResult(result)
      } catch (error) {
        if (shouldLog && logError) {
          logger.error(
            `${message}, Method: ${key} has failed with error: ${error}`,
          )
        }
        throw error
      }
    }

    return descriptor
  }
}
