<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { t, currentLang } from '../store/lang.js'
import { events, fetchEvents, isEventsLoading } from '../store/apiStore.js'

onMounted(() => {
  if (events.value.length === 0) {
    fetchEvents()
  }
})

// Interactive state filters & search
const activeCategoryTab = ref('ALL EVENTS') // 'ALL EVENTS', 'UPCOMING', 'PAST EVENTS'
const searchLocationQuery = ref('')

const toggleFavorite = (event) => {
  event.isFavorite = !event.isFavorite
}

const formatPrice = (price) => {
  return price.toLocaleString('id-ID')
}

// Current date benchmark for filtering (May 24, 2026)
const BENCHMARK_DATE = '2026-05-24'

// Filter & search logic
const filteredEvents = computed(() => {
  let list = [...events.value]
  
  // Category Filter
  if (activeCategoryTab.value === 'UPCOMING') {
    list = list.filter(e => e.date >= BENCHMARK_DATE)
  } else if (activeCategoryTab.value === 'PAST EVENTS') {
    list = list.filter(e => e.date < BENCHMARK_DATE)
  }
  
  // Location Search Filter (case insensitive match on location or venue)
  if (searchLocationQuery.value.trim() !== '') {
    const query = searchLocationQuery.value.toLowerCase().trim()
    list = list.filter(e => 
      e.location.toLowerCase().includes(query) || 
      e.venue.toLowerCase().includes(query)
    )
  }
  
  // Default chronological sort
  list.sort((a, b) => new Date(a.date) - new Date(b.date))
  
  return list
})

const isExpanded = ref(false)

watch(searchLocationQuery, () => {
  isExpanded.value = false
})

const displayedEvents = computed(() => {
  return isExpanded.value ? filteredEvents.value : filteredEvents.value.slice(0, 4)
})

const changeTab = (tab) => {
  activeCategoryTab.value = tab
  isExpanded.value = false
}

const navigateToDetail = (slug) => {
  window.location.hash = `#event-detail-${slug}`
}

const translateLocation = (loc) => {
  if (!loc) return ''
  const mapping = {
    'Jakarta Pusat': { id: 'Jakarta Pusat', en: 'Central Jakarta' },
    'Jakarta Selatan': { id: 'Jakarta Selatan', en: 'South Jakarta' },
    'Jakarta Barat': { id: 'Jakarta Barat', en: 'West Jakarta' },
    'Jakarta Utara': { id: 'Jakarta Utara', en: 'North Jakarta' },
  }
  return mapping[loc] ? mapping[loc][currentLang.value] : loc
}

const translateVenue = (venue) => {
  if (!venue) return ''
  if (currentLang.value === 'en') {
    return venue
      .replace('Live House, Jakarta', 'Live House, Jakarta')
      .replace('Parkir Timur Senayan, Jakarta', 'Senayan East Parking, Jakarta')
      .replace('Ruang Bawah Tanah, Bandung', 'Underground Room, Bandung')
      .replace('Tennis Indoor Senayan, Jakarta', 'Tennis Indoor Senayan, Jakarta')
      .replace('Rossi Musik, Jakarta', 'Rossi Music, Jakarta')
      .replace('Gambir Expo Kemayoran, Jakarta', 'Kemayoran Gambir Expo, Jakarta')
      .replace('Kebun Raya Bogor, Bogor', 'Bogor Botanical Garden, Bogor')
      .replace('Indoor Arena, Tangerang', 'Indoor Arena, Tangerang')
      .replace('Amphitheater, Malang', 'Amphitheater, Malang')
      .replace('Pantai Indah Kapuk, Jakarta', 'Pantai Indah Kapuk, Jakarta')
      .replace('Fort Rotterdam, Makassar', 'Fort Rotterdam, Makassar')
      .replace('Old Town Hall, Semarang', 'Old Town Hall, Semarang')
      .replace('Lapangan Benteng, Medan', 'Benteng Field, Medan')
      .replace('Taman Balekambang, Solo', 'Balekambang Park, Solo')
      .replace('Dago Tea House, Bandung', 'Dago Tea House, Bandung')
  }
  return venue
}

const translateMonth = (m) => {
  const mapping = {
    'MEI': { id: 'MEI', en: 'MAY' },
    'AGU': { id: 'AGU', en: 'AUG' },
    'PEB': { id: 'PEB', en: 'FEB' }
  }
  return mapping[m] ? mapping[m][currentLang.value] : m
}
</script>

