import 'dotenv/config'
import cors from 'cors'
import express from 'express'

import { errorHandler } from './middlewares/errorHandler.js'
import { routes } from './routes/index.js'

export const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())
app.use('/api', routes)
app.use((_request, response) => {
    response.status(404).json({ message: 'Rota não encontrada.' })
})
app.use(errorHandler)
