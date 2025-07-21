<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-center">Loading StockX data...</div>

    <div v-else-if="snapshot">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">StockX Market – {{ itemId }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Lowest Ask</p>
          <p class="text-4xl font-bold text-red-600">${{ snapshot.lowestAsk?.price?.toLocaleString() || '--' }}</p>
        </div>
        <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Highest Bid</p>
          <p class="text-4xl font-bold text-green-600">${{ snapshot.highestBid?.price?.toLocaleString() || '--' }}</p>
        </div>
        <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Last Sale</p>
          <p class="text-4xl font-bold text-gray-900 dark:text-white">${{ snapshot.lastSale?.price?.toLocaleString() || '--' }}</p>
        </div>
      </div>

      <div>
        <StockChart :item-id="itemId" />
      </div>
    </div>

    <div v-else class="text-center py-12">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No StockX data</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">This item isn’t linked with StockX yet.</p>
      <NuxtLink :to="`/items/${itemId}`" class="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200">
        Back to Item
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import StockChart from '~/components/StockChart.vue';

const route = useRoute();
const config = useRuntimeConfig();
const itemId = route.params.id as string;

const { data: snapResp, pending } = await useFetch(() => `${config.public.apiBase}/items/${itemId}/stockx`, {
  lazy: true,
  server: false,
});

const snapshot = computed(() => snapResp.value?.data || null);

useHead({
  title: `StockX Market – ${itemId}`,
});
</script> 