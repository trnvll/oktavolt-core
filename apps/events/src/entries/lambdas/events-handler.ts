if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}

import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as dotenv from 'dotenv'
import { AppModule } from '@/app.module'
import { CreateEventDto } from '@/modules/events/dtos/create-event.dto'
import { EventBridgeEvent } from 'aws-lambda'

dotenv.config()

let cachedApp: INestApplicationContext

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.createApplicationContext(AppModule)
    cachedApp = app
  }
  return cachedApp
}

type EventDto = EventBridgeEvent<'test', CreateEventDto>

export const handler = async (event: EventDto) => {
  console.log('EventBridge event', JSON.stringify(event, null, 2))

  const _app = await bootstrap()
}
