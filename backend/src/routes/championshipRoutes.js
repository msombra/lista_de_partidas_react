import { Router } from 'express'

import { championshipController } from '../controllers/championshipController.js'

export const championshipRoutes = Router()

championshipRoutes.get('/', championshipController.index)
championshipRoutes.get('/:id', championshipController.show)
championshipRoutes.post('/', championshipController.create)
championshipRoutes.put('/:id', championshipController.update)
championshipRoutes.delete('/:id', championshipController.delete)
