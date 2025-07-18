<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
              <span class="text-white font-bold text-sm">S</span>
            </div>
            <span class="font-bold text-xl text-gray-900 dark:text-white">
              Supreme Tracker
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            Real-time Supreme streetwear price tracking across StockX, GOAT, and Grailed. 
            Get the best deals and never overpay again.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">
              🐦
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">
              💬
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">
              📷
            </a>
          </div>
        </div>

        <!-- Platform Links -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Platforms</h3>
          <ul class="space-y-2">
            <li>
              <a 
                href="https://stockx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
              >
                <span class="platform-badge platform-stockx">StockX</span>
              </a>
            </li>
            <li>
              <a 
                href="https://goat.com" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
              >
                <span class="platform-badge platform-goat">GOAT</span>
              </a>
            </li>
            <li>
              <a 
                href="https://grailed.com" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
              >
                <span class="platform-badge platform-grailed">Grailed</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink 
                to="/trending" 
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Trending Items
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/alerts" 
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Price Alerts
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/api/docs" 
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                API Documentation
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/about" 
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                About Us
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            © {{ currentYear }} Supreme Tracker. All rights reserved.
          </div>
          
          <div class="flex items-center space-x-6 text-sm">
            <NuxtLink 
              to="/privacy" 
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink 
              to="/terms" 
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Terms of Service
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Contact
            </NuxtLink>
          </div>
        </div>

        <!-- Data Attribution -->
        <div class="mt-4 text-xs text-gray-500 dark:text-gray-500 text-center">
          Price data sourced from StockX™, GOAT™, and Grailed™. 
          All trademarks are property of their respective owners.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Get current year for copyright
const currentYear = new Date().getFullYear()
</script> 