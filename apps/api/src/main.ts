if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}

import { NestFactory } from '@nestjs/core'
import { DatabaseExceptionFilter } from '@/filters/database-exception.filter'
import helmet from '@fastify/helmet'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from '@/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ['error', 'warn', 'log'],
    },
  )

  const config = new DocumentBuilder()
    .setTitle('Oktavolt API Specification')
    .setVersion('1.0')
    .build()

  // await SwaggerModule.loadPluginMetadata(metadata)
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.register(helmet)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useGlobalFilters(new DatabaseExceptionFilter())
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  await app.listen(process.env.PORT || 8080, '0.0.0.0')
}
void bootstrap()
