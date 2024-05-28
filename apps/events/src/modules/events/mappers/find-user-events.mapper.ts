import { SelectUserEvent } from 'tsdb'
import { instanceToPlain } from 'class-transformer'
import { ResultsWithMetadata } from 'shared'

export class FindAllUserEventsMapper {
  static fromEntity(
    queryResult: ResultsWithMetadata<SelectUserEvent>,
  ): ResultsWithMetadata {
    return {
      ...queryResult,
      results: queryResult.results.map((userEvent) =>
        instanceToPlain(userEvent),
      ),
    }
  }
}

export class FindUserEventsMapper {
  static fromEntity(userEvent: SelectUserEvent) {
    return instanceToPlain(userEvent)
  }
}
