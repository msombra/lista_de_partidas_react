import { prisma } from '../lib/prisma.js'

const includeRelations = {
    championship: true,
    homeClub: true,
    awayClub: true,
}

export const matchRepository = {
    findAll: () => prisma.match.findMany({
        include: includeRelations,
        orderBy: [{ weekDay: 'asc' }, { time: 'asc' }],
    }),
    findById: (id) => prisma.match.findUnique({
        where: { id },
        include: includeRelations,
    }),
    findUsingClubIds: (clubIds, excludeId) => prisma.match.findFirst({
        where: {
            id: excludeId ? { not: excludeId } : undefined,
            OR: [
                { homeClubId: { in: clubIds } },
                { awayClubId: { in: clubIds } },
            ],
        },
    }),
    create: (data) => prisma.match.create({
        data,
        include: includeRelations,
    }),
    update: (id, data) => prisma.match.update({
        where: { id },
        data,
        include: includeRelations,
    }),
    delete: (id) => prisma.match.delete({ where: { id } }),
    deleteAll: () => prisma.match.deleteMany(),
}
