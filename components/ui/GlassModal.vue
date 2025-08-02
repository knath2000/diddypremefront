<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="props.closeOnBackdrop && close()"
          aria-hidden="true"
        />

        <!-- Modal Content -->
        <div
          ref="modalContent"
          class="relative z-10 w-full max-w-lg p-6 glass-card"
          role="document"
        >
          <slot name="header" :title-id="titleId" />
          <slot />
          <slot name="footer" />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

interface Props {
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnBackdrop: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const modelValue = defineModel<boolean>({ required: true })

const modalContent = ref<HTMLElement>()
const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`

const { activate, deactivate } = useFocusTrap(modalContent)

const close = () => {
  emit('update:modelValue', false)
}

watch(
  () => modelValue.value,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => activate())
    } else {
      deactivate()
    }
  }
)

onUnmounted(() => {
  deactivate()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 