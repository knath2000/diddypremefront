<template>
  <footer class="app-footer">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="col-span-1 md:col-span-2">
          <BrandInfo />
          <SocialLinks :links="socialLinks" />
        </div>

        <!-- Platform Links -->
        <div>
          <h3 class="footer-heading">Platforms</h3>
          <PlatformLinks />
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="footer-heading">Quick Links</h3>
          <QuickLinks :links="quickLinks" />
        </div>
      </div>

      <!-- Bottom Section -->
      <FooterBottom 
        :year="currentYear"
        :links="legalLinks"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Sub-components (commented out until created)
// import BrandInfo from './footer/BrandInfo.vue'
// import SocialLinks from './footer/SocialLinks.vue'
// import PlatformLinks from './footer/PlatformLinks.vue'
// import QuickLinks from './footer/QuickLinks.vue'
// import FooterBottom from './footer/FooterBottom.vue'

// Types
interface Link {
  text: string
  href: string
  external?: boolean
}

interface SocialLink {
  name: string
  icon: string
  href: string
}

// Data
const currentYear = computed(() => new Date().getFullYear())

const socialLinks: SocialLink[] = [
  { name: 'Twitter', icon: '🐦', href: 'https://twitter.com/supremetracker' },
  { name: 'Discord', icon: '💬', href: 'https://discord.gg/supremetracker' },
  { name: 'Instagram', icon: '📷', href: 'https://instagram.com/supremetracker' }
]

const quickLinks: Link[] = [
  { text: 'Trending Items', href: '/trending' },
  { text: 'Price Alerts', href: '/alerts' },
  { text: 'API Documentation', href: 'https://docs.supremetracker.com/api', external: true },
  { text: 'About Us', href: '/about' }
]

const legalLinks: Link[] = [
  { text: 'Privacy Policy', href: '/privacy' },
  { text: 'Terms of Service', href: '/terms' },
  { text: 'Contact', href: '/contact' }
]
</script>

<style scoped>
.app-footer {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
}
@media (prefers-color-scheme: dark) {
  .app-footer {
    background-color: #1f2937;
    border-top-color: #374151;
  }
}

.footer-heading {
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}
@media (prefers-color-scheme: dark) {
  .footer-heading { color: #ffffff; }
}
</style> 