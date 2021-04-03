export const readCacheList = (cache, query, variables) => {
  const fromQuery = { query, variables }
  try {
    const result = cache.readQuery(fromQuery)
    return result
  } catch (e) {
    return {}
  }
}

export const writeCacheList = (cache, query, data) => {
  const toQuery = { query, data }
  cache.writeQuery(toQuery)
}