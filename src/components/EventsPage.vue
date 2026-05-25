<script setup>
import { ref, computed, watch } from 'vue'
import { t, currentLang } from '../store/lang.js'

// Import local image assets
import noiseImg from '../assets/images/event_noise_parade.png'
import southSideImg from '../assets/images/event_south_side.png'
import undercityImg from '../assets/images/event_undercity.png'

// Initial events list (16 events for rich interaction)
const events = ref([
  {
    id: 1,
    title: 'NOISE PARADE 2026',
    date: '2026-06-15',
    day: '15',
    month: 'JUN',
    year: '2026',
    location: 'Jakarta Pusat',
    venue: 'Live House, Jakarta',
    time: '19:00 - 23:00 WIB',
    image: noiseImg,
    category: 'LIVE HOUSE',
    price: 150000,
    isFavorite: false
  },
  {
    id: 2,
    title: 'SOUTH SIDE FEST',
    date: '2026-06-29',
    day: '29',
    month: 'JUN',
    year: '2026',
    location: 'Jakarta Selatan',
    venue: 'Parkir Timur Senayan, Jakarta',
    time: '15:00 - 22:00 WIB',
    image: southSideImg,
    category: 'FESTIVAL',
    price: 250000,
    isFavorite: false
  },
  {
    id: 3,
    title: 'UNDERCITY GIGS',
    date: '2026-07-12',
    day: '12',
    month: 'JUL',
    year: '2026',
    location: 'Bandung',
    venue: 'Ruang Bawah Tanah, Bandung',
    time: '19:00 - 23:00 WIB',
    image: undercityImg,
    category: 'UNDERGROUND',
    price: 120000,
    isFavorite: false
  },
  {
    id: 4,
    title: 'METALCORE MANIA',
    date: '2026-08-05',
    day: '05',
    month: 'AGU',
    year: '2026',
    location: 'Jakarta Barat',
    venue: 'Tennis Indoor Senayan, Jakarta',
    time: '18:00 - 22:00 WIB',
    image: noiseImg,
    category: 'CONCERT',
    price: 180000,
    isFavorite: false
  },
  {
    id: 5,
    title: 'INDIE POP GIGS',
    date: '2026-05-10',
    day: '10',
    month: 'MEI',
    year: '2026',
    location: 'Yogyakarta',
    venue: 'Rossi Musik, Jakarta',
    time: '20:00 - 23:00 WIB',
    image: southSideImg,
    category: 'LIVE HOUSE',
    price: 90000,
    isFavorite: false
  },
  {
    id: 6,
    title: 'RETRO SOUNDS 2026',
    date: '2026-04-20',
    day: '20',
    month: 'APR',
    year: '2026',
    location: 'Surabaya',
    venue: 'Gambir Expo Kemayoran, Jakarta',
    time: '14:00 - 23:00 WIB',
    image: undercityImg,
    category: 'FESTIVAL',
    price: 200000,
    isFavorite: false
  },
  {
    id: 7,
    title: 'JAZZ IN THE GARDEN',
    date: '2026-03-15',
    day: '15',
    month: 'MAR',
    year: '2026',
    location: 'Bogor',
    venue: 'Kebun Raya Bogor, Bogor',
    time: '16:00 - 20:00 WIB',
    image: noiseImg,
    category: 'CONCERT',
    price: 160000,
    isFavorite: false
  },
  {
    id: 8,
    title: 'HARDCORE SUMMER',
    date: '2026-02-28',
    day: '28',
    month: 'PEB',
    year: '2026',
    location: 'Denpasar',
    venue: 'Rossi Musik, Jakarta',
    time: '17:00 - 22:00 WIB',
    image: southSideImg,
    category: 'UNDERGROUND',
    price: 100000,
    isFavorite: false
  },
  {
    id: 9,
    title: 'PUNK ROCK ATTACK',
    date: '2026-07-20',
    day: '20',
    month: 'JUL',
    year: '2026',
    location: 'Tangerang',
    venue: 'Indoor Arena, Tangerang',
    time: '18:00 - 22:00 WIB',
    image: undercityImg,
    category: 'UNDERGROUND',
    price: 110000,
    isFavorite: false
  },
  {
    id: 10,
    title: 'FOLK ACADEMY 2026',
    date: '2026-08-15',
    day: '15',
    month: 'AGU',
    year: '2026',
    location: 'Malang',
    venue: 'Amphitheater, Malang',
    time: '19:00 - 22:00 WIB',
    image: noiseImg,
    category: 'LIVE HOUSE',
    price: 130000,
    isFavorite: false
  },
  {
    id: 11,
    title: 'HIP HOP SUMMIT',
    date: '2026-09-02',
    day: '02',
    month: 'SEP',
    year: '2026',
    location: 'Jakarta Utara',
    venue: 'Pantai Indah Kapuk, Jakarta',
    time: '16:00 - 23:00 WIB',
    image: southSideImg,
    category: 'FESTIVAL',
    price: 220000,
    isFavorite: false
  },
  {
    id: 12,
    title: 'ECHOES OF THE EAST',
    date: '2026-09-18',
    day: '18',
    month: 'SEP',
    year: '2026',
    location: 'Makassar',
    venue: 'Fort Rotterdam, Makassar',
    time: '17:00 - 22:00 WIB',
    image: undercityImg,
    category: 'CONCERT',
    price: 175000,
    isFavorite: false
  },
  {
    id: 13,
    title: 'SYNTHWAVE NIGHT',
    date: '2026-05-05',
    day: '05',
    month: 'MEI',
    year: '2026',
    location: 'Semarang',
    venue: 'Old Town Hall, Semarang',
    time: '20:00 - 23:00 WIB',
    image: noiseImg,
    category: 'LIVE HOUSE',
    price: 95000,
    isFavorite: false
  },
  {
    id: 14,
    title: 'SUMMER BLAST 2026',
    date: '2026-04-12',
    day: '12',
    month: 'APR',
    year: '2026',
    location: 'Medan',
    venue: 'Lapangan Benteng, Medan',
    time: '14:00 - 22:00 WIB',
    image: southSideImg,
    category: 'FESTIVAL',
    price: 210000,
    isFavorite: false
  },
  {
    id: 15,
    title: 'ACOUSTIC SESSION',
    date: '2026-03-25',
    day: '25',
    month: 'MAR',
    year: '2026',
    location: 'Solo',
    venue: 'Taman Balekambang, Solo',
    time: '19:30 - 21:30 WIB',
    image: undercityImg,
    category: 'CONCERT',
    price: 80000,
    isFavorite: false
  },
  {
    id: 16,
    title: 'POST-ROCK VISIONS',
    date: '2026-02-10',
    day: '10',
    month: 'PEB',
    year: '2026',
    location: 'Bandung',
    venue: 'Dago Tea House, Bandung',
    time: '19:00 - 23:00 WIB',
    image: noiseImg,
    category: 'UNDERGROUND',
    price: 115000,
    isFavorite: false
  }
])

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
  return isExpanded.value ? filteredEvents.value : filteredEvents.value.slice(0, 3)
})

