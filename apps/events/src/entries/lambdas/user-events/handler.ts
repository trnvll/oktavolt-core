if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}

import { validateOrReject } from 'class-validator'
import { INestApplicationContext } from '@nestjs/common'
import { EventsService } from '@/modules/events/services/events.service'

import { NestFactory } from '@nestjs/core'
import * as dotenv from 'dotenv'
import { AppModule } from '@/app.module'
import { CreateEventDto } from 'shared'
import { plainToInstance } from 'class-transformer'
import { SQSEvent } from 'aws-lambda'

dotenv.config()

let cachedApp: INestApplicationContext

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.createApplicationContext(AppModule)
    cachedApp = app
  }
  return cachedApp
}

export const handler = async (event: SQSEvent) => {
  console.log('EventBridge event', JSON.stringify(event, null, 2))

  const app = await bootstrap()
  const eventsService = app.get(EventsService)

  try {
    const body = JSON.parse(event.Records[0].body)

    const createEventDto = plainToInstance(CreateEventDto, body)
    await validateOrReject(createEventDto)

    return await eventsService.createUserEvent(createEventDto)
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await app.close()
  }
}
