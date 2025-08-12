<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="relative p-10 w-11/12 max-w-md text-center animate-glow-pulse lg-surface lg-elevation-4 lg-edge rounded-2xl">
        <h2 class="text-3xl font-bold mb-4 text-white">Level Up!</h2>
        <p class="text-white mb-6">You reached level {{ user.level }} 🎉</p>
        <GlassButton @click="close" class="px-6 py-2">Awesome!</GlassButton>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useUserStore } from '~/stores/user'

const user = useUserStore()
const visible = ref(false)

watch(
  () => user.levelJustIncreased,
  (val) => {
    if (val) {
      visible.value = true
    }
  }
)

const close = () => {
  visible.value = false
  user.clearLevelFlag()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 