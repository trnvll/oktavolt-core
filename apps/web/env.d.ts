declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_PLATFORM_URL: string
    [key: string]: string | undefined
  }
}
