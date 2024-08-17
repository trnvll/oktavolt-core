import { schema } from 'database'

export type LlmDataTransformationEntityType = keyof Pick<
  typeof schema,
  'users' | 'chats'
>
