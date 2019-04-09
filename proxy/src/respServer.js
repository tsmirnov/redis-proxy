import net from 'net'
import { get } from './cache'

const server = net.createServer(c => {
  c.on('data', async (chunk) => {
    const request = chunk.toString()
    const params = request.split('\r\n')
    const command = params[2]
    if (command === 'get') {
      const key = params[4]
      const value = await get(key)
      if (value === null) {
        c.write('$-1\r\n')
        return
      }
      c.write(`$${value.length}\r\n${value}\r\n`)
      return
    }
    if (command === 'info') {
      c.write('+¯\\_(ツ)_/¯\r\n')
      return
    }
    if (command === 'ping') {
      c.write('+PONG\r\n')
      return
    }
    if (command === 'quit') {
      c.write('+OK\r\n')
      c.destroy()
      return
    }

    c.write(`-ERR Bad Request ${request.replace(/\r\n/g, '\\r\\n')}\r\n`)
  })
})

server.listen(6379)
