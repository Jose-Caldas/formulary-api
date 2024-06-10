import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { users } from '../../schema/userSchema'

async function getUsers(app: FastifyInstance) {
  app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send(users)
  })
}

export default getUsers
