import 'dotenv/config'

import { app } from './app.js'
import { prisma } from './lib/prisma.js'

const port = Number(process.env.PORT) || 3001
const server = app.listen(port, () => {
    console.log(`API disponível em http://localhost:${port}/api`)
})

const shutdown = async () => {
    server.close(async () => {
        await prisma.$disconnect()
        process.exit(0)
    })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
