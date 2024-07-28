import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from '@/app.module'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import metadata from '@/metadata'
import * as fs from 'fs'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, {
    preview: true,
    abortOnError: false,
  })

  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Oktavolt API Specification')
    .setVersion('1.0')
    .build()

  await SwaggerModule.loadPluginMetadata(metadata)
  const document = SwaggerModule.createDocument(app, config)

  fs.writeFileSync('openapi.json', JSON.stringify(document))
  process.exit()
}
void bootstrap()
