<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-center">
      Loading item details...
    </div>
    <div v-else-if="item">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{{ item.title }}</h1>
      <div class="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
        <span v-if="item.brand">Brand: {{ item.brand }}</span>
        <span v-if="item.season" class="inline-block bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs uppercase tracking-wide">{{ item.season }}</span>
        <span v-if="retail">Retail: ${{ retail }}</span>
      </div>

      <div v-if="(item.images && item.images.length) || item.image_url || item.imageUrl" class="mb-6">
        <img :src="currentImg" :alt="item.title" class="w-full max-w-lg mx-auto rounded-lg shadow-md" />

        <div v-if="item.images?.length > 1" class="flex gap-2 mt-4 justify-center flex-wrap">
          <button
            v-for="img in item.images"
            :key="img.url"
            class="border-2 rounded overflow-hidden w-20 h-20 flex-shrink-0"
            :class="{ 'border-red-600': img.url === currentImg }"
            @click="currentImg = img.url"
          >
            <img :src="img.url" class="object-cover w-full h-full" />
          </button>
        </div>
      </div>

      <div v-if="item.releaseWeek || item.releaseDate" class="mb-6 text-sm text-gray-600 dark:text-gray-400">
        <span v-if="item.releaseWeek">Release: {{ item.releaseWeek }}</span>
        <span v-if="item.releaseDate" class="ml-2">({{ new Date(item.releaseDate).toLocaleDateString() }})</span>
      </div>

      <div v-if="item.colors?.length" class="mb-8">
        <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2">Color Options</h3>
        <ul class="flex flex-wrap gap-2">
          <li v-for="c in item.colors" :key="c" class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
            {{ c }}
          </li>
        </ul>
      </div>

      <!-- Best market price across variants/platforms -->
      <div v-if="bestPrice" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8 max-w-lg mx-auto">
        <p class="text-sm text-green-700 dark:text-green-300 mb-1">Lowest Ask</p>
        <p class="text-3xl font-bold text-green-900 dark:text-green-100">${{ bestPrice.price.toLocaleString() }} <span class="text-lg font-medium">on {{ bestPrice.platform }}</span></p>
      </div>

      <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Variants</h2>
      <div v-if="item.variants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="variant in item.variants" :key="variant.id" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 class="font-medium text-lg text-gray-900 dark:text-white">Size: {{ variant.size }}</h3>
          <p class="text-gray-600 dark:text-gray-400">Color: {{ variant.color }}</p>
          <div v-if="variant.prices.length > 0" class="mt-2">
            <span class="font-semibold text-gray-900 dark:text-white">Latest Price: ${{ variant.prices[0].price_usd.toLocaleString() }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">on {{ variant.prices[0].platform }}</span>
          </div>
          <NuxtLink :to="`/items/${item.id}/prices?variantId=${variant.id}`" class="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            View Price History
          </NuxtLink>
        </div>
      </div>
      <p v-else class="text-gray-600 dark:text-gray-400">No variants found for this item.</p>

      <!-- Link to StockX market page -->
      <div class="mt-8 text-center">
        <NuxtLink :to="`/items/${item.id}/stockx`" class="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          View StockX Market
        </NuxtLink>
      </div>

    </div>
    <div v-else class="text-center py-12">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Item not found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The item you are looking for does not exist or has been removed.</p>
      <NuxtLink to="/" class="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200">
        Go to Homepage
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';

const route = useRoute();
const config = useRuntimeConfig();
const itemId = route.params.id;

const { data: itemResponse, pending } = await useFetch(() => `${config.public.apiBase}/items/${itemId}`);

// Fetch StockX snapshot (latest market data)
const { data: stockxResp } = await useFetch(() => `${config.public.apiBase}/items/${itemId}/stockx`, {
  lazy: true,
  server: false,
});

const item = computed(() => itemResponse.value?.data || null);

const currentImg = ref('');

watch(item, (val) => {
  if (!val) return;
  if (val.images?.length) {
    currentImg.value = val.images[0].url;
  } else {
    currentImg.value = val.image_url || val.imageUrl || '';
  }
}, { immediate: true });

// retail extracted from first price in variants with askOrBid === 'retail' placeholder
const retail = computed(() => {
  const v = item.value?.variants?.[0];
  if (!v) return null;
  const price = v.prices?.find(p => p.ask_or_bid === 'ASK' || p.priceType === 'retail');
  return price?.price_usd || null;
});

// gather best lowest price across variants
const bestPrice = computed(() => {
  // Combine existing platforms and StockX lowestAsk
  const inDb = item.value?.variants?.flatMap(v => v.prices || []) || [];
  const stockxLowest = stockxResp.value?.data?.lowestAsk?.price ?? null;
  const combined = [...inDb.map(p => ({ price: p.price_usd, platform: p.platform })),
    ...(stockxLowest ? [{ price: stockxLowest, platform: 'stockx' }] : []),
  ];
  if (!combined.length) return null;
  combined.sort((a,b)=>a.price-b.price);
  return combined[0];
});

useHead({
  title: item.value ? `${item.value.title} - Supreme Price Tracker` : 'Item Details - Supreme Price Tracker',
  meta: [
    { name: 'description', content: item.value ? `Details and prices for ${item.value.title}.` : 'Supreme item details.' }
  ]
});
</script> 