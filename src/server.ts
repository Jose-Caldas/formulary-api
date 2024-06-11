import Fastify from 'fastify'
import router from './router'
import cors from '@fastify/cors'

export const app = Fastify()
app.register(cors)

app.register(router)

const start = async () => {
  try {
    await app.listen({ port: 8080 })
    console.log('Server rodando em http://localhost:8080')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
