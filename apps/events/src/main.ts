if (!Boolean(process.env.IS_TS_NODE)) {
  require('module-alias/register')
}

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  await app.listen(Number(process.env.PORT) || 8080)
}
void bootstrap()
