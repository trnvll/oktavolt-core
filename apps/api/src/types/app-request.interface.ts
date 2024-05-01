interface RequestInterface<TUser> extends Request {
  user?: TUser
  params: Record<string, string | undefined>
  query: Record<string, string | undefined>
}

interface AppRequestUser {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
}

type AppRequestInterface = RequestInterface<AppRequestUser>

export type { AppRequestInterface, AppRequestUser }
