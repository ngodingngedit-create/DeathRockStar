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
import TransactionEvent from './components/TransactionEvent.vue'
import Footer from './components/Footer.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'

const currentRoute = ref(window.location.hash)
const selectedEventId = ref(1)

const isEventDetail = computed(() => {
  return currentRoute.value && currentRoute.value.startsWith('#event-detail-')
})

const getEventIdFromHash = (hash) => {
  if (hash.startsWith('#event-detail-')) {
    return parseInt(hash.replace('#event-detail-', '')) || 1
  }
  return 1
}

onMounted(() => {
  window.addEventListener('hashchange', () => {
    currentRoute.value = window.location.hash
    if (window.location.hash.startsWith('#event-detail-')) {
      selectedEventId.value = getEventIdFromHash(window.location.hash)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  
  const initialHash = window.location.hash
  if (initialHash.startsWith('#event-detail-')) {
    selectedEventId.value = getEventIdFromHash(initialHash)
  }
})
</script>

<template>
  <div class="app-wrapper">
    <!-- Overlay Noise Effect -->
    <div class="noise-overlay"></div>

    <!-- Header / Navbar -->
    <Navbar />

    <!-- Main Page Sections -->
    <main>
      <div v-if="currentRoute === '#merch-page'">
        <MerchPage />
      </div>
      <div v-else-if="currentRoute === '#events-page'">
        <EventsPage />
      </div>
      <div v-else-if="currentRoute === '#transaction-event'">
        <TransactionEvent />
      </div>
      <div v-else-if="isEventDetail">
        <EventDetailPage :eventId="selectedEventId" />
      </div>
      <div v-else>
        <HeroSection />
        <MerchSection />
        <MarqueeSection />
        <EventsSection />
      </div>
    </main>

    <!-- Footer -->
    <Footer v-if="currentRoute !== '#transaction-event'" />

    <!-- Mobile Bottom Navigation (separate component, mobile-only) -->
    <MobileBottomNav v-if="currentRoute !== '#transaction-event'" />
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
