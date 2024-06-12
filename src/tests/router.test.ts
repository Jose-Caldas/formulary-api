import { describe, test, expect, beforeEach, vi, beforeAll } from 'vitest'
import { app } from '../server'
import createUser from '../routes/user/createUser'
import getUsers from '../routes/user/getUsers'
import router from '../router'

describe('Router', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should register createUser and getUsers routes', async () => {
    const registerMock = vi
      .spyOn(app, 'register')
      .mockImplementation(() => Promise.resolve())

    await router()

    expect(registerMock).toHaveBeenCalledWith(getUsers)
    expect(registerMock).toHaveBeenCalledWith(createUser)
  })
})
