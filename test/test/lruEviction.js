import assert from 'assert'
import { client } from './redis'
import get from './get'
import uuid from 'uuid/v4'

describe('LRU Eviction', () => {
  it('should delete last recently used key', async function() {
    // set a key which will be removed from cache
    const key = uuid()
    await client.setAsync(key, 'value1')
    const value1 = await get(key)
    assert.equal(value1, 'value1')

    // fill cache capacity
    // all requests are sent concurrently
    const capacity = Number(process.env.CAPACITY)
    await Promise.all(
      [...Array(capacity)].map(async () => {
        await get(uuid())
      })
    )

    // update key with a new value
    await client.setAsync(key, 'value2')

    // value must be immediately updated
    const value2 = await get(key)
    assert.equal(value2, 'value2')
  })
})
