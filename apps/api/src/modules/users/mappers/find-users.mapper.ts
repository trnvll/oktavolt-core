import { ResultsWithMetadata } from 'shared'
import { instanceToPlain } from 'class-transformer'
import { SelectUser } from 'database'

export class FindAllUsersMapper {
  static fromEntity(
    queryResult: ResultsWithMetadata<SelectUser>,
  ): ResultsWithMetadata {
    return {
      ...queryResult,
      results: queryResult.results.map(FindUsersMapper.fromEntity),
    }
  }
}

export class FindUsersMapper {
  static fromEntity(userEvent: SelectUser) {
    return instanceToPlain(userEvent, { excludePrefixes: ['deleted'] })
  }
}
