export const addItemToList = (list, item, sortByCreated = false) => {
  list.push(item)

  const sortMethod = sortByCreated
    ? (a, b) => new Date(b.created) - new Date(a.created)
    : (a, b) => a.name.localeCompare(b.name)

  const sortedList = list
    .sort(sortMethod)

  return sortedList
}

export const updateItemInList = (list, item, sortByCreated = false) => {
  if (!list) return

  let filteredList = list
    .filter(c => c.id !== item.id)

  filteredList.push(item)

  const sortMethod = sortByCreated
    ? (a, b) => new Date(b.created) - new Date(a.created)
    : (a, b) => a.name.localeCompare(b.name)

  filteredList = list
    .sort(sortMethod)

  return filteredList
}

export const removeItemFromList = (list, item, sortByCreated = false) => {
  if (!list) return

  const sortMethod = sortByCreated
    ? (a, b) => new Date(b.created) - new Date(a.created)
    : (a, b) => a.name.localeCompare(b.name)

  const filteredList = list
    .filter(c => c.id !== item.id)
    .sort(sortMethod)

  return filteredList
}