const changeTab = (tab) => {
  activeCategoryTab.value = tab
  isExpanded.value = false
}

const navigateToDetail = (id) => {
  window.location.hash = `#event-detail-${id}`
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
        <div v-for="event in displayedEvents" :key="event.id" class="grid-event-card">
          <!-- Poster Image -->
          <div class="card-image-wrapper">
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
            <!-- Category Badge & Location -->
            <div class="card-badge-row">
              <span class="card-badge">{{ event.category }}</span>
              <span class="card-location">{{ translateLocation(event.location) }}</span>
            </div>

            <!-- Title -->
            <h3 class="card-title">{{ event.title }}</h3>

            <!-- Date below title -->
            <div class="card-date-below">
              <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ event.day }} {{ translateMonth(event.month) }} {{ event.year }}</span>
            </div>

            <!-- Location -->
            <div class="card-meta">
              <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ translateVenue(event.venue) }}</span>
            </div>

            <!-- Price & Action -->
            <div class="card-price-row">
              <div class="price-box">
                <span class="price-lbl">{{ t('mulaiDari') }}</span>
                <span class="price-val">Rp {{ formatPrice(event.price) }}</span>
              </div>
              <!-- Active Upcoming Ticket Link -->
              <a 
                v-if="event.date >= BENCHMARK_DATE" 
                :href="'#event-detail-' + event.id" 
                class="pilih-tiket-btn"
                @click.prevent="navigateToDetail(event.id)"
              >
                <span>{{ activeCategoryTab === 'UPCOMING' ? t('upcoming') : t('lihatTiket') }}</span>
                <svg class="btn-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <!-- Disabled Past Event Ticket Button -->
              <button 
                v-else 
                class="pilih-tiket-btn past-event-btn" 
                disabled
              >
                <span>{{ t('lihatTiket') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="filteredEvents.length > 3 && !isExpanded" class="load-more-wrapper">
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
  filter: grayscale(100%) contrast(1.1) brightness(0.85);
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.grid-event-card {
  position: relative;
  background-color: #141414;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  border-radius: 16px;
}

.grid-event-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.85);
}

.card-fav-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(11, 11, 11, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 36px;
  height: 36px;
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
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: transparent;
  transition: fill 0.25s ease, stroke 0.25s ease;
}

.heart-icon.is-favorite {
  fill: #FF3B30 !important;
  stroke: #FF3B30 !important;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #0B0B0B;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9) contrast(1.05);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.grid-event-card:hover .card-image {
  transform: scale(1.05);
}

.card-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
}

.card-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-badge {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid #FFFFFF;
  color: #FFFFFF;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 8px;
}

.card-location {
  font-size: 0.75rem;
  font-weight: 700;
  color: #8E8E8E;
  text-transform: uppercase;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 900;
  color: #FFFFFF;
  margin: 0 0 0.4rem 0;
  line-height: 1.2;
  text-transform: uppercase;
}

.card-date-below {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #8E8E8E;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #8E8E8E;
  margin-bottom: 1.5rem;
  margin-top: auto;
}

.meta-icon {
  width: 14px;
  height: 14px;
  color: #8E8E8E;
  flex-shrink: 0;
}

.card-price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1rem;
}

.price-box {
  display: flex;
  flex-direction: column;
}

.price-lbl {
  font-size: 0.65rem;
  color: #8E8E8E;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.price-val {
  font-size: 1.05rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-top: 2px;
}

.pilih-tiket-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: transparent;
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  border-radius: 8px;
}

.pilih-tiket-btn:hover,
.grid-event-card:hover .pilih-tiket-btn:not(.past-event-btn) {
  background-color: #FFFFFF;
  color: #000000;
  border-color: #FFFFFF;
}

.pilih-tiket-btn.past-event-btn {
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: #555555 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  background-color: transparent !important;
}

.pilih-tiket-btn.past-event-btn:hover {
  background-color: transparent !important;
  color: #555555 !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.btn-arrow {
  width: 12px;
  height: 12px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pilih-tiket-btn:hover .btn-arrow,
.grid-event-card:hover .pilih-tiket-btn:not(.past-event-btn) .btn-arrow {
  transform: translateX(3px);
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
    gap: 1rem;
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
    gap: 1.5rem;
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
