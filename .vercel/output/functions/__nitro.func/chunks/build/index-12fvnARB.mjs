import { b as useRouter, u as useNuxtApp, a as asyncDataDefaults, c as createError, _ as __nuxt_component_0$1 } from './server.mjs';
import { ref, withAsyncContext, unref, computed, toValue, getCurrentInstance, onServerPrefetch, shallowRef, toRef, nextTick, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useHead } from './composables-BCGZiXbH.mjs';
import { debounce } from 'perfect-debounce';
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

function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!nuxtApp._asyncData[key.value]?._init) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const _sfc_main$1 = {
  __name: "ItemCard",
  __ssrInlineRender: true,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const stockxPrice = computed(() => {
      const price = props.item.prices?.find((p) => p.platform === "stockx");
      return price?.current_price;
    });
    const goatPrice = computed(() => {
      const price = props.item.prices?.find((p) => p.platform === "goat");
      return price?.current_price;
    });
    const grailedPrice = computed(() => {
      const price = props.item.prices?.find((p) => p.platform === "grailed");
      return price?.current_price;
    });
    const bestPrice = computed(() => {
      const prices = [];
      if (stockxPrice.value) {
        prices.push({ platform: "StockX", price: stockxPrice.value });
      }
      if (goatPrice.value) {
        prices.push({ platform: "GOAT", price: goatPrice.value });
      }
      if (grailedPrice.value) {
        prices.push({ platform: "Grailed", price: grailedPrice.value });
      }
      if (prices.length === 0) return null;
      return prices.reduce(
        (min, current) => current.price < min.price ? current : min
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700" }, _attrs))} data-v-db644108><div class="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden" data-v-db644108>`);
      if (__props.item.image_url) {
        _push(`<img${ssrRenderAttr("src", __props.item.image_url)}${ssrRenderAttr("alt", __props.item.name)} class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" loading="lazy" data-v-db644108>`);
      } else {
        _push(`<div class="w-full h-full flex items-center justify-center text-gray-400 text-4xl" data-v-db644108> 📦 </div>`);
      }
      _push(`<div class="absolute top-2 left-2" data-v-db644108><div class="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold" data-v-db644108> SUPREME </div></div><button class="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors" aria-label="Add to watchlist" data-v-db644108><svg class="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-db644108><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" data-v-db644108></path></svg></button></div><div class="p-4" data-v-db644108><h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2" data-v-db644108>${ssrInterpolate(__props.item.name)}</h3><div class="flex items-center justify-between mb-3" data-v-db644108><span class="text-sm text-gray-600 dark:text-gray-400" data-v-db644108>${ssrInterpolate(__props.item.category || "Apparel")}</span>`);
      if (__props.item.season) {
        _push(`<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded" data-v-db644108>${ssrInterpolate(__props.item.season)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2 mb-4" data-v-db644108>`);
      if (unref(stockxPrice)) {
        _push(`<div class="flex items-center justify-between" data-v-db644108><span class="inline-block px-2 py-1 text-xs font-semibold rounded border platform-stockx" data-v-db644108>StockX</span><span class="font-semibold text-gray-900 dark:text-white" data-v-db644108> $${ssrInterpolate(unref(stockxPrice).toLocaleString())}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(goatPrice)) {
        _push(`<div class="flex items-center justify-between" data-v-db644108><span class="inline-block px-2 py-1 text-xs font-semibold rounded border platform-goat" data-v-db644108>GOAT</span><span class="font-semibold text-gray-900 dark:text-white" data-v-db644108> $${ssrInterpolate(unref(goatPrice).toLocaleString())}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(grailedPrice)) {
        _push(`<div class="flex items-center justify-between" data-v-db644108><span class="inline-block px-2 py-1 text-xs font-semibold rounded border platform-grailed" data-v-db644108>Grailed</span><span class="font-semibold text-gray-900 dark:text-white" data-v-db644108> $${ssrInterpolate(unref(grailedPrice).toLocaleString())}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(bestPrice)) {
        _push(`<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4" data-v-db644108><div class="flex items-center justify-between" data-v-db644108><span class="text-sm font-medium text-green-800 dark:text-green-300" data-v-db644108> Best Price </span><span class="font-bold text-green-900 dark:text-green-100" data-v-db644108> $${ssrInterpolate(unref(bestPrice).price.toLocaleString())}</span></div><div class="text-xs text-green-700 dark:text-green-400 mt-1" data-v-db644108> on ${ssrInterpolate(unref(bestPrice).platform)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex space-x-2" data-v-db644108>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/items/${__props.item.id}`,
        class: "flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View Details `);
          } else {
            return [
              createTextVNode(" View Details ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" aria-label="Set price alert" data-v-db644108> 🔔 </button></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ItemCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-db644108"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Supreme Price Tracker - Real-time Streetwear Pricing",
      meta: [
        {
          name: "description",
          content: "Track Supreme prices in real-time across StockX, GOAT, and Grailed. Get price alerts, historical data, and never overpay for streetwear again."
        },
        {
          name: "keywords",
          content: "supreme price tracker, supreme prices, stockx supreme, goat supreme, grailed supreme, streetwear prices"
        },
        {
          property: "og:title",
          content: "Supreme Price Tracker - Real-time Streetwear Pricing"
        },
        {
          property: "og:description",
          content: "Track Supreme prices in real-time across StockX, GOAT, and Grailed. Get price alerts, historical data, and never overpay for streetwear again."
        },
        {
          property: "og:type",
          content: "website"
        }
      ]
    });
    const searchQuery = ref("");
    useRouter();
    const { data: featuredItems, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("featured-items", async () => {
      return [];
    })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ItemCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="bg-gradient-to-br from-red-600 to-red-800 text-white py-16 lg:py-24"><div class="container mx-auto px-4 text-center"><h1 class="text-4xl lg:text-6xl font-bold mb-6 text-balance"> Track Supreme Prices Like a Pro </h1><p class="text-xl lg:text-2xl mb-8 text-red-100 max-w-3xl mx-auto text-balance"> Real-time price monitoring across StockX, GOAT, and Grailed. Get alerts, historical data, and never overpay again. </p><div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"><button class="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"> Browse Items </button><button class="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors duration-200 text-lg"> View Trending </button></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"><div class="text-center"><div class="text-3xl lg:text-4xl font-bold">10K+</div><div class="text-red-200 text-sm lg:text-base">Items Tracked</div></div><div class="text-center"><div class="text-3xl lg:text-4xl font-bold">3</div><div class="text-red-200 text-sm lg:text-base">Platforms</div></div><div class="text-center"><div class="text-3xl lg:text-4xl font-bold">15min</div><div class="text-red-200 text-sm lg:text-base">Update Frequency</div></div><div class="text-center"><div class="text-3xl lg:text-4xl font-bold">99.9%</div><div class="text-red-200 text-sm lg:text-base">Uptime</div></div></div></div></section><section class="py-12 -mt-8 relative z-10"><div class="container mx-auto px-4"><div class="max-w-2xl mx-auto"><div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"><h2 class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white"> Search Supreme Items </h2><div class="relative"><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search for hoodies, t-shirts, accessories..." class="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"><svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><button class="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"> Search </button></div></div></div></div></section><section id="items" class="py-16"><div class="container mx-auto px-4"><div class="text-center mb-12"><h2 class="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white"> Featured Items </h2><p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"> Trending Supreme pieces with the latest price data from all major platforms </p></div>`);
      if (unref(pending)) {
        _push(`<div class="grid grid-auto-fit-md gap-6"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="item-card p-6"><div class="skeleton h-48 mb-4"></div><div class="skeleton h-4 mb-2"></div><div class="skeleton h-4 w-3/4 mb-4"></div><div class="flex justify-between"><div class="skeleton h-6 w-20"></div><div class="skeleton h-6 w-16"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(featuredItems)?.length) {
        _push(`<div class="grid grid-auto-fit-md gap-6"><!--[-->`);
        ssrRenderList(unref(featuredItems), (item) => {
          _push(ssrRenderComponent(_component_ItemCard, {
            key: item.id,
            item,
            class: "item-card"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-12"><div class="h-16 w-16 text-gray-400 mx-auto mb-4 text-6xl">📦</div><h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2"> No items available yet </h3><p class="text-gray-600 dark:text-gray-400 mb-6"> We&#39;re currently setting up our item catalog. Check back soon! </p><button class="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"> Learn More </button></div>`);
      }
      if (unref(featuredItems)?.length && !unref(pending)) {
        _push(`<div class="text-center mt-12"><button class="px-8 py-4 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200 text-lg"> Browse All Items </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="py-16 bg-gray-50 dark:bg-gray-800/50"><div class="container mx-auto px-4"><div class="text-center mb-12"><h2 class="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white"> Why Choose Supreme Tracker? </h2><p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"> Get the edge you need in the streetwear market </p></div><div class="grid md:grid-cols-3 gap-8"><div class="text-center"><div class="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><div class="h-8 w-8 text-red-600 dark:text-red-400 text-2xl">⏰</div></div><h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white"> Real-time Updates </h3><p class="text-gray-600 dark:text-gray-400"> Price data updated every 15-30 minutes across all platforms for the freshest market information. </p></div><div class="text-center"><div class="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><div class="h-8 w-8 text-blue-600 dark:text-blue-400 text-2xl">🔔</div></div><h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white"> Smart Alerts </h3><p class="text-gray-600 dark:text-gray-400"> Set custom price alerts and get notified instantly when your watched items hit your target price. </p></div><div class="text-center"><div class="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><div class="h-8 w-8 text-green-600 dark:text-green-400 text-2xl">📊</div></div><h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white"> Historical Charts </h3><p class="text-gray-600 dark:text-gray-400"> Comprehensive price history and trend analysis to help you make informed buying decisions. </p></div></div></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-12fvnARB.mjs.map
