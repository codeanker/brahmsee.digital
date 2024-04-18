import { BlockBlobClient } from '@azure/storage-blob'

import { apiClient } from '@/api'

/**
 * Upload file
 * @param file
 */
export const handleUpload = async (file: File) => {
  const dbFile = await apiClient.file.fileCreate.mutate({ mimetype: file.type })

  const formData = new FormData()
  formData.append('file', file)

  if (dbFile.provider === 'LOCAL') {
    const response = await fetch(`/api/upload/file/LOCAL/${dbFile.id}`, {
      method: 'POST',
      headers: {
        // Authorization: 'Bearer ' + this.token, // TODO: authentication
      },
      body: formData,
    })
    if (response.status != 201) throw new Error(`Failed to upload file: ${await response.text()}`)

    return { id: dbFile.id }
  } else if (dbFile.provider === 'AZURE') {
    const blobServiceClient = new BlockBlobClient(dbFile.azureUploadUrl as string)
    await blobServiceClient.upload(file, file.size, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    })
    return { id: dbFile.id }
  } else throw new Error(`File provider '${dbFile.provider}' is not supported.`)
}
