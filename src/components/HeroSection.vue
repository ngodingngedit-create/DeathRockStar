<template>
  <section id="home" class="hero">
    <!-- Dark High-Contrast Concert Background -->
    <div class="hero-bg-container">
      <img src="/logo/logo.png" alt="Concert Crowd" class="hero-bg-img" />
      <div class="hero-overlay"></div>
    </div>

    <div class="container hero-container">
      <!-- Left Column: Copy -->
      <div class="hero-content">
        <h1 class="hero-title animate-title">
          WE CREATE MOMENTS.<br />
          YOU MAKE MEMORIES.
        </h1>
        <p class="hero-description">
          We're a creative collective blending music, merchandise, and live experiences. 
          Built for the scene, inspired by the people.
        </p>
      </div>

      <!-- Right Column: Mascot Logo -->
      <div class="hero-mascot-container">
        <div class="mascot-tilt-card">
          <img src="/logo/logo.png" alt="Death Rock Star Mascot" class="hero-mascot" />
        </div>
      </div>

      <!-- CTAs (Desktop: Row 2 Col 1; Mobile: Row 3) -->
      <div class="hero-ctas">
        <a href="#events-page" class="btn btn-primary">
          EXPLORE EVENTS 
          <svg class="btn-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
        <a href="#merch-page" class="btn btn-secondary">
          SHOP MERCH
          <svg class="btn-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 90px; /* Header height */
  overflow: hidden;
}

/* Background Image & Filter Stack */
.hero-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-bg-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.6) brightness(0.25);
  animation: bgScale 20s infinite alternate ease-in-out;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 70% 30%, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.95) 90%),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 1) 100%);
  z-index: 2;
}

/* Main Container Grid */
.hero-container {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1.5rem 3rem;
  align-items: center;
  padding-top: 2rem;
  padding-bottom: 6rem;
}

/* Typography and Copy */
.hero-content {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.hero-title {
  font-size: clamp(2.5rem, 5.5vw, 4.2rem);
  font-weight: 800;
  line-height: 0.95;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}

.hero-description {
  font-size: clamp(0.95rem, 1.5vw, 1.15rem);
  color: var(--text-secondary);
  max-width: 480px;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0,0,0,0.9);
}

/* Call to Actions */
.hero-ctas {
  grid-column: 1;
  grid-row: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: var(--transition-smooth);
}

.btn-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary {
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border: 2px solid var(--text-primary);
}

.btn-primary:hover {
  background-color: transparent;
  color: var(--text-primary);
  box-shadow: 0 0 25px rgba(255,255,255,0.15);
}

.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-secondary {
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: var(--text-primary);
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
}

.btn-secondary:hover {
  border-color: var(--text-primary);
  background-color: rgba(255, 255, 255, 0.05);
}

.btn-secondary:hover .btn-arrow {
  transform: translateX(4px);
}

/* Mascot Logo */
.hero-mascot-container {
  grid-column: 2;
  grid-row: span 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mascot-tilt-card {
  position: relative;
  transition: var(--transition-smooth);
  animation: floatMascot 6s infinite ease-in-out;
}

.hero-mascot {
  width: 500px;
  height: auto;
  max-height: 2000px;
  filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.7)) brightness(1.15) contrast(1.1);
  transform: rotate(3deg);
  transition: var(--transition-smooth);
}

.mascot-tilt-card:hover .hero-mascot {
  transform: scale(1.03) rotate(-2deg);
  filter: drop-shadow(0 20px 45px rgba(255, 255, 255, 0.15)) brightness(1.2) contrast(1.15);
}

/* Scroll Down Link */
.scroll-down {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  text-align: center;
}

.scroll-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.scroll-link:hover {
  color: var(--text-primary);
}

.scroll-text {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  opacity: 0.6;
  transition: var(--transition-fast);
}

.scroll-link:hover .scroll-text {
  opacity: 1;
}

.scroll-caret {
  width: 14px;
  height: 14px;
  animation: bounceCaret 1.5s infinite alternate ease-in-out;
}

/* Animations */
@keyframes bgScale {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.08);
  }
}

@keyframes floatMascot {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes bounceCaret {
  0% {
    transform: translateY(0);
    opacity: 0.4;
  }
  100% {
    transform: translateY(6px);
    opacity: 1;
  }
}

/* Responsive Breakpoints */
@media (max-width: 992px) {
  .hero-container {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    text-align: center;
    padding-bottom: 8rem;
  }
  
  .hero-content {
    align-items: center;
    text-align: center;
  }
  
  .hero-description {
    max-width: 550px;
    margin-bottom: 0rem;
  }

  .hero-mascot-container {
    width: 100%;
  }

  .hero-mascot {
    width: 260px;
    max-height: 380px;
  }
  
  .hero-ctas {
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .hero-overlay {
    background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.95) 90%),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 1) 100%);
  }
}

@media (max-width: 767px) {
  .hero-mascot {
    width: 180px;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .hero {
    padding-top: 80px;
  }
  
  .hero-ctas {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }

  .hero-mascot {
    width: 150px;
  }
  
  .scroll-down {
    bottom: 1.5rem;
  }
}
</style>
