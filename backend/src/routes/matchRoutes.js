import { Router } from 'express'

import { matchController } from '../controllers/matchController.js'

export const matchRoutes = Router()

matchRoutes.get('/', matchController.index)
matchRoutes.get('/:id', matchController.show)
matchRoutes.post('/', matchController.create)
matchRoutes.put('/:id', matchController.update)
matchRoutes.delete('/', matchController.deleteAll)
matchRoutes.delete('/:id', matchController.delete)
