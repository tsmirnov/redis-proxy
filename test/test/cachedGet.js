import { client } from './redis'
import get from './get'
import assert from 'assert'
import uuid from 'uuid/v4'

describe('Cached GET', () => {
  it('should return value', async () => {
    const key = uuid()
    await client.setAsync(key, 'value1')
    const res = await get(key)
    assert.equal(res, 'value1')
  })

  it('should return cache', async () => {
    const key = uuid()
    await client.setAsync(key, 'value1')
    const res = await get(key)
    assert.equal(res, 'value1')

    await client.setAsync(key, 'value2')
    const res2 = await get(key)
    assert.equal(res2, 'value1')
  })
})
