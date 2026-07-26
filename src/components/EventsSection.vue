<script setup>
import { onMounted } from 'vue'
import { t, currentLang } from '../store/lang.js'
import { events, fetchEvents, isEventsLoading } from '../store/apiStore.js'

onMounted(() => {
  if (events.value.length === 0) {
    fetchEvents()
  }
})

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
</script>

<template>
  <section id="events" class="events-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-left">
          <span class="section-tag">{{ t('livePerformances') }}</span>
          <h2 class="section-title">{{ t('upcomingEvents') }}</h2>
        </div>
        <a href="#events-page" class="view-all-link hover-underline">
          {{ t('viewAllEvents') }} 
          <svg class="link-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <!-- Events Grid -->
      <div class="events-grid">
        <div 
          v-for="event in events" 
          :key="event.id" 
          class="event-card"
        >
          <!-- Date Badge -->
          <div class="event-date-badge">
            <span class="date-day">{{ event.day }}</span>
            <span class="date-month">{{ event.month }}</span>
          </div>

          <!-- Image Container -->
          <div class="event-image-wrapper">
            <img :src="event.image" :alt="event.title" class="event-image" />
            <div class="image-overlay"></div>
            <span class="event-category-badge">{{ event.category }}</span>
          </div>

          <!-- Event Details -->
          <div class="event-details">
            <div class="event-meta">
              <span class="event-venue">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ translateLocation(event.venue) }}
              </span>
              <span class="event-time">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ event.time }}
              </span>
            </div>

            <h3 class="event-title">{{ event.title }}</h3>

            <div class="event-footer">
              <div class="price-container">
                <span class="price-label">{{ t('startsFrom') }}</span>
                <span class="price-amount">Rp {{ event.price.toLocaleString('id-ID') }}</span>
              </div>
              <a :href="`#event-detail-${event.slug || event.id}`" class="ticket-btn">
                <span>{{ t('getTicket') }}</span>
                <svg class="btn-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
  background-color: var(--bg-secondary);
  padding: 6rem 0;
  border-top: 1px solid var(--border-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3.5rem;
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
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 900;
  line-height: 1;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  padding-bottom: 4px;
}

.link-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.view-all-link:hover .link-arrow {
  transform: translateX(4px);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.event-card {
  position: relative;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.event-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 255, 255, 0.2);
}

.event-date-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  background-color: #000000;
  border: 1px solid var(--border-color);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-day {
  font-size: 1.1rem;
  font-weight: 900;
  line-height: 1;
}

.date-month {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
}

.event-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.event-card:hover .event-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%);
}

.event-category-badge {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  color: #ffffff;
}

.event-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.event-venue, .event-time {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.meta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.event-title {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
}

.event-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.price-container {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.price-amount {
  font-size: 1rem;
  font-weight: 800;
}

.ticket-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #ffffff;
  color: #000000;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.ticket-btn:hover {
  background-color: #e5e5e5;
}

.btn-arrow {
  width: 12px;
  height: 12px;
}

@media (max-width: 992px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
