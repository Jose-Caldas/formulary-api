import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import getUsers from './routes/user/getUsers'
import createUser from './routes/user/createUser'

const url = 'http://localhost:8080/users'

describe('Fastify Server', () => {
  let server: FastifyInstance

  beforeAll(async () => {
    server = Fastify()
    server.register(cors)
    server.register(getUsers)
    server.register(createUser)
    await server.listen({ port: 8081 })
  })

  afterAll(async () => {
    await server.close()
  })

  it('should register route: GET', async () => {
    const response = await server.inject({
      method: 'GET',
      url,
    })
    expect(response.statusCode).toBe(200)
  })

  it('should register route: POST', async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowString = tomorrow.toISOString().split('T')[0]

    const response = await server.inject({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'John Doe',
        genero: 'Masculino',
        termosAceitos: true,
        dataConsulta: tomorrowString,
        tipoSanguineo: 'B+',
      }),
    })
    expect(response.statusCode).toBe(201)
  })

  it('should handle CORS', async () => {
    const response = await server.inject({
      method: 'OPTIONS',
      url: 'http://localhost:5173/',
      headers: {
        Origin: url,
        'Access-Control-Request-Method': 'GET',
      },
    })
    expect(response.statusCode).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe('*')
  })
})
