import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import { DatabaseExceptionFilter } from '@/filters/database-exception.filter'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { AppModule } from '@/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import helmet from '@fastify/helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import metadata from '@/metadata'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      logger: ['error', 'warn', 'log'],
    },
  )

  const config = new DocumentBuilder()
    .setTitle('Oktavolt API Specification')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('v1')
    .build()

  await SwaggerModule.loadPluginMetadata(metadata)
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
