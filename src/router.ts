import createUser from './routes/user/createUser'
import getUsers from './routes/user/getUsers'
import { app } from './server'

const router = async () => {
  await app.register(getUsers)
  await app.register(createUser)
}

export default router
