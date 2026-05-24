<script setup>
// No props required, standalone scrolling loop component
</script>

<template>
  <div class="marquee-section">
    <div class="marquee-track">
      <!-- Two identical tracks side by side to ensure seamless infinite looping -->
      <div class="marquee-group">
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
      </div>
      <div class="marquee-group" aria-hidden="true">
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
        <span class="marquee-text">DEATH ROCK STAR</span>
        <span class="marquee-dot"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-section {
  width: 100%;
  overflow: hidden;
  background-color: #000000;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 25s linear infinite;
}

.marquee-section:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-group {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-shrink: 0;
  min-width: 100%;
}

.marquee-text {
  font-family: var(--font-heading);
  font-size: clamp(1rem, 2vw, 2rem);
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0 1rem;
}



@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
