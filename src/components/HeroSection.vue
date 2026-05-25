<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { t } from '../store/lang.js'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1540039155732-d6966ff5592e?q=80&w=2938&auto=format&fit=crop',
    kickerKey: 'heroKicker1',
    titleKey: 'heroTitle1',
    descKey: 'heroDesc1'
  },
  {
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2940&auto=format&fit=crop',
    kickerKey: 'heroKicker2',
    titleKey: 'heroTitle2',
    descKey: 'heroDesc2'
  },
  {
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2940&auto=format&fit=crop',
    kickerKey: 'heroKicker3',
    titleKey: 'heroTitle3',
    descKey: 'heroDesc3'
  }
]

const activeSlide = ref(0)
let autoplayTimer = null

const setSlide = (index) => {
  activeSlide.value = index
  resetAutoplay()
}

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % slides.length
}

const startAutoplay = () => {
  autoplayTimer = setInterval(nextSlide, 5000)
}

const resetAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
  }
  startAutoplay()
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
  }
})
</script>

<template>
  <section id="home" class="hero-wrapper">
    <!-- Main Hero -->
    <div class="hero">
      <!-- Background Slider -->
      <div class="hero-bg-container">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="hero-bg"
          :class="{ active: activeSlide === index }"
          :style="{ backgroundImage: `url(${slide.image})` }"
        ></div>
      </div>
      
      <div class="container hero-inner">
        <!-- Text Group (Left) -->
        <div class="hero-content">
          <transition name="fade-slide" mode="out-in">
            <div :key="activeSlide" class="slide-text-wrapper">
              <span class="hero-kicker">{{ t(slides[activeSlide].kickerKey) }}</span>
              <h1 class="hero-title" v-html="t(slides[activeSlide].titleKey)"></h1>
              <p class="hero-desc">{{ t(slides[activeSlide].descKey) }}</p>
            </div>
          </transition>
          
          <div class="hero-ctas">
            <a href="#events-page" class="btn btn-primary">
              {{ t('exploreEvents') }}
              <svg class="arrow-icon icon" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="#merch-page" class="btn btn-secondary">
              {{ t('shopMerch') }}
              <svg class="arrow-icon icon" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        <!-- Carousel Indicators -->
        <div class="carousel-indicators">
          <div 
            v-for="(slide, index) in slides" 
            :key="index"
            class="indicator"
            :class="{ active: activeSlide === index }"
            @click="setSlide(index)"
          ></div>
        </div>
      </div>
    </div>

    <!-- Features / Value Proposition Grid (Bottom) -->
    <div class="features-section">
      <div class="container">
        <div class="features-container">
          <div class="features-grid">
            
            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <svg class="icon" viewBox="0 0 24 24">
                  <rect x="3" y="8" width="18" height="8" rx="2"></rect>
                  <line x1="7" y1="8" x2="7" y2="16" stroke-dasharray="2 2"></line>
                  <line x1="17" y1="8" x2="17" y2="16" stroke-dasharray="2 2"></line>
                </svg>
              </div>
              <div class="feature-text">
                <h3 class="feature-title">{{ t('heroFeatureTitle1') }}</h3>
                <p class="feature-desc">{{ t('heroFeatureDesc1') }}</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M20.38 3.46L16 2a8.59 8.59 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.08 2.27l1.1 5.5a2 2 0 0 0 2 1.63V20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7.14a2 2 0 0 0 2-1.63l1.1-5.5a2 2 0 0 0-1.08-2.27z"></path>
                  <path d="M7 6.64a4 4 0 0 0 10 0"></path>
                </svg>
              </div>
              <div class="feature-text">
                <h3 class="feature-title">{{ t('heroFeatureTitle2') }}</h3>
                <p class="feature-desc">{{ t('heroFeatureDesc2') }}</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="feature-text">
                <h3 class="feature-title">{{ t('heroFeatureTitle3') }}</h3>
                <p class="feature-desc">{{ t('heroFeatureDesc3') }}</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon-wrapper">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <div class="feature-text">
                <h3 class="feature-title">{{ t('heroFeatureTitle4') }}</h3>
                <p class="feature-desc">{{ t('heroFeatureDesc4') }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

.hero-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 80px; /* offset for navbar */
}

.hero-bg-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  z-index: 1;
}

.hero-bg-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--bg-primary) 0%, rgba(14, 14, 14, 0.9) 35%, rgba(14, 14, 14, 0) 100%),
              linear-gradient(to top, var(--bg-primary) 0%, rgba(14, 14, 14, 0) 40%);
  z-index: 2;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 20%;
  background-repeat: no-repeat;
  z-index: 1;
  filter: grayscale(100%) contrast(1.2) opacity(0.85);
  opacity: 0;
  transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-bg.active {
  opacity: 1;
}

