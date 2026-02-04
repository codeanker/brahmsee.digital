/**
 * Create, update and delete documents
 * @param addFiles
 * @param updateFiles
 * @param deleteFilesIds
 */
export function crudFiles(
  addFiles?: { name: string; fileId: string }[],
  updateFiles?: { id: string; name: string }[],
  deleteFilesIds?: string[]
) {
  // Documents create, update, delete
  const files: {
    createMany?: { data: { name: string; fileId: string }[] }
    updateMany?: { where: { id: string }; data: { name: string } }[]
    deleteMany?: { id: string }[]
  } = {}
  if (addFiles) {
    files.createMany = {
      data: addFiles.map((doc) => ({ ...doc, fileId: doc.fileId })),
    }
  }
  if (updateFiles) {
    files.updateMany = updateFiles.map((doc) => ({
      where: { id: doc.id },
      data: { name: doc.name },
    }))
  }
  if (deleteFilesIds) {
    files.deleteMany = deleteFilesIds.map((id) => ({ id }))
  }

  return files
}
