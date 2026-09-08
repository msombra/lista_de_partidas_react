import { AppError } from '../errors/AppError.js'
import { championshipRepository } from '../repositories/championshipRepository.js'
import { clubRepository } from '../repositories/clubRepository.js'
import { matchRepository } from '../repositories/matchRepository.js'

const validWeekDays = new Set([
    'sexta',
    'sábado',
    'domingo',
    'segunda',
    'terça',
    'quarta',
    'quinta',
])
const championsLeagueWeekDays = new Set(['terça', 'quarta', 'quinta'])

const parseId = (value, field = 'ID') => {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) throw new AppError(`${field} inválido.`)
    return id
}

const serializeMatch = (match) => ({
    id: match.id,
    championshipId: match.championshipId,
    championship: match.championship.name,
    homeClubId: match.homeClubId,
    homeTeam: match.homeClub.name,
    awayClubId: match.awayClubId,
    awayTeam: match.awayClub?.name ?? match.awayTeamName,
    awayTeamName: match.awayTeamName,
    weekDay: match.weekDay,
    time: match.time,
    broadcast: match.broadcast,
})

const getMatchData = async (body, editingId) => {
    const championshipId = parseId(body.championshipId, 'Campeonato')
    const homeClubId = parseId(body.homeClubId, 'Time mandante')
    const awayClubId = body.awayClubId
        ? parseId(body.awayClubId, 'Time visitante')
        : null
    const awayTeamName = awayClubId ? null : body.awayTeamName?.trim()
    const weekDay = body.weekDay?.trim()
    const time = body.time?.trim()
    const broadcast = body.broadcast?.trim()

    if (!awayClubId && !awayTeamName) {
        throw new AppError('O time visitante é obrigatório.')
    }
    if (awayClubId === homeClubId) {
        throw new AppError('Mandante e visitante devem ser diferentes.')
    }
    if (!validWeekDays.has(weekDay)) {
        throw new AppError('Dia da semana inválido.')
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
        throw new AppError('Horário inválido.')
    }
    if (!broadcast) throw new AppError('A transmissão é obrigatória.')

    const [championship, homeClub, awayClub] = await Promise.all([
        championshipRepository.findById(championshipId),
        clubRepository.findById(homeClubId),
        awayClubId ? clubRepository.findById(awayClubId) : null,
    ])

    if (!championship) throw new AppError('Campeonato não encontrado.', 404)
    if (!homeClub) throw new AppError('Time mandante não encontrado.', 404)
    const isChampionsLeague = championship.name.toLowerCase() === 'champions league'

    if (isChampionsLeague && !championsLeagueWeekDays.has(weekDay)) {
        throw new AppError(
            'Partidas da Champions League devem ocorrer entre terça e quinta.'
        )
    }
    if (!isChampionsLeague && homeClub.championshipId !== championshipId) {
        throw new AppError('O mandante não pertence ao campeonato selecionado.')
    }
    if (
        !isChampionsLeague
        && awayClub
        && awayClub.championshipId !== championshipId
    ) {
        throw new AppError('O visitante não pertence ao campeonato selecionado.')
    }

    const clubIds = [homeClubId, awayClubId].filter(Boolean)
    const clubAlreadyUsed = await matchRepository.findUsingClubIds(
        clubIds,
        championshipId,
        editingId
    )
    if (clubAlreadyUsed) {
        throw new AppError('Um dos clubes já está vinculado a outra partida.', 409)
    }

    return {
        championshipId,
        homeClubId,
        awayClubId,
        awayTeamName,
        weekDay,
        time,
        broadcast,
    }
}

export const matchController = {
    index: async (_request, response) => {
        const matches = await matchRepository.findAll()
        response.json(matches.map(serializeMatch))
    },
    show: async (request, response) => {
        const match = await matchRepository.findById(parseId(request.params.id))
        if (!match) throw new AppError('Partida não encontrada.', 404)
        response.json(serializeMatch(match))
    },
    create: async (request, response) => {
        const match = await matchRepository.create(
            await getMatchData(request.body)
        )
        response.status(201).json(serializeMatch(match))
    },
    update: async (request, response) => {
        const id = parseId(request.params.id)
        const match = await matchRepository.update(
            id,
            await getMatchData(request.body, id)
        )
        response.json(serializeMatch(match))
    },
    delete: async (request, response) => {
        await matchRepository.delete(parseId(request.params.id))
        response.status(204).send()
    },
    deleteAll: async (_request, response) => {
        await matchRepository.deleteAll()
        response.status(204).send()
    },
}
