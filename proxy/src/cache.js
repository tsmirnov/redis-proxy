import { client } from './redis'

const cache = new Map()

export const get = async (key) => {
  const now = Math.floor(Date.now() / 1000)
  const expirityTime = Number(process.env.CACHE_TTL)

  // if cache has reached it's capacity
  // remove LRU
  const capacity = Number(process.env.CAPACITY)
  while (cache.size > capacity) {
    const lru = cache.keys().next().value
    cache.delete(lru)
  }

  // if key is in cache and cache is not expired
  // return from cache
  if (cache.has(key)
    && now - cache.get(key).time < expirityTime
  ) {
    const item = cache.get(key)
    cache.delete(key)
    cache.set(key, item)
    return item.value
  }

  // get value from backing Redis
  // and put key to cache
  const value = await client.getAsync(key)
  cache.set(key, {
    value,
    time: now,
  })
  return value
}