<template>
  <div class="events-page">
    <div class="container">
      
      <!-- Hero Section -->
      <section class="events-hero">
        <div class="hero-text-col">
          <span class="hero-tag">{{ t('allEvents') }}</span>
          <h1 class="hero-title">
            {{ currentLang === 'id' ? 'DIBUAT UNTUK SCENE, LIVE DI PANGGUNG.' : 'MADE FOR THE SCENE, LIVE ON STAGE.' }}
          </h1>
          <h2 class="hero-subtitle">
            {{ currentLang === 'id' ? 'Jelajahi konser, gig, dan festival terbaik di kota Anda.' : 'Explore the best concerts, gigs, and festivals in your city.' }}
          </h2>
          <p class="hero-desc">
            {{ currentLang === 'id' 
              ? 'Saksikan band favorit Anda secara langsung. Dapatkan akses ke tiket gigs underground, live house eksklusif, hingga festival musik outdoor berskala nasional dengan sistem pemesanan yang mudah, aman, dan instan.' 
              : 'Watch your favorite bands live. Get access to underground gigs, exclusive live houses, and national-scale outdoor music festivals with an easy, secure, and instant booking system.' }}
          </p>
        </div>
        <div class="hero-image-col">
          
        </div>
      </section>

      <!-- Toolbar (Filter Category Tabs & Sorting Dropdown) -->
      <div class="events-toolbar">
        <!-- Left: Categories Tab -->
        <div class="toolbar-left-tabs">
          <button 
            class="toolbar-tab-btn" 
            :class="{ 'active': activeCategoryTab === 'ALL EVENTS' }"
            @click="changeTab('ALL EVENTS')"
          >
            <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>{{ t('allEvents') }}</span>
          </button>

          <button 
            class="toolbar-tab-btn" 
            :class="{ 'active': activeCategoryTab === 'UPCOMING' }"
            @click="changeTab('UPCOMING')"
          >
            <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ t('upcoming') }}</span>
          </button>

          <button 
            class="toolbar-tab-btn" 
            :class="{ 'active': activeCategoryTab === 'PAST EVENTS' }"
            @click="changeTab('PAST EVENTS')"
          >
            <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ t('pastEvents') }}</span>
          </button>
        </div>

        <!-- Right: Search Location Input -->
        <div class="toolbar-right-sort">
          <div class="search-location-wrapper">
            <input 
              type="text" 
              class="search-location-input" 
              :placeholder="t('searchLocation')" 
              v-model="searchLocationQuery"
            />
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Events Grid Cards -->
      <div class="events-grid">
        <div v-for="event in displayedEvents" :key="event.id" class="grid-event-card" @click="navigateToDetail(event.id)">
          <!-- Poster Image -->
          <div class="card-image-wrapper">
            <!-- Event Ended Badge -->
            <div v-if="event.date < BENCHMARK_DATE" class="event-ended-badge">
              {{ t('eventEnded') }}
            </div>

            <!-- Favorite button on top absolute -->
            <button class="card-fav-btn" @click.stop="toggleFavorite(event)" :aria-label="event.isFavorite ? 'Unfavorite' : 'Favorite'">
              <svg 
                class="heart-icon" 
                :class="{ 'is-favorite': event.isFavorite }" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <img :src="event.image" :alt="event.title" class="card-image" />
          </div>

          <!-- Card Details -->
          <div class="card-details">
            <!-- Title -->
            <h3 class="card-title">{{ event.title }}</h3>

            <!-- Date Row -->
            <div class="card-date-row">
              <svg class="calendar-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{{ event.day }} {{ translateMonth(event.month) }} {{ event.year }}</span>
            </div>

            <!-- Price -->
            <div class="card-price-row">
              Rp{{ formatPrice(event.price) }}
            </div>

            <!-- Organizer Row -->
            <div class="card-organizer-row">
              <img :src="event.organizerLogo || '/logo/logo.png'" class="organizer-avatar" :alt="event.organizer || 'Death Rock Star'" />
              <span class="organizer-name">{{ event.organizer || 'Death Rock Star' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="filteredEvents.length > 4 && !isExpanded" class="load-more-wrapper">
        <button class="load-more-btn" @click="isExpanded = true">
          <span>{{ t('lihatLebihBanyak') }}</span>
          <svg class="btn-arrow-down" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEvents.length === 0" class="empty-events-state">
        <p>{{ t('noEvents') }}</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.events-page {
  background-color: #0B0B0B;
  color: #FFFFFF;
  padding: 8rem 0 8rem 0;
  min-height: 100vh;
}

/* ========================================== */
/* HERO SECTION STYLE                         */
/* ========================================== */
.events-hero {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 5rem;
  text-align: left;
}

.hero-text-col {
  width: 50%;
}

.hero-tag {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #8E8E8E;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  display: block;
}

.hero-title {
  font-family: var(--font-heading), sans-serif;
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
  color: #FFFFFF;
}

.hero-subtitle {
  font-size: 1.15rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 1rem;
}

.hero-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #8E8E8E;
  margin: 0;
}

.hero-image-col {
  width: 50%;
}

.hero-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1.6 / 1;
  background-color: #141414;
  overflow: hidden;
  border-radius: 8px;
}

