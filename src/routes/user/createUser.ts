import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { userSchema, users } from '../../schema/userSchema'

async function createUser(app: FastifyInstance) {
  app.post('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const result = userSchema.safeParse(request.body)

    if (!result.success) {
      reply.status(400).send(result.error.message)
      return
    }

    const newUser = result.data

    users.push(newUser)
    reply.status(201).send(newUser)
  })
}

export default createUser
