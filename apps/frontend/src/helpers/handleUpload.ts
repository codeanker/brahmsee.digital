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
 * Uploads one or multiple files to the configured storage provider (Azure or Local).
 * Supports overloading to handle both single files and arrays of files.
 * @param file - A single File object or an array of File objects to upload
 * @returns A Promise resolving to the uploaded file metadata (id and mimetype)
 * @example
 * // Upload a single file
 * const result = await handleUpload(fileInput.files[0])
 * console.log(result.id) // File ID in database
 * 
 * // Upload multiple files
 * const results = await handleUpload([...fileInput.files])
 * results.forEach(file => console.log(file.id))
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

/**
 * Uploads a public photo for an Anmeldung (registration).
 * This is used for profile photos or other public images associated with registrations.
 * @param file - The file to upload
 * @param payload - Additional metadata for the public photo upload (excluding mimetype)
 * @returns A Promise resolving to the uploaded file metadata
 * @example
 * await handlePublicPhotoUpload(photoFile, { anmeldungId: 123 })
 */
export async function handlePublicPhotoUpload(
  file: File,
  payload: Omit<RouterInput['file']['anmeldungPublicFotoUpload'], 'mimetype'>
) {
  const dbFile = await apiClient.file.anmeldungPublicFotoUpload.mutate({ mimetype: file.type, ...payload })
  return await uploadFile(file, dbFile)
}

/**
 * Internal helper function that uploads a file to the appropriate storage provider.
 * Supports both LOCAL (via HTTP) and AZURE (via Azure Blob Storage) providers.
 * @param file - The file to upload
 * @param dbFile - Database file record with upload configuration
 * @returns The uploaded file metadata
 * @throws Error if the upload fails or if the provider is not supported
 * @internal
 */
async function uploadFile(file: File, dbFile: dbFile): Promise<uploadedFile> {
  const formData = new FormData()
  formData.append('file', file)

  if (dbFile.provider === 'LOCAL') {
    const response = await fetch(`/api/file/upload/LOCAL/${dbFile.id}`, {
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
