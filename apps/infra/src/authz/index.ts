import { ApplicationResources } from './resources/applications'

async function main() {
  const applicationResources = new ApplicationResources()
  await applicationResources.deploy()
}

main()
  .then(() => {
    console.log('Applications deployment completed.')
  })
  .catch((err) => {
    console.error('Applications deployment failed.', err)
  })
