import { prisma } from '../lib/prisma.js'

export const championshipRepository = {
    findAll: () => prisma.championship.findMany({ orderBy: { name: 'asc' } }),
    findById: (id) => prisma.championship.findUnique({ where: { id } }),
    create: (data) => prisma.championship.create({ data }),
    update: (id, data) => prisma.championship.update({ where: { id }, data }),
    delete: (id) => prisma.championship.delete({ where: { id } }),
}
