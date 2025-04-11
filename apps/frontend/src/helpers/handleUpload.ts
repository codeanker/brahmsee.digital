import { BlockBlobClient } from '@azure/storage-blob'

import { apiClient } from '@/api'
import type { RouterInput, RouterOutput } from '@codeanker/api'

type uploadedFile = {
  id: string
  mimetype: string
}
type uploadedFiles = uploadedFile[]

type dbFile = RouterOutput['file']['fileCreate']

export function handleUpload(file: File): Promise<{ id: string; mimetype: string }>
export function handleUpload(file: File[]): Promise<{ id: string; mimetype: string }[]>

/**
 * Upload file
 * @param file
 */
export async function handleUpload(file: File | File[]): Promise<uploadedFiles | uploadedFile> {
  if (Array.isArray(file)) {
    const files: uploadedFiles = []
    for await (const element of file) {
      const dbFile = await apiClient.file.fileCreate.mutate({ mimetype: element.type })
      const res = await uploadFile(element, dbFile)
      if (res) files.push(res)
    }
    return files
  } else {
    const dbFile = await apiClient.file.fileCreate.mutate({ mimetype: file.type })
    return await uploadFile(file, dbFile)
  }
}

export async function handlePublicPhotoUpload(
  file: File,
  payload: Omit<RouterInput['file']['anmeldungPublicFotoUpload'], 'mimetype'>
) {
  const dbFile = await apiClient.file.anmeldungPublicFotoUpload.mutate({ mimetype: file.type, ...payload })
  return await uploadFile(file, dbFile)
}

async function uploadFile(file: File, dbFile: dbFile): Promise<uploadedFile> {
  const formData = new FormData()
  formData.append('file', file)

  if (dbFile.provider === 'LOCAL') {
    const response = await fetch(`/api/upload/file/LOCAL/${dbFile.id}`, {
      method: 'POST',
      body: formData,
    })
    if (response.status != 201) throw new Error(`Failed to upload file: ${await response.text()}`)

    return { id: dbFile.id, mimetype: file.type }
  } else if (dbFile.provider === 'AZURE') {
    const blobServiceClient = new BlockBlobClient(dbFile.azureUploadUrl as string)
    await blobServiceClient.upload(file, file.size, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    })
    return { id: dbFile.id, mimetype: file.type }
  } else throw new Error(`File provider '${dbFile.provider}' is not supported.`)
}
