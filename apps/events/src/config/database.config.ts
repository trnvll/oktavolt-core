const getDatabaseConfig = () => {
  return {
    database: {
      uri: process.env.TS_DATABASE_URL,
    },
  }
}

export const databaseConfig = getDatabaseConfig
export type DatabaseConfig = ReturnType<typeof getDatabaseConfig>['database']
export type RootDatabaseConfig = ReturnType<typeof getDatabaseConfig>