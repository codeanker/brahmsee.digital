export function crudMiscellaneousItems(
  addMiscellaneousItems?: { title: string; content: string }[],
  updateMiscellaneousItems?: { id: string; title: string; content: string }[],
  deleteMiscellaneousItemIds?: string[]
) {
  // Miscellaneous create, update, delete
  const miscellaneousItems: {
    createMany?: { data: { title: string; content: string }[] }
    updateMany?: { where: { id: string }; data: { title: string; content: string } }[]
    deleteMany?: { id: string }[]
  } = {}
  if (addMiscellaneousItems) {
    miscellaneousItems.createMany = {
      data: addMiscellaneousItems.map((item) => ({ ...item })),
    }
  }
  if (updateMiscellaneousItems) {
    miscellaneousItems.updateMany = updateMiscellaneousItems.map((item) => ({
      where: { id: item.id },
      data: { title: item.title, content: item.content },
    }))
  }
  if (deleteMiscellaneousItemIds) {
    miscellaneousItems.deleteMany = deleteMiscellaneousItemIds.map((id) => ({ id }))
  }

  return miscellaneousItems
}
