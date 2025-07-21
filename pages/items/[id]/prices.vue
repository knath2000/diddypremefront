<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-center">
      Loading price history...
    </div>
    <div v-else-if="prices.length > 0">
      <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Price History for {{ $route.params.id }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Platform: {{ selectedPlatform || 'All' }}</p>

      <div class="mb-6">
        <label for="platform-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Platform:</label>
        <select id="platform-select" v-model="selectedPlatform" @change="fetchPrices" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">All Platforms</option>
          <option value="stockx">StockX</option>
          <option value="goat">GOAT</option>
          <option value="grailed">Grailed</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Platform</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price (USD)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Captured At</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr v-for="price in prices" :key="price.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ price.platform }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${{ price.price_usd.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ price.ask_or_bid }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ new Date(price.capturedAt).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No price history found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">There is no price data available for this item or variant yet.</p>
      <NuxtLink :to="`/items/${$route.params.id}`" class="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200">
        Back to Item Details
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const config = useRuntimeConfig();
const itemId = route.params.id;
const variantId = route.query.variantId;

const selectedPlatform = ref(route.query.platform || '');

const fetchUrl = computed(() => {
  // StockX uses separate endpoint
  if (selectedPlatform.value === 'stockx') {
    // default to lastSale series
    return `${config.public.apiBase}/items/${itemId}/stockx/history?type=lastSale&days=90`;
  }
  let url = `${config.public.apiBase}/items/${itemId}/prices`;
  const params = new URLSearchParams();
  if (variantId) {
    params.append('variantId', variantId);
  }
  if (selectedPlatform.value) {
    params.append('platform', selectedPlatform.value);
  }
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  return url;
});

const { data: pricesResponse, pending, refresh } = await useFetch(fetchUrl, {
  lazy: true,
  server: false,
});

const prices = computed(() => {
  if (!pricesResponse.value) return [];
  // StockX history returns [{price, fetchedAt, ...}]
  if (selectedPlatform.value === 'stockx') {
    return (pricesResponse.value.data || []).map((p:any) => ({
      platform: 'stockx',
      price_usd: p.price,
      ask_or_bid: p.type,
      capturedAt: p.fetchedAt,
    }));
  }
  return pricesResponse.value.data || [];
});

const fetchPrices = () => {
  refresh();
};

watch(selectedPlatform, () => {
  fetchPrices();
});

useHead({
  title: `Price History for ${itemId} - Supreme Price Tracker`,
  meta: [
    { name: 'description', content: `Historical price data for Supreme item ${itemId}.` }
  ]
});
</script> 