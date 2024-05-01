const constants = () => {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    webUrl: process.env.NEXT_PUBLIC_WEB_URL,
    auth0: {
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
      clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      scope: process.env.NEXT_PUBLIC_AUTH0_SCOPE,
    },
  }
}

export const Constants = constants()
