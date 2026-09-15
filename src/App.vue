<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import MerchSection from './components/MerchSection.vue'
import MarqueeSection from './components/MarqueeSection.vue'
import EventsSection from './components/EventsSection.vue'
import MerchPage from './components/MerchPage.vue'
import EventsPage from './components/EventsPage.vue'
import EventDetailPage from './components/EventDetailPage.vue'
import LoginPage from './components/LoginPage.vue'
import DashboardPage from './components/DashboardPage.vue'
import TransactionEvent from './components/TransactionEvent.vue'
import TransactionMerch from './components/TransactionMerch.vue'
import Footer from './components/Footer.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'
import { listenCleanUrl, resolveInitialRoute, getRoute } from './router.js'

resolveInitialRoute()
const currentRoute = ref(getRoute())
const selectedEventSlug = ref('')

const syncRoute = () => {
  currentRoute.value = getRoute()
  if (currentRoute.value.startsWith('#event-detail-')) {
    selectedEventSlug.value = getEventSlugFromHash(currentRoute.value)
  }
}

const isEventDetail = computed(() => {
  return currentRoute.value && currentRoute.value.startsWith('#event-detail-')
})

const getEventSlugFromHash = (hash) => {
  if (hash.startsWith('#event-detail-')) {
    return hash.replace('#event-detail-', '')
  }
  return ''
}

onMounted(() => {
  syncRoute()
  listenCleanUrl()
  window.addEventListener('hashchange', () => {
    syncRoute()
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
})
</script>

<template>
  <div class="app-wrapper">
    <!-- Overlay Noise Effect -->
    <div class="noise-overlay"></div>

    <!-- Header / Navba -->
    <Navbar />

    <!-- Main Page Sections -->
    <main>
      <div v-if="currentRoute === '#merch-page'">
        <MerchPage />
      </div>
      <div v-else-if="currentRoute === '#transaction-event'">
        <TransactionEvent />
      </div>
      <div v-else-if="currentRoute === '#transaction-merch'">
        <TransactionMerch />
      </div>
      <div v-else-if="isEventDetail">
        <EventDetailPage :eventSlug="selectedEventSlug" />
      </div>
      <div v-else-if="currentRoute === '#login'">
        <LoginPage />
      </div>
      <div v-else-if="currentRoute === '#live-report'">
        <DashboardPage />
      </div>
      <div v-else>
        <HeroSection />
        <MerchSection />
        <MarqueeSection />
        <!-- <EventsSection /> -->
      </div>
    </main>

    <!-- Footer -->
    <Footer v-if="currentRoute !== '#transaction-event' && currentRoute !== '#transaction-merch' && currentRoute !== '#login'" />

    <!-- Mobile Bottom Navigation (separate component, mobile-only) -->
    <MobileBottomNav v-if="currentRoute !== '#transaction-event' && currentRoute !== '#transaction-merch' && currentRoute !== '#login'" />
  </div>
</template>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
}

main {
  flex-grow: 1;
}
</style>
