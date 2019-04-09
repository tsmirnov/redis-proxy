import assert from 'assert'
import { client } from './redis'
import get from './get'

const CONNECTION_NUMBER = 100

describe('Parallel concurrent processing', () => {
  before(async () => {
    for (let i = 0; i < CONNECTION_NUMBER; i++) {
      await client.setAsync(i, String(i))
    }
  })

  it('#asynchronous', async () => {
    const array = [...Array(CONNECTION_NUMBER).keys()]

    const response = []
    await Promise.all(
      array.map(async (key) => {
        const value = await get(key)
        response.push(value)
      })
    )

    assert.notDeepEqual(response, array)
  })

  it('#synchronous', async () => {
    const array = [...Array(CONNECTION_NUMBER).keys()]

    const response = []
    for (let i = 0; i < CONNECTION_NUMBER; i++) {
      const value = await get(i)
      response.push(value)
    }

    assert.deepEqual(response, array)
  })
})
