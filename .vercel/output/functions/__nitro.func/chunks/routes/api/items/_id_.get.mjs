import { p as prisma } from '../../../_/prisma.mjs';
import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const _id__get = defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const item = await prisma.item.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    },
    include: {
      variants: {
        include: {
          prices: {
            orderBy: { capturedAt: "desc" },
            take: 1
          }
        }
      }
    }
  });
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: "Item not found" });
  }
  return {
    data: item,
    timestamps: {
      dataAsOf: (/* @__PURE__ */ new Date()).toISOString(),
      requestedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
