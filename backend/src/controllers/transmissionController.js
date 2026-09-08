import { AppError } from '../errors/AppError.js'
import { transmissionRepository } from '../repositories/transmissionRepository.js'

const parseId = (value) => {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) throw new AppError('ID inválido.')
    return id
}

const getName = (body) => {
    const name = body.name?.trim()
    if (!name) throw new AppError('O nome da transmissão é obrigatório.')
    return name
}

const isDefaultTransmission = (name) =>
    name.toLocaleLowerCase('pt-BR') === 'outro'

export const transmissionController = {
    index: async (_request, response) => {
        response.json(await transmissionRepository.findAll())
    },
    show: async (request, response) => {
        const transmission = await transmissionRepository.findById(
            parseId(request.params.id)
        )
        if (!transmission) throw new AppError('Transmissão não encontrada.', 404)
        response.json(transmission)
    },
    create: async (request, response) => {
        const name = getName(request.body)
        if (isDefaultTransmission(name)) {
            throw new AppError('A transmissão "Outro" já é um valor padrão.', 409)
        }
        const transmission = await transmissionRepository.create({ name })
        response.status(201).json(transmission)
    },
    update: async (request, response) => {
        const id = parseId(request.params.id)
        const currentTransmission = await transmissionRepository.findById(id)
        if (!currentTransmission) {
            throw new AppError('Transmissão não encontrada.', 404)
        }
        if (isDefaultTransmission(currentTransmission.name)) {
            throw new AppError(
                'A transmissão "Outro" não pode ser alterada.',
                403
            )
        }

        const name = getName(request.body)
        if (isDefaultTransmission(name)) {
            throw new AppError('O nome "Outro" é reservado.', 409)
        }
        const transmission = await transmissionRepository.update(
            id,
            { name }
        )
        response.json(transmission)
    },
    delete: async (request, response) => {
        const id = parseId(request.params.id)
        const transmission = await transmissionRepository.findById(id)
        if (!transmission) {
            throw new AppError('Transmissão não encontrada.', 404)
        }
        if (isDefaultTransmission(transmission.name)) {
            throw new AppError(
                'A transmissão "Outro" não pode ser excluída.',
                403
            )
        }
        await transmissionRepository.delete(id)
        response.status(204).send()
    },
}
