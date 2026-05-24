<template>
  <footer class="footer">
    <div class="container footer-grid">
      <!-- Brand Profile Column -->
      <div class="footer-brand-col">
        <div class="brand-logo-wrapper">
          <img src="/logo/logo.png" alt="Death Rock Star" class="brand-logo" />
          <span class="brand-name">DEATH ROCK STAR</span>
        </div>
        <p class="brand-description">
          A creative collective blending music, merchandise, and live experiences. 
          Built for the scene, inspired by the people.
        </p>
        <div class="social-links">
          <!-- Instagram -->
          <a href="#" aria-label="Instagram" class="social-icon-link">
            <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <!-- X (Twitter) -->
          <a href="#" aria-label="X (formerly Twitter)" class="social-icon-link">
            <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
          </a>
          <!-- YouTube -->
          <a href="#" aria-label="YouTube" class="social-icon-link">
            <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
          <!-- Spotify -->
          <a href="#" aria-label="Spotify" class="social-icon-link">
            <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 11.5c2.5-1.5 5.5-1.5 8 0"></path>
              <path d="M7 9c3.5-2 7.5-2 11 0"></path>
              <path d="M9 14c2-1 4-1 6 0"></path>
            </svg>
          </a>
        </div>
      </div>

      <!-- Links Grid Column: Menu -->
      <div class="footer-links-col">
        <h4 class="col-title">MENU</h4>
        <ul class="footer-links">
          <li><a href="#home" class="hover-underline">Home</a></li>
          <li><a href="#merch-page" class="hover-underline">Merch</a></li>
          <li><a href="#events-page" class="hover-underline">Events</a></li>
          <li><a href="#about" class="hover-underline">About</a></li>
          <li><a href="#contact" class="hover-underline">Contact</a></li>
        </ul>
      </div>

      <!-- Links Grid Column: Shop -->
      <div class="footer-links-col">
        <h4 class="col-title">SHOP</h4>
        <ul class="footer-links">
          <li><a href="#merch-page" class="hover-underline">All Merch</a></li>
          <li><a href="#merch-page" class="hover-underline">T-Shirt</a></li>
          <li><a href="#merch-page" class="hover-underline">Hoodie</a></li>
          <li><a href="#merch-page" class="hover-underline">Accessories</a></li>
          <li><a href="#merch-page" class="hover-underline">Sale</a></li>
        </ul>
      </div>

      <!-- Links Grid Column: Info -->
      <div class="footer-links-col">
        <h4 class="col-title">INFO</h4>
        <ul class="footer-links">
          <li><a href="#" class="hover-underline">FAQ</a></li>
          <li><a href="#" class="hover-underline">Shipping</a></li>
          <li><a href="#" class="hover-underline">Returns</a></li>
          <li><a href="#" class="hover-underline">Terms & Conditions</a></li>
          <li><a href="#" class="hover-underline">Privacy Policy</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom copyrights area -->
    <div class="footer-bottom">
      <div class="container footer-bottom-container">
        <p class="copyright">© 2024 Death Rock Star. All rights reserved.</p>
        <p class="tagline">Built for the scene.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #030303;
  color: var(--text-primary);
  padding: 6rem 0 3rem 0;
  border-top: 1px solid var(--border-color);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 4rem;
  margin-bottom: 5rem;
}

/* Brand Column styling */
.footer-brand-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.brand-logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.brand-logo {
  height: 62px;
  width: auto;
  filter: brightness(0) invert(1) contrast(1.2);
}

.brand-name {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}

.brand-description {
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 320px;
  margin-bottom: 2rem;
}

/* Social icons structure */
.social-links {
  display: flex;
  gap: 1rem;
}

.social-icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  transition: var(--transition-smooth);
}

.social-icon-link:hover {
  color: var(--text-primary);
  border-color: var(--text-primary);
  background-color: var(--bg-tertiary);
  transform: translateY(-2px);
}

.social-icon {
  width: 16px;
  height: 16px;
}

/* Link Columns */
.footer-links-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.col-title {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  margin-bottom: 1.75rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-links a {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.footer-links a:hover {
  color: var(--text-primary);
}

/* Footer Bottom Bar */
.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}

.footer-bottom-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tagline {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Responsive Queries */
@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

@media (max-width: 576px) {
  .footer {
    padding: 4rem 0 2rem 0;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    margin-bottom: 3.5rem;
  }
  
  .footer-bottom-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
