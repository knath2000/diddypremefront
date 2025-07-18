import { prisma } from '~/server/utils/prisma'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  const query = getQuery(event)
  const platform = (query.platform as string | undefined)?.toLowerCase()
  const limit = Math.min(Number(query.limit ?? 1000), 5000)

  // Fetch all variant ids for the given item
  const variants = await prisma.variant.findMany({
    where: { itemId: id },
    select: { id: true },
  })

  const variantIds = variants.map((v: { id: string }) => v.id)
  if (variantIds.length === 0) {
    return { data: [], meta: { total: 0 } }
  }

  const where: any = { variantId: { in: variantIds } }
  if (platform) where.platform = platform

  const [prices, total] = await prisma.$transaction([
    prisma.price.findMany({
      where,
      orderBy: { capturedAt: 'desc' },
      take: limit,
    }),
    prisma.price.count({ where }),
  ])

  return {
    data: prices,
    meta: {
      total,
    },
    timestamps: {
      dataAsOf: new Date().toISOString(),
      requestedAt: new Date().toISOString(),
    },
  }
}) 