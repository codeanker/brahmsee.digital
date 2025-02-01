import { BlockBlobClient } from '@azure/storage-blob'

import { apiClient } from '@/api'

export function handleUpload(file: File): Promise<{ id: string }>
export function handleUpload(file: File[]): Promise<{ id: string }[]>

/**
 * Upload file
 * @param file
 */
export async function handleUpload(file: File | File[]) {
  if (Array.isArray(file)) {
    const results: { id: string }[] = []
    for await (const el of file) {
      results.push(await handleUpload(el))
    }
    return results
  }

  const dbFile = await apiClient.file.fileCreate.mutate({ mimetype: file.type })

  const formData = new FormData()
  formData.append('file', file)

  if (dbFile.provider === 'LOCAL') {
    const response = await fetch(`/api/upload/file/LOCAL/${dbFile.id}`, {
      method: 'POST',
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
