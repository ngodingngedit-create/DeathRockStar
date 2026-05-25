<script setup>
import { ref } from 'vue'
import { t, currentLang } from '../store/lang.js'

// Import local image assets
import noiseImg from '../assets/images/event_noise_parade.png'
import southSideImg from '../assets/images/event_south_side.png'
import undercityImg from '../assets/images/event_undercity.png'

const events = ref([
  {
    id: 1,
    day: '15',
    month: 'JUN',
    year: '2024',
    title: 'NOISE PARADE',
    venue: 'Live House, Jakarta',
    time: '19:00 - 23:00 WIB',
    image: noiseImg,
    category: 'LIVE HOUSE',
    price: 150000,
    isFavorite: false,
    ticketLink: '#events'
  },
  {
    id: 2,
    day: '29',
    month: 'JUN',
    year: '2024',
    title: 'SOUTH SIDE FEST',
    venue: 'Parkir Timur Senayan, Jakarta',
    time: '15:00 - 22:00 WIB',
    image: southSideImg,
    category: 'FESTIVAL',
    price: 250000,
    isFavorite: false,
    ticketLink: '#events'
  },
  {
    id: 3,
    day: '12',
    month: 'JUL',
    year: '2024',
    title: 'UNDERCITY GIGS',
    venue: 'Ruang Bawah Tanah, Bandung',
    time: '19:00 - 23:00 WIB',
    image: undercityImg,
    category: 'UNDERGROUND',
    price: 120000,
    isFavorite: false,
    ticketLink: '#events'
  }
])

const translateLocation = (venue) => {
  if (!venue) return ''
  if (currentLang.value === 'en') {
    return venue
      .replace('Ruang Bawah Tanah, Bandung', 'Underground Room, Bandung')
      .replace('Live House, Jakarta', 'Live House, Jakarta')
      .replace('Parkir Timur Senayan, Jakarta', 'Senayan East Parking, Jakarta')
  }
  return venue
}

const translateTime = (timeStr) => {
  if (!timeStr) return ''
  if (currentLang.value === 'id') {
    return timeStr.replace('Doors open', 'Pintu dibuka')
  }
  return timeStr
}

const toggleFavorite = (event) => {
  event.isFavorite = !event.isFavorite
}

const formatPrice = (price) => {
  return price.toLocaleString('id-ID')
}

const navigateToDetail = (id) => {
  window.location.hash = `#event-detail-${id}`
}
</script>

<template>
  <section id="events" class="events-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-left">
          <span class="section-tag">{{ t('events') }}</span>
          <h2 class="section-title">{{ t('eventsTitle') }}</h2>
        </div>
        <a href="#events-page" class="view-all-link hover-underline">
          {{ t('viewAllEvents') }} 
          <svg class="link-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <!-- Events List -->
      <div class="events-list">
        <div v-for="event in events" :key="event.id" class="event-card">
          <!-- Image Column (Left on Desktop, Top on Mobile) - Full-bleed top/bottom/left -->
          <div class="event-image-wrapper">
            <div 
              class="event-image" 
              :style="{ backgroundImage: `url(${event.image})` }"
              role="img"
              :aria-label="event.title"
            ></div>
          </div>

          <!-- Detail Information Column (Right on Desktop, Center/Bottom on Mobile) -->
          <div class="event-details-container">
            <!-- Header section of details: Badge and Favorite Button -->
            <div class="event-details-header">
              <span class="event-badge">{{ event.category }}</span>
              <button class="favorite-btn" @click="toggleFavorite(event)" aria-label="Favorite Event">
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
            </div>

            <!-- Title -->
            <h3 class="event-title">{{ event.title }}</h3>

            <!-- Metadata: Date, Location & Time -->
            <div class="event-meta">
              <!-- Date item -->
              <div class="meta-item">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="meta-text-bold">{{ event.day }} {{ event.month }} {{ event.year }}</span>
              </div>
              <!-- Location item -->
              <div class="meta-item">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ translateLocation(event.venue) }}</span>
              </div>
              <!-- Time item -->
              <div class="meta-item">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ translateTime(event.time) }}</span>
              </div>
            </div>

            <!-- Footer: Price & Ticket Button -->
            <div class="event-footer">
              <div class="event-price-box">
                <span class="price-label">{{ t('mulaiDari') }}</span>
                <span class="price-amount">Rp {{ formatPrice(event.price) }}</span>
              </div>
              <a :href="'#event-detail-' + event.id" class="pilih-tiket-btn" @click.prevent="navigateToDetail(event.id)">
                <span>{{ t('pilihTiket') }}</span>
                <svg class="btn-arrow-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.events-section {
  background-color: #121212;
  padding: 4rem 0 8rem 0;
  overflow: hidden;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.section-tag {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  max-width: 600px;
  color: #FFFFFF;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #FFFFFF;
  padding-bottom: 4px;
  flex-shrink: 0;
}

