import { p as prisma } from '../../../../_/prisma.mjs';
import { d as defineEventHandler, g as getQuery } from '../../../../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const prices_get = defineEventHandler(async (event) => {
  var _a, _b;
  const { id } = event.context.params;
  const query = getQuery(event);
  const platform = (_a = query.platform) == null ? void 0 : _a.toLowerCase();
  const limit = Math.min(Number((_b = query.limit) != null ? _b : 1e3), 5e3);
  const variants = await prisma.variant.findMany({
    where: { itemId: id },
    select: { id: true }
  });
  const variantIds = variants.map((v) => v.id);
  if (variantIds.length === 0) {
    return { data: [], meta: { total: 0 } };
  }
  const where = { variantId: { in: variantIds } };
  if (platform) where.platform = platform;
  const [prices, total] = await prisma.$transaction([
    prisma.price.findMany({
      where,
      orderBy: { capturedAt: "desc" },
      take: limit
    }),
    prisma.price.count({ where })
  ]);
  return {
    data: prices,
    meta: {
      total
    },
    timestamps: {
      dataAsOf: (/* @__PURE__ */ new Date()).toISOString(),
      requestedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
});

export { prices_get as default };
//# sourceMappingURL=prices.get.mjs.map
