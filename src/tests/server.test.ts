import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import getUsers from '../routes/user/getUsers'
import createUser from '../routes/user/createUser'

const url = 'http://localhost:8080/users'
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowString = tomorrow.toISOString().split('T')[0]

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

  test('should register route: GET', async () => {
    const response = await server.inject({
      method: 'GET',
      url,
    })
    expect(response.statusCode).toBe(200)
  })

  test('should register route: POST', async () => {
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

  test('should show a message error if input(nome) is empty.', async () => {
    const response = await server.inject({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: '',
        genero: 'Masculino',
        termosAceitos: true,
        dataConsulta: tomorrowString,
        tipoSanguineo: 'B+',
      }),
    })
    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('O nome deve ter no mínimo 2 caracteres.')
  })

  test('should show a message error if input(genero) is empty.', async () => {
    const response = await server.inject({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'John Doe',
        genero: '',
        termosAceitos: true,
        dataConsulta: tomorrowString,
        tipoSanguineo: 'B+',
      }),
    })
    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('Selecione uma opção de gênero.')
  })

  test('should show a message error if input(termosAceitos) is false.', async () => {
    const response = await server.inject({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'John Doe',
        genero: 'Masculino',
        termosAceitos: false,
        dataConsulta: tomorrowString,
        tipoSanguineo: 'B+',
      }),
    })
    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('Você deve aceitar os termos.')
  })

  test('should show error message if date is before today', async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toISOString().split('T')[0]

    const response = await server.inject({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'John Doe',
        genero: 'Masculino',
        termosAceitos: true,
        dataConsulta: yesterdayString,
        tipoSanguineo: 'B+',
      }),
    })
    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('Selecione uma data depois de hoje.')
  })

  test('should show error message if input(tipoSanguineo) is empty', async () => {
    const response = await server.inject({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'John Doe',
        genero: 'Masculino',
        termosAceitos: true,
        dataConsulta: tomorrowString,
        tipoSanguineo: '',
      }),
    })
    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('Selecione uma opção de tipo sanguíneo.')
  })

  test('should handle CORS', async () => {
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
