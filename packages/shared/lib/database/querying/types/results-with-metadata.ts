export interface ResultsWithMetadata<
  TResult = Record<string, any>,
  TMetadata = PaginationMetadata,
> {
  results: TResult[]
  metadata: TMetadata
}

export interface PaginationMetadata {
  page: number
  pageSize: number
  totalPages: number
  totalResults: number
}
