declare namespace NodeJS {
  interface ProcessEnv {
    IS_TS_NODE: string
    NODE_ENV: string
    AUTH0_ISSUER_URL: string
    AUTH0_AUDIENCE: string
    AUTH0_CLIENT_ID: string
    AUTH0_CLIENT_SECRET: string
    POSTGRES_USER: string
    POSTGRES_PASSWORD: string
    PLATFORM_URL: string
    PORT: string
  }
}
