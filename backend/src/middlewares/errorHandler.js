import { Prisma } from '@prisma/client'

import { AppError } from '../errors/AppError.js'

export const errorHandler = (error, _request, response, _next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message })
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return response.status(409).json({
                message: 'Já existe um registro com esses dados.',
            })
        }

        if (error.code === 'P2003') {
            return response.status(409).json({
                message: 'O registro possui vínculos e não pode ser excluído.',
            })
        }

        if (error.code === 'P2025') {
            return response.status(404).json({ message: 'Registro não encontrado.' })
        }
    }

    console.error(error)
    return response.status(500).json({ message: 'Erro interno do servidor.' })
}
