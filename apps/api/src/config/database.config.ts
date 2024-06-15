const getDatabaseConfig = () => {
  return {
    database: {
      uri: process.env.DATABASE_URI,
      tsdbUri: process.env.TS_DATABASE_URI,
    },
  }
}

export const databaseConfig = getDatabaseConfig
export type DatabaseConfig = ReturnType<typeof getDatabaseConfig>['database']
export type RootDatabaseConfig = ReturnType<typeof getDatabaseConfig>
