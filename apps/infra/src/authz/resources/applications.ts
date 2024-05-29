import { Client, ClientArgs } from '@pulumi/auth0'
import { getApplicationResourceDefs } from '../defs/applications'

export class ApplicationResources {
  private resourceDefs: ClientArgs[]

  constructor() {
    this.resourceDefs = getApplicationResourceDefs()
  }

  public async deploy() {
    console.log('Deploying applications...')

    await Promise.all(
      this.resourceDefs.map((resourceDef) => {
        return this.createOrUpdateResource(resourceDef)
      }),
    )

    console.log('Application creation process completed.')
  }

  async createOrUpdateResource(resourceDef: ClientArgs) {
    const client = new Client(`client-${resourceDef.name}`, {
      name: resourceDef.name,
      appType: resourceDef.appType,
      callbacks: resourceDef.callbacks,
      allowedLogoutUrls: resourceDef.allowedLogoutUrls,
      allowedOrigins: resourceDef.allowedOrigins,
      webOrigins: resourceDef.webOrigins,
      grantTypes: resourceDef.grantTypes,
    })

    return client
  }
}
