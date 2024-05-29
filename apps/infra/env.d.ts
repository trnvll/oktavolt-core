declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    AUTH0_MGMT_CLIENT_ID: string
    AUTH0_MGMT_CLIENT_SECRET: string
    AUTH0_DOMAIN: string
  }
}
