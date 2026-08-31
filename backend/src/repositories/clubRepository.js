import { prisma } from '../lib/prisma.js'

const includeChampionship = { championship: true }

export const clubRepository = {
    findAll: () => prisma.club.findMany({
        include: includeChampionship,
        orderBy: { name: 'asc' },
    }),
    findById: (id) => prisma.club.findUnique({
        where: { id },
        include: includeChampionship,
    }),
    create: (data) => prisma.club.create({
        data,
        include: includeChampionship,
    }),
    update: (id, data) => prisma.club.update({
        where: { id },
        data,
        include: includeChampionship,
    }),
    delete: (id) => prisma.club.delete({ where: { id } }),
}
