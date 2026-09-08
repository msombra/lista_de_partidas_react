import { prisma } from '../src/lib/prisma.js'

const championships = [
    'Premier League',
    'La Liga',
    'Bundesliga',
    'Serie A',
    'Ligue 1',
]

const clubs = [
    ['Arsenal', 'Premier League'],
    ['Chelsea', 'Premier League'],
    ['Liverpool', 'Premier League'],
    ['Manchester City', 'Premier League'],
    ['Manchester United', 'Premier League'],
    ['Tottenham', 'Premier League'],
    ['Real Madrid', 'La Liga'],
    ['Barcelona', 'La Liga'],
    ['Atlético de Madrid', 'La Liga'],
    ['Bayern de Munique', 'Bundesliga'],
    ['Borussia Dortmund', 'Bundesliga'],
    ['Juventus', 'Serie A'],
    ['Inter de Milão', 'Serie A'],
    ['Milan', 'Serie A'],
    ['Napoli', 'Serie A'],
    ['Roma', 'Serie A'],
    ['Paris Saint-Germain', 'Ligue 1'],
]

const matches = [
    ['Premier League', 'Arsenal', 'Liverpool', 'segunda', '20:00', 'ESPN'],
    ['La Liga', 'Real Madrid', 'Barcelona', 'terça', '21:30', 'Disney+'],
    ['Premier League', 'Manchester City', 'Manchester United', 'quarta', '17:00', 'ESPN'],
    ['Bundesliga', 'Bayern de Munique', 'Borussia Dortmund', 'sábado', '16:30', 'SporTV'],
    ['Serie A', 'Milan', 'Inter de Milão', 'domingo', '15:45', 'CazéTV'],
]

const transmissions = [
    'ESPN',
    'CazéTV',
    'HBO',
    'GoatTV',
    'YouTube',
    'Outro',
]

const main = async () => {
    for (const name of championships) {
        await prisma.championship.upsert({
            where: { name },
            update: {},
            create: { name },
        })
    }

    const championshipRecords = await prisma.championship.findMany()
    const championshipByName = new Map(
        championshipRecords.map((championship) => [championship.name, championship])
    )

    for (const [name, championshipName] of clubs) {
        const championshipId = championshipByName.get(championshipName).id

        await prisma.club.upsert({
            where: {
                name_championshipId: { name, championshipId },
            },
            update: {},
            create: {
                name,
                championshipId,
            },
        })
    }

    const clubRecords = await prisma.club.findMany()
    const clubByName = new Map(clubRecords.map((club) => [club.name, club]))

    if (await prisma.match.count() === 0) {
        for (const [
            championshipName,
            homeTeam,
            awayTeam,
            weekDay,
            time,
            broadcast,
        ] of matches) {
            await prisma.match.create({
                data: {
                    championshipId: championshipByName.get(championshipName).id,
                    homeClubId: clubByName.get(homeTeam).id,
                    awayClubId: clubByName.get(awayTeam).id,
                    weekDay,
                    time,
                    broadcast,
                },
            })
        }
    }

    for (const name of transmissions) {
        await prisma.transmission.upsert({
            where: { name },
            update: {},
            create: { name },
        })
    }
}

main()
    .then(() => console.log('Dados fictícios inseridos com sucesso.'))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
    .finally(() => prisma.$disconnect())
