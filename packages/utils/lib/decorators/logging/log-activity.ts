import { Logger } from '@nestjs/common'

interface LogOptions {
  level?: 'log' | 'error' | 'warn' | 'debug' | 'verbose'
  logEntry?: boolean
  logExit?: boolean
  logError?: boolean
  message?: string // Optional log message
}

export function LogActivity(options: LogOptions = {}) {
  const {
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

    descriptor.value = function (...args: any[]) {
      const logger = new Logger(className)
      if (logEntry) {
        logger[level](
          `${message}, Method: ${key}, Args: ${JSON.stringify(args)}`,
        )
      }

      try {
        const result = originalMethod.apply(this, args)
        // Check if the result is a Promise (asynchronous method)
        const isPromise = result instanceof Promise

        const handleResult = (resolvedResult: any) => {
          if (logExit) {
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
        if (logError) {
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