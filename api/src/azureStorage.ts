import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'

import config from './config.js'

const isAzureConfigured =
  config.fileProviders.AZURE.account !== '' &&
  config.fileProviders.AZURE.accountKey !== '' &&
  config.fileProviders.AZURE.container !== ''

async function init() {
  if (!isAzureConfigured) return null
  const account = config.fileProviders.AZURE.account
  const accountKey = config.fileProviders.AZURE.accountKey
  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey)

  const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential)

  // Check if container exists, if not create it
  const containerClient = blobServiceClient.getContainerClient(config.fileProviders.AZURE.container)
  if (!(await containerClient.exists())) await containerClient.create()
  return blobServiceClient
}

export let azureStorage: BlobServiceClient | null = null

init()
  .then((blobServiceClient) => (azureStorage = blobServiceClient))
  .catch((e) => {
    console.error('Failed to initialize Azure Blob Storage', e)
  })
