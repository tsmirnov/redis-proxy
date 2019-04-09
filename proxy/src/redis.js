import bluebird from 'bluebird'
import redis from 'redis'

bluebird.promisifyAll(redis)

export const client = redis.createClient(process.env.REDIS_URL)

process.on('exit', () => client.quit())
