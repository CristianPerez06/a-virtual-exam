import { readCacheList, writeCacheList } from '../../common/apolloCacheHelpers'
import { addItemToList, updateItemInList, removeItemFromList } from '../../common/arrayHelpers'
import { LIST_UNITS } from './requests'

export const syncCacheOnCreate = (cache, item, query) => {
  // Read Cache Query
  const { listUnits } = readCacheList(cache, LIST_UNITS, { q: '', offset: 0, limit: 100 })
  // If list is not in cache yet then we don't do anything
  if (!listUnits) return
  // Add new item to list
  const newList = addItemToList(listUnits.data, item)
  // Update Cache Query
  const listToCache = {
    data: [...newList], count: newList.length, __typename: item.__typename
  }
  writeCacheList(cache, LIST_UNITS, { listUnits: { ...listToCache } })
  return listToCache
}

export const syncCacheOnUpdate = (cache, item, query) => {
  // Read Cache
  const { listUnits } = readCacheList(cache, LIST_UNITS, { q: '', offset: 0, limit: 100 })
  // If list is not in cache yet then we don't do anything
  if (!listUnits) return
  // Update item in list
  const newList = updateItemInList(listUnits.data, item)
  // Update Cache
  const listToCache = {
    data: [...newList], count: newList.length, __typename: item.__typename
  }
  writeCacheList(cache, LIST_UNITS, { listUnits: { ...listToCache } })
  return listToCache
}

export const syncCacheOnDelete = (cache, item, query) => {
  // Read Cache
  const { listUnits } = readCacheList(cache, LIST_UNITS, { q: '', offset: 0, limit: 100 })
  // If list is not in cache yet then we don't do anything
  if (!listUnits) return
  // Remove item from list
  const newList = removeItemFromList(listUnits.data, item)
  // Update Cache
  const listToCache = {
    data: [...newList], count: newList.length, __typename: item.__typename
  }
  writeCacheList(cache, LIST_UNITS, { listUnits: { ...listToCache } })
  return listToCache
}
