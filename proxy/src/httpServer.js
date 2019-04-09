import Koa from 'koa'
import Router from 'koa-router'
import { get } from './cache'

const app = new Koa()
const router = new Router()

router.get('/healthcheck', async (ctx) => {
  ctx.status = 200
})

router.get('/get', async (ctx) => {
  const key = ctx.request.query.key
  if (!key) {
    ctx.status = 400
    return
  }

  ctx.set('Cache-Control', `max-age=${process.env.CACHE_TTL}`)
  const value = await get(key)
  if (value === null) {
    ctx.status = 404
    return
  }
  ctx.body = value
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(80)
