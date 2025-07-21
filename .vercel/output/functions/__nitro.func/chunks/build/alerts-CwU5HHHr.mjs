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
  __name: "alerts",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Price Alerts - Supreme Price Tracker",
      meta: [
        {
          name: "description",
          content: "Set intelligent price alerts for Supreme items. Get notified when prices drop or items restock."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="text-center mb-12"><h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4"> Price Alerts </h1><p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"> Set intelligent price alerts and never miss a deal on your favorite Supreme items </p></div><div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center"><div class="text-6xl mb-4">🔔</div><h2 class="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2"> Smart Alerts Coming Soon </h2><p class="text-blue-700 dark:text-blue-300 mb-6"> We&#39;re building an intelligent alert system that will notify you when prices hit your target ranges. </p><div class="space-y-2 text-sm text-blue-600 dark:text-blue-400"><p>🎯 Custom price targets</p><p>📱 Instant notifications</p><p>📊 Historical price context</p><p>🤖 AI-powered recommendations</p></div></div><div class="grid md:grid-cols-2 gap-8 mt-12"><div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3"> Price Drop Alerts </h3><p class="text-gray-600 dark:text-gray-400 mb-4"> Get notified when items drop below your target price across all platforms. </p><div class="text-sm text-gray-500 dark:text-gray-500"><p>✓ Multi-platform monitoring</p><p>✓ Percentage-based thresholds</p><p>✓ Historical price context</p></div></div><div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3"> Restock Notifications </h3><p class="text-gray-600 dark:text-gray-400 mb-4"> Know immediately when sold-out items become available again. </p><div class="text-sm text-gray-500 dark:text-gray-500"><p>✓ Real-time availability tracking</p><p>✓ Size-specific alerts</p><p>✓ Platform preference settings</p></div></div></div><div class="text-center mt-8">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/alerts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=alerts-CwU5HHHr.mjs.map
