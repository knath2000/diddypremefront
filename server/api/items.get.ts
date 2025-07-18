import { prisma } from '~/server/utils/prisma'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const limit = Math.min(Number(query.limit ?? 20), 100)
  const skip = (page - 1) * limit

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
          },
        },
      },
    }),
    prisma.item.count(),
  ])

  return {
    data: items,
    meta: {
      total,
      page,
      hasMore: skip + items.length < total,
    },
    timestamps: {
      dataAsOf: new Date().toISOString(),
      requestedAt: new Date().toISOString(),
    },
  }
}) 