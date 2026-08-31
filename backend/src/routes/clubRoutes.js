import { Router } from 'express'

import { clubController } from '../controllers/clubController.js'

export const clubRoutes = Router()

clubRoutes.get('/', clubController.index)
clubRoutes.get('/:id', clubController.show)
clubRoutes.post('/', clubController.create)
clubRoutes.put('/:id', clubController.update)
clubRoutes.delete('/:id', clubController.delete)
