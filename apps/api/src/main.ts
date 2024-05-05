import { DatabaseExceptionFilter } from '@/filters/database-exception.filter'

if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from '@/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useGlobalFilters(new DatabaseExceptionFilter())

  await app.listen(process.env.PORT || 8080)
}
void bootstrap()
