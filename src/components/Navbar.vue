<script setup>
import { ref, onMounted } from 'vue'
import { 
  cartItems, 
  isCartOpen, 
  addItem, 
  decrementItem, 
  removeItem, 
  totalItemsCount, 
  formattedTotalCartPrice 
} from '../store/cart.js'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleCheckout = () => {
  alert('Order simulation completed! Thank you for supporting the scene. 🤘')
  cartItems.value = []
  isCartOpen.value = false
}

const navLinks = [
  { name: 'HOME', href: '#home' },
  { name: 'MERCH', href: '#merch-page' },
  { name: 'EVENTS', href: '#events-page' },
  { name: 'ABOUT', href: '#about' },
  { name: 'CONTACT', href: '#contact' }
]

const currentHash = ref(window.location.hash || '#home')

onMounted(() => {
  window.addEventListener('hashchange', () => {
    currentHash.value = window.location.hash || '#home'
  })
})
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <!-- Logo -->
      <a href="#home" class="logo-link">
        <div class="logo-wrapper">
          <img src="/logo/logo.png" alt="Death Rock Star Mascot" class="logo-img" />
        </div>
      </a>

      <!-- Desktop Nav Links -->
      <div class="desktop-menu">
        <ul class="nav-list">
          <li v-for="link in navLinks" :key="link.name">
            <a 
              :href="link.href" 
              class="nav-item hover-underline"
              :class="{ 'active-link': currentHash === link.href || (link.href === '#home' && (currentHash === '' || currentHash === '#home')) }"
            >
              {{ link.name }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Right Action Items -->
      <div class="navbar-actions">
        <!-- Cart -->
        <button class="cart-btn" aria-label="View Cart" @click="isCartOpen = !isCartOpen">
          <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span class="cart-badge">{{ totalItemsCount }}</span>
        </button>

        <!-- CTA Button -->
        

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" @click="toggleMobileMenu" :class="{ 'is-active': isMobileMenuOpen }" aria-label="Toggle Menu">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Backdrop -->
    <transition name="fade">
      <div v-if="isMobileMenuOpen" class="menu-backdrop" @click="isMobileMenuOpen = false"></div>
    </transition>

    <!-- Mobile Menu Sidebar Drawer -->
    <transition name="slide-right">
      <div v-if="isMobileMenuOpen" class="mobile-menu-sidebar">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <h3 class="sidebar-title">MENU</h3>
          <button class="close-btn" @click="isMobileMenuOpen = false" aria-label="Close Menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="close-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Sidebar Body -->
        <div class="sidebar-body">
          <ul class="mobile-nav-list">
            <li v-for="link in navLinks" :key="link.name" @click="isMobileMenuOpen = false">
              <a 
                :href="link.href" 
                class="mobile-nav-item"
                :class="{ 'active-link': currentHash === link.href || (link.href === '#home' && (currentHash === '' || currentHash === '#home')) }"
              >
                {{ link.name }}
              </a>
            </li>
            <li class="mobile-cta-li">
              <button class="cta-btn mobile-cta" @click="isMobileMenuOpen = false">GET UPDATES</button>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!-- Cart Sidebar Drawer -->
    <transition name="fade">
      <div v-if="isCartOpen" class="cart-backdrop" @click="isCartOpen = false"></div>
    </transition>

    <transition name="slide-right">
      <div v-if="isCartOpen" class="cart-sidebar">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <h3 class="sidebar-title">YOUR CART</h3>
          <button class="close-btn" @click="isCartOpen = false" aria-label="Close Cart">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="close-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Sidebar Body / Item List -->
        <div class="sidebar-body">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p>Your cart is empty.</p>
            <button class="start-shopping-btn" @click="isCartOpen = false">START SHOPPING</button>
          </div>

          <div v-else class="cart-items-list">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <img :src="item.image" :alt="item.name" class="item-img" />
              <div class="item-details">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <button class="remove-btn" @click="removeItem(item.id)" aria-label="Remove item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="trash-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <span class="item-category">{{ item.category }}</span>
                <div class="item-footer">
                  <div class="qty-adjuster">
                    <button class="qty-adjust-btn minus" @click="decrementItem(item.id)">-</button>
                    <span class="qty-num">{{ item.quantity }}</span>
                    <button class="qty-adjust-btn plus" @click="addItem(item)">+</button>
                  </div>
                  <span class="item-price">{{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Footer -->
        <div v-if="cartItems.length > 0" class="sidebar-footer">
          <div class="total-row">
            <span>SUBTOTAL</span>
            <span class="total-price">{{ formattedTotalCartPrice }}</span>
          </div>
          <p class="shipping-note">Taxes and shipping calculated at checkout.</p>
          <button class="checkout-btn" @click="handleCheckout">PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  display: flex;
  align-items: center;
  transition: var(--transition-smooth);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-img {
  height: 68px;
  width: auto;
  filter: brightness(0) invert(1) contrast(1.2);
  transition: var(--transition-smooth);
}

.logo-wrapper:hover .logo-img {
  transform: rotate(-10deg) scale(1.1);
}

.logo-text {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  display: inline-block;
}

.desktop-menu {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 2.5rem;
}

.nav-item {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.nav-item:hover {
  color: var(--text-primary);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  padding: 0.5rem;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  width: 44px;
  height: 44px;
}

.cart-btn:hover {
  border-color: var(--border-color-hover);
  background-color: var(--bg-tertiary);
  transform: translateY(-2px);
}

.cart-icon {
  width: 18px;
  height: 18px;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--text-primary);
  color: var(--bg-primary);
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-primary);
}

.cta-btn {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.75rem 1.5rem;
  border: 1.5px solid var(--text-primary);
  color: var(--text-primary);
  background: transparent;
  text-transform: uppercase;
}

.cta-btn:hover {
  background-color: var(--text-primary);
  color: var(--bg-primary);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 16px;
  position: relative;
}

.hamburger-bar {
  width: 100%;
  height: 2px;
  background-color: var(--text-primary);
  transition: var(--transition-smooth);
}

.mobile-toggle.is-active .hamburger-bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.mobile-toggle.is-active .hamburger-bar:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.is-active .hamburger-bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Menu Sidebar Drawer */
.mobile-menu-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 320px;
  height: 100vh;
  background-color: #0c0c0c;
  border-left: 1px solid var(--border-color);
  z-index: 999;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.9);
}

