import config from '../../../config.js'
import { azureStorage } from '../../../azureStorage.js'
import dayjs from 'dayjs'
import { BlobSASPermissions } from '@azure/storage-blob'

export type File = {
  id: string
  provider: 'LOCAL' | 'AZURE'
  uploaded: boolean
  key: string
}

const downloadUrlLifespan = 60 * 60 // 1 hour

export async function getFileUrl(file: File) {
  if (file.provider === 'LOCAL') {
    if (!file.uploaded) throw new Error('File is not uploaded')
    return new URL(`/api/download/file/${file.provider}/${file.id}`, config.clientUrl).href
  }
  if (file.provider === 'AZURE' && azureStorage !== null) {
    const containerClient = azureStorage.getContainerClient(config.fileProviders.AZURE.container)
    const blockBlobClient = containerClient.getBlockBlobClient(file.key)
    return await blockBlobClient.generateSasUrl({
      startsOn: dayjs().subtract(5, 'minute').toDate(),
      expiresOn: dayjs().add(downloadUrlLifespan, 'seconds').toDate(),
      permissions: BlobSASPermissions.from({ read: true }),
    })
  }
  throw new Error('Unknown file provider')
}
