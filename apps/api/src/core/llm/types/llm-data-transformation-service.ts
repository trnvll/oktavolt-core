import { schema } from 'database'

export type LlmDataTransformationEntityType = keyof Pick<
  typeof schema,
  'users' | 'prefs' | 'relations' | 'comms' | 'chats'
>
