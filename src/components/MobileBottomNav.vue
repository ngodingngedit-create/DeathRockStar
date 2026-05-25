<script setup>
import { ref, onMounted } from 'vue'
import { currentLang } from '../store/lang.js'

// Import assets for search results preview
import noiseImg from '../assets/images/event_noise_parade.png'
import southSideImg from '../assets/images/event_south_side.png'
import undercityImg from '../assets/images/event_undercity.png'
import teeImg from '../assets/images/merch_tee.png'
import hoodieImg from '../assets/images/merch_hoodie.png'
import capImg from '../assets/images/merch_cap.png'
import bagImg from '../assets/images/merch_bag.png'
import { t } from '../store/lang.js'
import { computed } from 'vue'

const currentHash = ref(window.location.hash || '#home')
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

// Tracks the explicitly clicked tab (to handle Koleksi which doesn't change the hash to #merch)
const activeTab = ref(window.location.hash || '#home')

const isTabActive = (href) => {
  if (href === '#home') {
    // Active if home tab was clicked, OR if no special tab is active
    return activeTab.value === '#home' || activeTab.value === '' || activeTab.value === '#'
  }
  return activeTab.value === href
}

const handleTabClick = (href) => {
  activeTab.value = href
  if (href === '#merch') {
    // Koleksi scrolls to the merch section on the home page
    window.location.hash = '#home'
    setTimeout(() => {
      const el = document.getElementById('merch')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  } else {
    window.location.hash = href
  }
}

const searchEvents = [
  { id: 1, title: 'NOISE PARADE 2026', venue: 'Live House, Jakarta', category: 'LIVE HOUSE', image: noiseImg },
  { id: 2, title: 'SOUTH SIDE FEST', venue: 'Parkir Timur Senayan, Jakarta', category: 'FESTIVAL', image: southSideImg },
  { id: 3, title: 'UNDERCITY GIGS', venue: 'Ruang Bawah Tanah, Bandung', category: 'UNDERGROUND', image: undercityImg }
]

const searchProducts = [
  { id: 1, name: 'DRS LOGO TEE', price: 'Rp 149.000', category: 'Pakaian', image: teeImg },
  { id: 2, name: 'DRS HOODIE', price: 'Rp 299.000', category: 'Pakaian', image: hoodieImg },
  { id: 3, name: 'DRS CAP', price: 'Rp 129.000', category: 'Aksesoris', image: capImg },
  { id: 4, name: 'DRS TOTE BAG', price: 'Rp 99.000', category: 'Aksesoris', image: bagImg }
]

const filteredSearchEvents = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase().trim()
  return searchEvents.filter(e =>
    e.title.toLowerCase().includes(query) ||
    e.venue.toLowerCase().includes(query) ||
    e.category.toLowerCase().includes(query)
  )
})

const filteredSearchProducts = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase().trim()
  return searchProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  )
})

import { watch } from 'vue'
watch(isSearchOpen, (open) => {
  if (open) {
    setTimeout(() => { searchInput.value?.focus() }, 100)
  }
})

onMounted(() => {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#home'
    currentHash.value = hash
    // Sync activeTab with URL changes caused externally (e.g. browser back/forward)
    // But only for routes that are not #merch (since Koleksi sets hash to #home)
    if (hash !== '#home' || activeTab.value !== '#merch') {
      activeTab.value = hash
    }
  })
})
</script>

