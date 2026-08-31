import { Router } from 'express'

import { championshipRoutes } from './championshipRoutes.js'
import { clubRoutes } from './clubRoutes.js'
import { matchRoutes } from './matchRoutes.js'

export const routes = Router()

routes.get('/health', (_request, response) => {
    response.json({ status: 'ok' })
})
routes.use('/championships', championshipRoutes)
routes.use('/clubs', clubRoutes)
routes.use('/matches', matchRoutes)
