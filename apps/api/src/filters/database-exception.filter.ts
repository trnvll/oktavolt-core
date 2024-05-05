import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { PostgresError } from 'postgres'

@Catch(PostgresError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: PostgresError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    let status = HttpStatus.INTERNAL_SERVER_ERROR

    let message = 'Internal server error'

    if (exception.message.includes('unique constraint')) {
      status = HttpStatus.CONFLICT
      message =
        'Duplicate entry error. The data you are trying to insert already exists.'
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message: message,
    })
  }
}
