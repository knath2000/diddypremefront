<template>
  <div class="glass-chart relative bg-blur rounded-2xl p-4">
    <div class="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, TimeScale } from 'chart.js';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, TimeScale);

interface Props { itemId: string; days?: number }
const props = withDefaults(defineProps<Props>(), { days: 30 });
const runtime = useRuntimeConfig();

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

async function loadData() {
  // Load date-fns adapter at runtime (avoids SSR import error)
  await import('chartjs-adapter-date-fns');
  const url = `${runtime.public.apiBase}/items/${props.itemId}/stockx/history?type=lastSale&days=${props.days}`;
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

watch(() => props.days, loadData);
</script>

<style scoped>
.glass-chart {
  position: relative;
  min-height: 300px;
}
canvas {
  max-height: 300px;
  position: relative;
  z-index: 10;
}
</style> 