.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 998;
}

.mobile-nav-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 1.5rem;
  align-items: flex-start;
  width: 100%;
}

.mobile-nav-item {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.mobile-nav-item:hover {
  color: var(--text-primary);
  transform: translateX(5px);
}

.mobile-cta-li {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-top: 1.5rem;
}

.mobile-cta {
  width: 100%;
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Media Queries */
@media (max-width: 992px) {
  .desktop-menu {
    display: none;
  }
  
  .mobile-toggle {
    display: flex;
  }
  
  .desktop-only {
    display: none;
  }
}

/* Cart Backdrop */
.cart-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 998;
}

/* Cart Sidebar */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 440px;
  height: 100vh;
  background-color: #0c0c0c;
  border-left: 1px solid var(--border-color);
  z-index: 999;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.9);
}

/* Header */
.sidebar-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.close-btn:hover {
  color: var(--text-primary);
  transform: rotate(90deg);
}

.close-icon {
  width: 20px;
  height: 20px;
}

/* Body / List */
.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

/* Custom scrollbar for sidebar */
.sidebar-body::-webkit-scrollbar {
  width: 6px;
}

.sidebar-body::-webkit-scrollbar-track {
  background: #070707;
}

.sidebar-body::-webkit-scrollbar-thumb {
  background: #222222;
  border-radius: 3px;
}

.sidebar-body::-webkit-scrollbar-thumb:hover {
  background: #333333;
}

/* Empty State */
.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--text-muted);
}

.empty-cart p {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.start-shopping-btn {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.75rem 1.5rem;
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.start-shopping-btn:hover {
  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

/* Cart Items */
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  background-color: #111;
  border: 1px solid var(--border-color);
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.item-name {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-primary);
  text-align: left;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.remove-btn:hover {
  color: #ff3b30;
}

.trash-icon {
  width: 16px;
  height: 16px;
}

.item-category {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
  margin-bottom: 0.75rem;
}

.item-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Mini Qty Adjuster */
.qty-adjuster {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  border-radius: 4px;
}

.qty-adjust-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.qty-adjust-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.qty-num {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
  width: 22px;
  text-align: center;
  user-select: none;
}

.item-price {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 2rem;
  border-top: 1px solid var(--border-color);
  background-color: #090909;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.total-row span:first-child {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.total-price {
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
}

.shipping-note {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  text-align: left;
}

.checkout-btn {
  width: 100%;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  cursor: pointer;
  transition: var(--transition-smooth);
  text-transform: uppercase;
}

.checkout-btn:hover {
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

/* Sidebar transitions */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive sidebar width */
@media (max-width: 480px) {
  .cart-sidebar {
    max-width: 100%;
  }
}
.nav-item.active-link {
  color: var(--text-primary) !important;
}

.nav-item.active-link::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.mobile-nav-item.active-link {
  color: var(--text-primary) !important;
}
</style>
