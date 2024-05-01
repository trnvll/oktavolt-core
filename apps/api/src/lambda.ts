if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schema from './database/schema.prisma'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import x from '../../../../node_modules/prisma/libquery_engine-rhel-openssl-1.0.x.so.node'

if (process.env.NODE_ENV !== 'production') {
  console.debug(schema, x)
}

import { NestFactory } from '@nestjs/core'

import express from 'express'
import serverlessExpress from '@vendia/serverless-express'
import { ExpressAdapter } from '@nestjs/platform-express'
import { AppModule } from '@/app.module'
import { Context, Handler } from 'aws-lambda'
import { ValidationPipe } from '@nestjs/common'

import * as dotenv from 'dotenv'

dotenv.config()

let cachedServer: Handler

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express()
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    )

    nestApp.useGlobalPipes(new ValidationPipe())
    nestApp.enableCors()

    await nestApp.init()

    cachedServer = serverlessExpress({ app: expressApp })
  }

  return cachedServer
}

export const handler = async (event: any, context: Context, callback: any) => {
  console.log('EVENT', JSON.stringify(event))

  const server = await bootstrap()
  const response = await server(event, context, callback)

  console.log('RESPONSE', JSON.stringify(response))

  return response
}
