import assert from 'assert'
import fetch from 'node-fetch'
import uuid from 'uuid/v4'

describe('HTTP web service', () => {
  it('should connect through HTTP', async () => {
    const res = await fetch(`${process.env.PROXY_URL}/healthcheck`)
    assert.equal(res.status, 200)
  })

  it('should return 404 if key not found', async() => {
    const key = uuid()
    const res = await fetch(`${process.env.PROXY_URL}/get?key=${key}`)
    assert.equal(res.status, 404)
  })

  it('should return 400 if bad request', async() => {
    const res = await fetch(`${process.env.PROXY_URL}/get`)
    assert.equal(res.status, 400)
  })
})
