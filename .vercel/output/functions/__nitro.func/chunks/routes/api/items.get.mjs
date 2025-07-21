import { p as prisma } from '../../_/prisma.mjs';
import { d as defineEventHandler, g as getQuery } from '../../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const items_get = defineEventHandler(async (event) => {
  var _a, _b;
  const query = getQuery(event);
  const page = Number((_a = query.page) != null ? _a : 1);
  const limit = Math.min(Number((_b = query.limit) != null ? _b : 20), 100);
  const skip = (page - 1) * limit;
  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        variants: {
          select: {
            id: true,
            size: true,
            color: true
          }
        }
      }
    }),
    prisma.item.count()
  ]);
  return {
    data: items,
    meta: {
      total,
      page,
      hasMore: skip + items.length < total
    },
    timestamps: {
      dataAsOf: (/* @__PURE__ */ new Date()).toISOString(),
      requestedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
});

export { items_get as default };
//# sourceMappingURL=items.get.mjs.map
