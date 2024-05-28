import { SelectUserEvent } from 'tsdb'
import { instanceToPlain } from 'class-transformer'
import { ResultsWithMetadata } from 'shared'

export class FindAllUserEventsMapper {
  static fromEntity(
    queryResult: ResultsWithMetadata<SelectUserEvent>,
  ): ResultsWithMetadata {
    return {
      ...queryResult,
      results: queryResult.results.map(FindUserEventsMapper.fromEntity),
    }
  }
}

export class FindUserEventsMapper {
  static fromEntity(userEvent: SelectUserEvent) {
    return instanceToPlain(userEvent)
  }
}
