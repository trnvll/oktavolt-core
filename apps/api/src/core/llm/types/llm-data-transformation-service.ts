import { schema } from 'database'

export type LlmDataTransformationEntityType = Partial<keyof typeof schema>
