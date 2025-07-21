import { _ as __nuxt_component_0$1 } from './server.mjs';
import { withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useHead } from './composables-BCGZiXbH.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = {
  __name: "trending",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Trending Supreme Items - Supreme Price Tracker",
      meta: [
        {
          name: "description",
          content: "Discover trending Supreme items with rising prices and high demand. Coming soon with advanced analytics."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="text-center mb-12"><h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4"> Trending Supreme Items </h1><p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"> Discover the hottest Supreme pieces with rising prices and high demand </p></div><div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center"><div class="text-6xl mb-4">🔥</div><h2 class="text-2xl font-bold text-red-900 dark:text-red-100 mb-2"> Coming Soon </h2><p class="text-red-700 dark:text-red-300 mb-6"> We&#39;re working on advanced trending analytics to help you discover the hottest Supreme items before they peak. </p><div class="space-y-2 text-sm text-red-600 dark:text-red-400"><p>✨ Real-time trending scores</p><p>📈 Price velocity indicators</p><p>🔥 Community interest metrics</p><p>⚡ Early opportunity alerts</p></div></div><div class="text-center mt-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center px-6 py-3 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to Browse `);
          } else {
            return [
              createTextVNode(" ← Back to Browse ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/trending.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=trending-DHJY-0it.mjs.map
