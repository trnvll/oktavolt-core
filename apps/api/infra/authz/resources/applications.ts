import { envConfig } from '@/config/env/env.config'

export function getApplications() {
  const localhost = 'http://localhost:3000'
  const domain = envConfig.get('AUTH0_DOMAIN')
  return [
    {
      name: 'Oktavolt Platform SPA',
      app_type: 'spa',
      callbacks: [
        [localhost, 'auth/callback'].join('/'),
        [domain, 'auth/callback'].join('/'),
      ],
      allowed_logout_urls: [
        [localhost, 'auth/logout'].join('/'),
        [domain, 'auth/logout'].join('/'),
      ],
      allowed_origins: [domain, localhost],
      web_origins: [domain, localhost],
      grant_types: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_method: 'none',
    },
  ]
}
