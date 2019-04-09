import fetch from 'node-fetch'
import bluebird from 'bluebird'
import redis from 'redis'

bluebird.promisifyAll(redis)

export default async (key) => {
  if (process.env.PROXY_PROTOCOL === 'RESP') {
    const proxyRespClient = redis.createClient(process.env.PROXY_RESP_URL)
    const value = await proxyRespClient.getAsync(key)
    proxyRespClient.quit()
    return value
  }

  const res = await fetch(`${process.env.PROXY_URL}/get?key=${key}`)
  return res.text()
}
