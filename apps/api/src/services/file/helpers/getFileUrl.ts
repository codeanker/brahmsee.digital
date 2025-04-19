import { BlobSASPermissions } from '@azure/storage-blob'
import type { File } from '@prisma/client'
import dayjs from 'dayjs'
import { createReadStream, ReadStream } from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { azureStorage } from '../../../azureStorage.js'
import config from '../../../config.js'

const downloadUrlLifespan = 60 * 60 // 1 hour

export const uploadDir = join(cwd(), config.fileProviders.LOCAL.path)

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

export async function openFileStream(file: File) {
  if (file.provider === 'LOCAL') {
    return createReadStream(uploadDir + '/' + file.key)
  }

  if (file.provider === 'AZURE' && azureStorage !== null) {
    const containerClient = azureStorage.getContainerClient(config.fileProviders.AZURE.container)
    const blockBlobClient = containerClient.getBlockBlobClient(file.key)
    const response = await blockBlobClient.download()
    if (!response.readableStreamBody) {
      throw new Error('failed downloading file')
    }
    return ReadStream.from(response.readableStreamBody)
  }

  throw new Error('Unknown file provider')
}
