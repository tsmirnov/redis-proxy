import assert from 'assert'
import { client, proxyRespClient } from './redis'
import uuid from 'uuid/v4'

describe('Redis client protocol', () => {
  it('#info', async () => {
    const info = await proxyRespClient.infoAsync()
    assert.equal(info, '¯\\_(ツ)_/¯')
  })

  it('#ping', async () => {
    const pong = await proxyRespClient.pingAsync()
    assert.equal(pong, 'PONG')
  })

  it('#get', async () => {
    const key = uuid()
    await client.setAsync(key, 'value1')
    const value = await proxyRespClient.getAsync(key)
    assert.equal(value, 'value1')
  })
})
