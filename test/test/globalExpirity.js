import assert from 'assert'
import { client } from './redis'
import get from './get'
import uuid from 'uuid/v4'

describe('Global expiry', () => {
  it('cache should expire', async function() {
    const timeout = Number(process.env.CACHE_TTL) * 1000
    this.timeout(timeout + 1000)
    const key = uuid()
    await client.setAsync(key, 'value1')
    await get(key)
    await client.setAsync(key, 'value2')

    // wait for half time of cache expiration
    await new Promise(resolve =>
      setTimeout(resolve, timeout / 2)
    )

    // not enough time has passed
    // value must be taken from cache
    const value = await get(key)
    assert.equal(value, 'value1')

    // wait for half time again
    await new Promise(resolve =>
      setTimeout(resolve, timeout / 2)
    )

    // value must be updated
    const value2 = await get(key)
    assert.equal(value2, 'value2')
  })
})
