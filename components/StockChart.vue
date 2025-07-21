<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, TimeScale } from 'chart.js';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, TimeScale);

interface Props { itemId: string }
const props = defineProps<Props>();
const runtime = useRuntimeConfig();

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

async function loadData() {
  // Load date-fns adapter at runtime (avoids SSR import error)
  await import('chartjs-adapter-date-fns');
  const url = `${runtime.public.apiBase}/items/${props.itemId}/stockx/history?type=lastSale&days=30`;
  const res = await $fetch(url);
  const data = res.data as any[];

  const labels = data.map((d) => new Date(d.fetchedAt));
  const prices = data.map((d) => d.price);

  if (chart) chart.destroy();
  chart = new Chart(canvas.value!, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Last Sale',
          data: prices,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.2)',
          tension: 0.25,
        },
      ],
    },
    options: {
      scales: {
        x: { type: 'time', time: { unit: 'day' } },
        y: { beginAtZero: false },
      },
      plugins: { tooltip: { intersect: false, mode: 'index' } },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

onMounted(loadData);
</script>

<style scoped>
 div {
  position: relative;
  min-height: 300px;
 }
 canvas {
  max-height: 300px;
 }
</style> 