.hero-banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.82);
}

.fade-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(11, 11, 11, 0) 20%, #0B0B0B 95%);
}

/* ========================================== */
/* TOOLBAR FILTER & SORT STYLE               */
/* ========================================== */
.events-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1.5rem;
}

.toolbar-left-tabs {
  display: flex;
  gap: 0.75rem;
}

.toolbar-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #8E8E8E;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}

.toolbar-tab-btn:hover {
  color: #FFFFFF;
  border-color: #FFFFFF;
}

.toolbar-tab-btn.active {
  background-color: #FFFFFF;
  color: #000000;
  border-color: #FFFFFF;
}

.tab-icon {
  width: 14px;
  height: 14px;
}




.search-location-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-location-input {
  background-color: #141414;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  width: 280px;
  outline: none;
  transition: all 0.25s ease;
}

.search-location-input:hover,
.search-location-input:focus {
  border-color: #FFFFFF;
  outline: none;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  width: 16px;
  height: 16px;
  color: #8E8E8E;
  pointer-events: none;
  transition: color 0.2s ease;
}

.search-location-input:focus + .search-icon {
  color: #FFFFFF;
}

/* ========================================== */
/* EVENT GRID & CARDS STYLE                   */
/* ========================================== */
.events-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 4rem;
}

.grid-event-card {
  position: relative;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
}

.grid-event-card:hover .card-image-wrapper {
  transform: translateY(-4px);
}

.card-fav-btn {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #FFFFFF;
  transition: all 0.2s ease;
}

.card-fav-btn:hover {
  transform: scale(1.1);
  background-color: #FFFFFF;
  color: #000000;
}

.card-fav-btn:hover .heart-icon {
  stroke: #000000;
}

.heart-icon {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  fill: transparent;
  transition: fill 0.25s ease, stroke 0.25s ease;
}

.heart-icon.is-favorite {
  fill: #FF3B30 !important;
  stroke: #FF3B30 !important;
}

.event-ended-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #121212;
  padding: 0.25rem 0.6rem;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 5;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 2.2 / 1;
  background-color: #141414;
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-image-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.22) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-25deg);
  transition: left 0.85s cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: none;
  z-index: 2;
}

.grid-event-card:hover .card-image-wrapper::after {
  left: 150%;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.grid-event-card:hover .card-image {
  transform: scale(1.05);
}

.card-details {
  padding: 0.75rem 0 0 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 0.55rem 0;
  line-height: 1.3;
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.card-date-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #8E8E8E;
  margin-bottom: 0.55rem;
}

.calendar-icon {
  width: 14px;
  height: 14px;
  color: #8E8E8E;
  flex-shrink: 0;
}

.card-price-row {
  font-size: 0.95rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 0.85rem;
}

.card-organizer-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.organizer-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.organizer-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #8E8E8E;
}

.empty-events-state {
  padding: 4rem 0;
  text-align: center;
  font-size: 1rem;
  color: #8E8E8E;
}

/* Styling placeholder deleted pagination */
.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 4rem;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.85rem 2rem;
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: var(--font-body), sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.load-more-btn:hover {
  background-color: #FFFFFF;
  color: #000000;
  border-color: #FFFFFF;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-arrow-down {
  width: 14px;
  height: 14px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.load-more-btn:hover .btn-arrow-down {
  transform: translateY(3px);
}

/* ========================================== */
/* RESPONSIVE MEDIA QUERIES                   */
/* ========================================== */
@media (max-width: 1023px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .events-hero {
    gap: 2rem;
  }
}

@media (max-width: 767px) {
  .events-page {
    padding: 6rem 0 6rem 0;
  }

  .events-hero {
    flex-direction: column;
    gap: 1.5rem;
  }

  .hero-text-col {
    width: 100%;
    order: 2;
  }

  .hero-image-col {
    width: 100%;
    order: 1;
  }

  .hero-image-wrapper {
    aspect-ratio: 1.8 / 1;
  }

  .events-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 1.25rem;
    padding-bottom: 1.25rem;
  }

  /* Horizontal scrolling filter buttons on mobile */
  .toolbar-left-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    width: 100%;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }

  .toolbar-left-tabs::-webkit-scrollbar {
    display: none;
  }

  .toolbar-tab-btn {
    flex-shrink: 0;
    padding: 0.65rem 1.15rem;
    font-size: 0.75rem;
  }

  

  .sort-select {
    padding: 0.55rem 1rem;
    font-size: 0.75rem;
  }

  /* Mobile grid card keeps the vertical card layout */
  .events-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .card-title {
    font-size: 1.15rem;
  }

  .search-location-wrapper {
    width: 100%;
  }

  .search-location-input {
    width: 100%;
  }
}
</style>