.link-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.view-all-link:hover .link-arrow {
  transform: translateX(4px);
}

/* Events List Structure */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Event Card base layout - no overflow hidden to support ticket stub holes */
.event-card {
  position: relative;
  display: grid;
  grid-template-columns: 480px 1fr;
  align-items: stretch;
  background-color: #1E1E1E;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.event-card:hover {
  background-color: #252525;
}

/* Ticket Punch Holes design using pseudo-elements */
.event-card::before {
  content: '';
  position: absolute;
  left: -18px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background-color: #121212;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.05);
  clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
  z-index: 5;
}

.event-card::after {
  content: '';
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background-color: #121212;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.05);
  clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
  z-index: 5;
}

/* Image styling - full bleed left, top, bottom on desktop */
.event-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 170px;
  border-radius: 8px 0 0 8px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.82);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.event-card:hover .event-image {
  transform: scale(1.05);
}

/* Details and Actions container */
.event-details-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding: 1.25rem 2.5rem 1.25rem 4rem;
}

.event-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Badge category tag styled white */
.event-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1.5px solid #FFFFFF;
  color: #FFFFFF;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.heart-icon {
  width: 24px;
  height: 24px;
  stroke: #FFFFFF;
  fill: transparent;
  transition: fill 0.3s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.heart-icon.is-favorite {
  fill: #FF3B30;
  stroke: #FF3B30;
}

.event-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0.5rem 0;
  line-height: 1.2;
  text-transform: uppercase;
  text-align: left;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #A0A0A0;
  text-align: left;
}

.meta-text-bold {
  font-weight: 700;
  color: #FFFFFF;
}

.meta-icon {
  width: 16px;
  height: 16px;
  color: #A0A0A0;
}

/* Event price and buttons */
.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
}

.event-price-box {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.price-label {
  font-size: 0.75rem;
  color: #A0A0A0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Price amount styled white */
.price-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-top: 2px;
}

.pilih-tiket-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background-color: transparent;
  color: #FFFFFF;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.pilih-tiket-btn:hover,
.event-card:hover .pilih-tiket-btn {
  background-color: #FFFFFF;
  color: #121212;
  border-color: #FFFFFF;
}

.btn-arrow-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pilih-tiket-btn:hover .btn-arrow-icon,
.event-card:hover .btn-arrow-icon {
  transform: translateX(4px);
}

@media (max-width: 1023px) {
  .event-card {
    grid-template-columns: 360px 1fr;
  }
  
  .event-details-container {
    padding: 1.25rem 1.5rem 1.25rem 2.5rem;
  }
  
  .event-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 767px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .view-all-link {
    font-size: 0.72rem;
  }

  .event-card {
    grid-template-columns: 1fr;
  }
  
  /* On mobile, full bleed left/top/right for image */
  .event-image-wrapper {
    width: 100%;
    height: 180px;
    min-height: auto;
    border-radius: 8px 8px 0 0;
  }
  
  .event-details-container {
    padding: 1.5rem;
  }
  
  .event-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .event-price-box {
    margin-bottom: 0.25rem;
  }
  
  .pilih-tiket-btn {
    display: none;
  }
}
</style>
