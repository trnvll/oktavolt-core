declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    IS_TS_NODE: string
    DATABASE_URL: string
    AUTH0_MGMT_CLIENT_ID: string
    AUTH0_MGMT_CLIENT_SECRET: string
  }
}
