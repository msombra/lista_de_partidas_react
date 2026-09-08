import { prisma } from '../lib/prisma.js'

export const transmissionRepository = {
    findAll: () => prisma.transmission.findMany({ orderBy: { name: 'asc' } }),
    findById: (id) => prisma.transmission.findUnique({ where: { id } }),
    create: (data) => prisma.transmission.create({ data }),
    update: (id, data) => prisma.transmission.update({ where: { id }, data }),
    delete: (id) => prisma.transmission.delete({ where: { id } }),
}
