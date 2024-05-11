import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { PostgresError } from 'postgres'

@Catch(PostgresError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name)

  catch(exception: PostgresError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    let status = HttpStatus.INTERNAL_SERVER_ERROR

    let message = 'Internal server error'

    if (exception.message.includes('unique constraint')) {
      status = HttpStatus.CONFLICT
      message =
        'Duplicate entry error. The data you are trying to insert already exists.'
    }

    this.logger.error(
      `HTTP ${status} Response: ${message}`,
      exception.stack,
      `${request.method} ${request.url}`,
    )

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    })
  }
}
