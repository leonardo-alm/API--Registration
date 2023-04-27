import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { authMiddleware } from './middlewares/authMiddleware'

const routes = Router()

routes.post('/user', new UserController().create)
routes.post('/login', new UserController().login)

routes.use(authMiddleware)

routes.get('/user', new UserController().getCurrentUser)

export default routes
