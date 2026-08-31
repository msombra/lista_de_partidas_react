import { AppError } from '../errors/AppError.js'
import { clubRepository } from '../repositories/clubRepository.js'

const parseId = (value, field = 'ID') => {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) throw new AppError(`${field} inválido.`)
    return id
}

const serializeClub = (club) => ({
    id: club.id,
    name: club.name,
    championshipId: club.championshipId,
    championship: club.championship.name,
})

const getClubData = (body) => {
    const name = body.name?.trim()
    if (!name) throw new AppError('O nome do clube é obrigatório.')

    return {
        name,
        championshipId: parseId(body.championshipId, 'Campeonato'),
    }
}

export const clubController = {
    index: async (_request, response) => {
        const clubs = await clubRepository.findAll()
        response.json(clubs.map(serializeClub))
    },
    show: async (request, response) => {
        const club = await clubRepository.findById(parseId(request.params.id))
        if (!club) throw new AppError('Clube não encontrado.', 404)
        response.json(serializeClub(club))
    },
    create: async (request, response) => {
        const club = await clubRepository.create(getClubData(request.body))
        response.status(201).json(serializeClub(club))
    },
    update: async (request, response) => {
        const club = await clubRepository.update(
            parseId(request.params.id),
            getClubData(request.body)
        )
        response.json(serializeClub(club))
    },
    delete: async (request, response) => {
        await clubRepository.delete(parseId(request.params.id))
        response.status(204).send()
    },
}
