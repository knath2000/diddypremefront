import { prisma } from '~/server/utils/prisma'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }

  const item = await prisma.item.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      variants: {
        include: {
          prices: {
            orderBy: { capturedAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  })

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' })
  }

  return {
    data: item,
    timestamps: {
      dataAsOf: new Date().toISOString(),
      requestedAt: new Date().toISOString(),
    },
  }
}) 