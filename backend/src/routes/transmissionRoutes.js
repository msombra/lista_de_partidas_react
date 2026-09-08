import { Router } from 'express'

import { transmissionController } from '../controllers/transmissionController.js'

export const transmissionRoutes = Router()

transmissionRoutes.get('/', transmissionController.index)
transmissionRoutes.get('/:id', transmissionController.show)
transmissionRoutes.post('/', transmissionController.create)
transmissionRoutes.put('/:id', transmissionController.update)
transmissionRoutes.delete('/:id', transmissionController.delete)
