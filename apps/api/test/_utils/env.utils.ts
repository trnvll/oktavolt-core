import { EnvironmentVariables } from '@/config/env/environment-variables'

export const testEnvConfig: Partial<EnvironmentVariables> = {
  AWS_REGION: 'eu-central-1',
  AUTH0_DOMAIN: 'auth0_domain',
  DATABASE_URL: 'postgres://testuser:testpass@0.0.0.0:5432/testdb',
  SQS_USER_EVENTS_QUEUE_URL: 'sqs_user_events_queue_url',
  OPENAI_API_KEY: 'openai_api_key',
  NOVU_API_KEY: 'novu_api_key',
}
