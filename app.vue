<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <NuxtPage />
    </main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Global notifications placeholder for future implementation -->
  </div>
</template>

<script setup>
// Temporarily simplified setup to debug the issue
console.log('App.vue setup running')

// Initialize any global state or services here
onMounted(() => {
  console.log('Supreme Price Tracker initialized')
})
</script>

<style>
@import '~/assets/css/main.css';
</style> 