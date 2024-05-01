if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from '@/app.module'
import { PrismaErrorFilter } from '@/filters/prisma-error.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new PrismaErrorFilter())

  await app.listen(process.env.PORT || 8080)
}
void bootstrap()