<template>
  <!-- Bottom Mobile Navbar (Fixed Bottom Tab Bar) — Mobile only -->
  <div class="mobile-bottom-nav">
    <div class="bottom-nav-container">

      <!-- Beranda (Home) -->
      <a
        href="#home"
        class="bottom-nav-item"
        :class="{ 'active': isTabActive('#home') }"
        @click="handleTabClick('#home')"
      >
        <div class="active-indicator"></div>
        <div class="tab-icon-wrapper">
          <img src="/logo/logo.png" alt="Home" class="tab-logo-img" />
        </div>
        <span class="tab-label">{{ currentLang === 'id' ? 'Beranda' : 'Home' }}</span>
      </a>

      <!-- Koleksi (Collection) -->
      <a
        href="#home"
        class="bottom-nav-item"
        :class="{ 'active': isTabActive('#merch') }"
        @click="handleTabClick('#merch')"
      >
        <div class="active-indicator"></div>
        <div class="tab-icon-wrapper">
          <svg class="tab-svg-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
          </svg>
        </div>
        <span class="tab-label">{{ currentLang === 'id' ? 'Koleksi' : 'Collection' }}</span>
      </a>

      <!-- Event -->
      <a
        href="#events-page"
        class="bottom-nav-item"
        :class="{ 'active': isTabActive('#events-page') }"
        @click="handleTabClick('#events-page')"
      >
        <div class="active-indicator"></div>
        <div class="tab-icon-wrapper">
          <svg class="tab-svg-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <span class="tab-label">{{ currentLang === 'id' ? 'Event' : 'Events' }}</span>
      </a>

      <!-- Toko (Store) -->
      <a
        href="#merch-page"
        class="bottom-nav-item"
        :class="{ 'active': isTabActive('#merch-page') }"
        @click="handleTabClick('#merch-page')"
      >
        <div class="active-indicator"></div>
        <div class="tab-icon-wrapper">
          <svg class="tab-svg-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span class="tab-label">{{ currentLang === 'id' ? 'Toko' : 'Store' }}</span>
      </a>

      <!-- Cari (Search) -->
      <button
        class="bottom-nav-item"
        :class="{ 'active': isSearchOpen }"
        @click="isSearchOpen = !isSearchOpen"
      >
        <div class="active-indicator"></div>
        <div class="tab-icon-wrapper">
          <svg class="tab-svg-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <span class="tab-label">{{ currentLang === 'id' ? 'Cari' : 'Search' }}</span>
      </button>

    </div>
  </div>

  <!-- Dropdown Search Panel (above bottom nav) -->
  <transition name="slide-up-panel">
    <div v-if="isSearchOpen" class="mobile-search-panel">
      <div class="mobile-search-inner">

        <!-- Capsule Input -->
        <div class="mobile-search-capsule">
          <svg class="msearch-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="searchInput"
            type="text"
            class="msearch-input"
            :placeholder="t('searchPlaceholder')"
            v-model="searchQuery"
            @keydown.esc="isSearchOpen = false"
          />
          <button v-if="searchQuery" class="msearch-clear" @click="searchQuery = ''" aria-label="Clear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="mclear-icon">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
          <button class="msearch-close" @click="isSearchOpen = false" aria-label="Close Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Results (only shown when there is a query) -->
        <div v-if="searchQuery.trim().length > 0" class="msearch-results">

          <!-- Events -->
          <div v-if="filteredSearchEvents.length > 0" class="msearch-section">
            <h4 class="msearch-section-title">{{ currentLang === 'id' ? 'EVENT MUSIK' : 'MUSIC EVENTS' }}</h4>
            <div class="msearch-cards">
              <a
                v-for="event in filteredSearchEvents"
                :key="event.id"
                :href="'#event-detail-' + event.id"
                class="msearch-card"
                @click="isSearchOpen = false"
              >
                <div class="msearch-card-img" :style="{ backgroundImage: `url(${event.image})` }"></div>
                <div class="msearch-card-info">
                  <span class="msearch-card-tag">{{ event.category }}</span>
                  <h5 class="msearch-card-name">{{ event.title }}</h5>
                  <span class="msearch-card-meta">{{ event.venue }}</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Products -->
          <div v-if="filteredSearchProducts.length > 0" class="msearch-section">
            <h4 class="msearch-section-title">MERCHANDISE</h4>
            <div class="msearch-cards">
              <a
                v-for="product in filteredSearchProducts"
                :key="product.id"
                href="#merch-page"
                class="msearch-card"
                @click="isSearchOpen = false"
              >
                <img :src="product.image" :alt="product.name" class="msearch-card-img-tag" />
                <div class="msearch-card-info">
                  <span class="msearch-card-tag">{{ product.category }}</span>
                  <h5 class="msearch-card-name">{{ product.name }}</h5>
                  <span class="msearch-card-meta">{{ product.price }}</span>
                </div>
              </a>
            </div>
          </div>

          <!-- No results -->
          <div v-if="filteredSearchEvents.length === 0 && filteredSearchProducts.length === 0" class="msearch-empty">
            <p>{{ currentLang === 'id' ? 'Tidak ada hasil yang cocok.' : 'No matches found.' }}</p>
          </div>

        </div>
      </div>
    </div>
  </transition>

  <!-- Backdrop -->
  <transition name="fade">
    <div v-if="isSearchOpen" class="mobile-search-backdrop" @click="isSearchOpen = false"></div>
  </transition>