.hero-inner {
  position: relative;
  z-index: 10;
  width: 100%;
  transform: translateY(-2.5rem); /* Shift content up slightly */
}

.hero-content {
  width: 55%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.slide-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  width: 100%;
}

/* Text Fade-Slide Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.hero-kicker {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #8A8A8A;
  margin-bottom: 1.5rem;
  display: block;
}

.hero-title {
  font-family: 'Anton', 'Oswald', sans-serif;
  font-size: clamp(2.5rem, 4.5vw, 4.25rem); /* Reduced from clamp(3.5rem, 6.5vw, 6rem) */
  font-weight: 400; /* Anton doesn't need bold weight as much */
  line-height: 1.05;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
  color: #FFFFFF;
}

.hero-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #8A8A8A;
  max-width: 480px;
  margin-bottom: 3rem;
}

.hero-ctas {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.btn-primary {
  background-color: #FFFFFF;
  color: #000000;
  border: 2px solid #FFFFFF;
}

.btn-primary:hover {
  background-color: transparent;
  color: #FFFFFF;
}

.btn-secondary {
  background-color: transparent;
  color: #FFFFFF;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.btn-secondary:hover {
  background-color: #FFFFFF;
  color: #000000;
  border-color: #FFFFFF;
}

.icon {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.btn:hover .arrow-icon {
  transform: translateX(4px);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  z-index: 10;
  margin-top: 3.5rem;
  position: relative;
  bottom:20px;
}

.indicator {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #8A8A8A;
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: #FFFFFF;
  opacity: 1;
  transform: scale(1.5);
}

/* 3. Features Grid */
.features-section {
  position: relative;
  z-index: 20;
  margin-top: -8.5rem; /* Shifted features container up further */
  margin-bottom: 1.5rem; /* Reduced margin to close gap with section below */
}

.features-container {
  background-color: rgba(15, 15, 15, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 1.25rem 1.75rem; /* Reduced padding from 2.5rem */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem; /* Reduced gap from 2rem to be slightly more tight */
}

.feature-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Reduced from 1rem */
}

.feature-icon-wrapper {
  width: 38px; /* Reduced from 48px */
  height: 38px; /* Reduced from 48px */
  background-color: rgba(255, 255, 255, 0.05); /* Premium translucent wrapper */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
}

.feature-icon-wrapper .icon {
  width: 15px; /* Reduced from 18px */
  height: 15px; /* Reduced from 18px */
}

.feature-title {
  font-size: 0.8rem; /* Reduced from 0.9rem */
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin-bottom: 0.15rem;
}

.feature-desc {
  font-size: 0.75rem; /* Reduced from 0.85rem */
  color: #8A8A8A;
  line-height: 1.4;
}

/* Responsive Rules */
@media (max-width: 1024px) {
  .hero-bg-container {
    width: 100%;
  }

  .hero-bg-container::after {
    background: linear-gradient(to right, var(--bg-primary) 0%, rgba(14, 14, 14, 0.85) 50%, rgba(14, 14, 14, 0.2) 100%),
                linear-gradient(to top, var(--bg-primary) 0%, rgba(14, 14, 14, 0) 30%);
  }

  .hero-bg {
    background-position: center 30%;
  }

  .hero-content {
    width: 80%;
  }


  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .features-section {
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .hero {
    align-items: flex-start;
    padding-top: 120px;
    min-height: auto;
    padding-bottom: 4rem;
  }
  
  .hero-bg-container::after {
    background: linear-gradient(to bottom, rgba(14,14,14,0.5) 0%, var(--bg-primary) 90%);
  }

  .hero-content {
    width: 100%;
    align-items: center;
    text-align: center;
  }

  .hero-title {
    font-size: clamp(1.85rem, 8vw, 2.75rem); /* Reduced from clamp(3rem, 12vw, 4rem) */
  }

  .hero-ctas {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    gap: 1rem;
  }

  .hero-inner {
    transform: none;
  }

  .btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 0.8rem;
    gap: 0.5rem;
  }

  .carousel-indicators {
    margin-top: 2rem;
  }


  .features-section {
    margin-top: 0;
    margin-bottom: 2rem;
  }

  .features-container {
    padding: 1rem 0;
    background-color: transparent;
    border: none;
    backdrop-filter: none;
    box-shadow: none;
  }

  .features-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .features-grid::-webkit-scrollbar {
    display: none;
  }

  .feature-item {
    min-width: 230px;
    scroll-snap-align: start;
    background-color: rgba(20, 20, 20, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 1.1rem;
    border-radius: 8px;
  }
}
</style>
