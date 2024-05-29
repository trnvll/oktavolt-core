import { envConfig } from '@/config/env/env.config'
import { ClientArgs } from '@pulumi/auth0'

export function getApplicationResourceDefs(): ClientArgs[] {
  const localhost = 'http://localhost:3000'
  const domain = envConfig.get('AUTH0_DOMAIN')
  return [
    {
      name: 'Oktavolt Platform SPA',
      appType: 'spa',
      callbacks: [
        [localhost, 'auth/callback'].join('/'),
        [domain, 'auth/callback'].join('/'),
      ],
      allowedLogoutUrls: [
        [localhost, 'auth/logout'].join('/'),
        [domain, 'auth/logout'].join('/'),
      ],
      allowedOrigins: [domain, localhost],
      webOrigins: [domain, localhost],
      grantTypes: ['authorization_code', 'refresh_token'],
    },
  ]
}
