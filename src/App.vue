<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
import { initRoute, getRoute, getEventSlug, isEventDetailRoute, listenRouteChange } from './router.js'

const currentRoute = ref(initRoute())
const selectedEventSlug = ref(getEventSlug(currentRoute.value))
let stopListening = null

const syncRoute = (scrollTop = true) => {
  currentRoute.value = getRoute()
  selectedEventSlug.value = getEventSlug(currentRoute.value)
  if (scrollTop) window.scrollTo({ top: 0, behavior: 'instant' })
}

const isEventDetail = computed(() => isEventDetailRoute(currentRoute.value))

onMounted(() => {
  syncRoute(false)
  stopListening = listenRouteChange(() => syncRoute())
})

onUnmounted(() => {
  if (stopListening) stopListening()
})
</script>

<template>
  <div class="app-wrapper">
    <div class="noise-overlay"></div>

    <Navbar />

    <main>
      <div v-if="currentRoute === '/merch'">
        <MerchPage />
      </div>
      <div v-else-if="currentRoute === '/transaction/event'">
        <TransactionEvent />
      </div>
      <div v-else-if="currentRoute === '/transaction/merch'">
        <TransactionMerch />
      </div>
      <div v-else-if="isEventDetail">
        <EventDetailPage :eventSlug="selectedEventSlug" :key="selectedEventSlug" />
      </div>
      <div v-else-if="currentRoute === '/events'">
        <EventsPage />
      </div>
      <div v-else-if="currentRoute === '/login'">
        <LoginPage />
      </div>
      <div v-else-if="currentRoute === '/live-report'">
        <DashboardPage />
      </div>
      <div v-else>
        <HeroSection />
        <MerchSection />
        <MarqueeSection />
      </div>
    </main>

    <Footer v-if="currentRoute !== '/transaction/event' && currentRoute !== '/transaction/merch' && currentRoute !== '/login'" />

    <MobileBottomNav v-if="currentRoute !== '/transaction/event' && currentRoute !== '/transaction/merch' && currentRoute !== '/login'" />
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