</template>

<style scoped>
/* =========================================
   MOBILE BOTTOM NAV BAR
   Shown only on mobile (<= 992px)
   Dark theme matching the website palette
   ========================================= */
.mobile-bottom-nav {
  display: none; /* Hidden on desktop, shown via media query */
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: rgba(14, 14, 14, 0.96);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 990;
  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding-bottom: env(safe-area-inset-bottom);
}

@media (max-width: 992px) {
  .mobile-bottom-nav {
    display: block;
  }
}

.bottom-nav-container {
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* Individual tab item */
.bottom-nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.38);
  transition: all 0.25s ease;
  border: none;
  background: transparent;
  padding: 6px 0;
  cursor: pointer;
}

/* Active state — bright white */
.bottom-nav-item.active {
  color: #ffffff;
}

/* Active top indicator bar */
.active-indicator {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background-color: #ffffff;
  border-radius: 0 0 4px 4px;
  opacity: 0;
  transition: opacity 0.3s ease, width 0.3s ease;
}

.bottom-nav-item.active .active-indicator {
  opacity: 1;
  width: 32px;
}

/* Icon wrapper */
.tab-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  margin-bottom: 3px;
  transition: transform 0.2s ease;
}

.bottom-nav-item:active .tab-icon-wrapper {
  transform: scale(0.88);
}

/* Home logo image */
.tab-logo-img {
  height: 24px;
  width: auto;
  object-fit: contain;
  /* Invert to white for dark bar, tinted when inactive */
  filter: brightness(0) invert(1);
  opacity: 0.38;
  transition: opacity 0.25s ease;
}

.bottom-nav-item.active .tab-logo-img {
  opacity: 1;
}

/* SVG icons */
.tab-svg-icon {
  width: 22px;
  height: 22px;
  stroke: currentColor;
  fill: none;
  transition: stroke-width 0.2s ease;
}

.bottom-nav-item.active .tab-svg-icon {
  stroke-width: 2.8px;
}

/* Labels */
.tab-label {
  font-family: var(--font-body), sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}


/* =========================================
   MOBILE SEARCH PANEL (slides down from top)
   Positioned just below the top navbar (~65px)
   ========================================= */
.mobile-search-panel {
  position: fixed;
  top: 65px;   /* sits right below the header navbar */
  left: 0;
  width: 100%;
  max-height: calc(100vh - 65px - 70px); /* viewport minus top navbar minus bottom nav */
  background-color: rgba(10, 10, 10, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  z-index: 991;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.85);
}

.mobile-search-inner {
  padding: 1.25rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Capsule search input */
.mobile-search-capsule {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  padding: 0 1rem;
  gap: 0.5rem;
  transition: border-color 0.3s ease;
}

.mobile-search-capsule:focus-within {
  border-color: rgba(255, 255, 255, 0.4);
}

.msearch-icon {
  width: 17px;
  height: 17px;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.msearch-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body), sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  padding: 0.75rem 0;
}

.msearch-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.msearch-clear,
.msearch-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.msearch-clear:hover,
.msearch-close:hover {
  color: #ffffff;
}

.mclear-icon {
  width: 16px;
  height: 16px;
}

.msearch-close svg {
  width: 18px;
  height: 18px;
}

/* Results */
.msearch-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.msearch-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.msearch-section-title {
  font-family: var(--font-body), sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.msearch-cards {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.msearch-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.msearch-card:hover,
.msearch-card:active {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.msearch-card-img {
  width: 52px;
  height: 52px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.msearch-card-img-tag {
  width: 52px;
  height: 52px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: #111;
}

.msearch-card-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
}

.msearch-card-tag {
  font-size: 0.58rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.msearch-card-name {
  font-family: var(--font-body), sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #ffffff;
  margin: 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.msearch-card-meta {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msearch-empty {
  padding: 2rem 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.9rem;
}

/* Popular suggestion tags */
.msearch-suggestions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.msearch-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.msearch-tag-btn {
  padding: 0.45rem 1.1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-body), sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.msearch-tag-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
}

/* Backdrop */
.mobile-search-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  z-index: 989;
}

/* Transitions — panel slides DOWN from the top navbar */
.slide-up-panel-enter-active,
.slide-up-panel-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}
.slide-up-panel-enter-from,
.slide-up-panel-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
