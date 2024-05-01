import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    let message: string
    let statusCode = 500

    switch (exception.code) {
      case 'P2002':
        message =
          'A unique constraint would be violated, data duplication detected.'
        statusCode = 400
        break
      case 'P2025':
        message = 'The requested record was not found.'
        statusCode = 404
        break
      default:
        message = 'An unexpected error occurred.'
        break
    }

    console.error(exception)

    response.status(statusCode).json({
      statusCode,
      message,
      error: exception.message,
      timestamp: new Date().toISOString(),
    })
  }
}
