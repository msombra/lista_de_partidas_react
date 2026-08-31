import { AppError } from '../errors/AppError.js'
import { championshipRepository } from '../repositories/championshipRepository.js'

const parseId = (value) => {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) throw new AppError('ID inválido.')
    return id
}

const getName = (body) => {
    const name = body.name?.trim()
    if (!name) throw new AppError('O nome do campeonato é obrigatório.')
    return name
}

export const championshipController = {
    index: async (_request, response) => {
        response.json(await championshipRepository.findAll())
    },
    show: async (request, response) => {
        const championship = await championshipRepository.findById(
            parseId(request.params.id)
        )
        if (!championship) throw new AppError('Campeonato não encontrado.', 404)
        response.json(championship)
    },
    create: async (request, response) => {
        const championship = await championshipRepository.create({
            name: getName(request.body),
        })
        response.status(201).json(championship)
    },
    update: async (request, response) => {
        const championship = await championshipRepository.update(
            parseId(request.params.id),
            { name: getName(request.body) }
        )
        response.json(championship)
    },
    delete: async (request, response) => {
        await championshipRepository.delete(parseId(request.params.id))
        response.status(204).send()
    },
}
