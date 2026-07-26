<script setup>
import { ref, computed, onMounted } from 'vue'
import { t, currentLang } from '../store/lang.js'
import { cartItems, addItem, decrementItem, getItemQuantity, getVariantQuantity, setCartItemQuantity } from '../store/cart.js'
import { products, fetchProducts } from '../store/apiStore.js'

onMounted(() => {
  if (products.value.length === 0) {
    fetchProducts()
  }
})

const translateLabel = (label) => {
  if (!label) return ''
  const key = label.toLowerCase().replace(' ', '').replace('-', '')
  const mapping = {
    bestseller: 'bestSeller',
    preorder: 'preOrder',
    soldout: 'soldOut',
    limited: 'limited'
  }
  const storeKey = mapping[key] || key
  return t(storeKey)
}

// Modal State (for quick view if needed)
const selectedProduct = ref(null)
const activeImgIndex = ref(0)
const selectedSize = ref('M')
const selectedColor = ref('Pure Black')
const selectedQuantity = ref(0)
const isZoomed = ref(false)

const currentStock = computed(() => {
  if (!selectedProduct.value) return 0
  const varians = selectedProduct.value.varians || []
  if (varians.length > 0) {
    const match = varians.find(v => {
      const matchSize = !selectedSize.value || v.size === selectedSize.value || v.name === selectedSize.value
      const matchColor = !v.color || !selectedColor.value || v.color === selectedColor.value
      return matchSize && matchColor
    })
    if (match) {
      return match.stock
    }
  }
  return selectedProduct.value.stock || 0
})

const openQuickView = (product) => {
  window.location.hash = `#merch-detail-${product.id}`
}

const closeQuickView = () => {
  selectedProduct.value = null
  document.body.style.overflow = ''
}

const prevImage = () => {
  if (!selectedProduct.value) return
  const total = selectedProduct.value.images.length
  activeImgIndex.value = (activeImgIndex.value - 1 + total) % total
}

const nextImage = () => {
  if (!selectedProduct.value) return
  const total = selectedProduct.value.images.length
  activeImgIndex.value = (activeImgIndex.value + 1) % total
}

const selectThumbnail = (index) => {
  activeImgIndex.value = index
}

const selectSize = (size) => {
  selectedSize.value = size
  updateModalQuantity()
}

const selectColor = (colorName) => {
  selectedColor.value = colorName
  updateModalQuantity()
}

const updateModalQuantity = () => {
  if (!selectedProduct.value) return
  const cartQty = getVariantQuantity(selectedProduct.value.id, selectedSize.value, selectedColor.value)
  if (cartQty > 0) {
    selectedQuantity.value = Math.min(cartQty, currentStock.value)
  } else if (currentStock.value > 0) {
    selectedQuantity.value = 1
  } else {
    selectedQuantity.value = 0
  }
}

const incrementQty = () => {
  if (selectedQuantity.value < currentStock.value) {
    selectedQuantity.value++
  }
}

const decrementQty = () => {
  if (selectedQuantity.value > 0) {
    selectedQuantity.value--
  }
}

const handleAddToCart = () => {
  if (!selectedProduct.value || currentStock.value <= 0 || selectedQuantity.value <= 0) return
  setCartItemQuantity(selectedProduct.value, selectedSize.value, selectedColor.value, selectedQuantity.value)
  closeQuickView()
}

const handleChat = () => {
  alert(currentLang.value === 'id' 
    ? `Menghubungi manajer toko mengenai ${selectedProduct.value.name}...` 
    : `Connecting to store manager about ${selectedProduct.value.name}...`)
}

const isSizeGuideOpen = ref(false)
const defaultSizeChart = 'https://api.kolektix.com/storage/uploads/products/product_6a21cabdaeaee.jpeg'

const openSizeGuide = () => {
  isSizeGuideOpen.value = true
}

const closeSizeGuide = () => {
  isSizeGuideOpen.value = false
}
</script>

<template>
  <section id="merch" class="merch-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-left">
          <span class="section-tag">{{ t('merch') }}</span>
          <h2 class="section-title">{{ t('merchTitle') }}</h2>
        </div>
        <a href="#merch-page" class="view-all-link hover-underline">
          {{ t('viewAllMerch') }} 
          <svg class="link-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      <!-- Products Grid -->
      <div class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card" @click="openQuickView(product)">
          <!-- Image Container -->
          <div class="product-image-wrapper">
            <!-- Label Badge -->
            <span 
              v-if="product.label" 
              class="product-badge-label" 
              :class="product.label.toLowerCase().replace(' ', '-')"
            >
              {{ translateLabel(product.label) }}
            </span>
            <img :src="product.image" :alt="product.name" class="product-image" />
            <!-- Pilih Varian button overlay -->
            <button 
              class="quick-add-btn" 
              :class="{ 'disabled-btn': product.stock <= 0 }"
              :disabled="product.stock <= 0"
              @click.stop="openQuickView(product)"
            >
              <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span>{{ product.stock > 0 ? (currentLang === 'id' ? 'Pilih Varian' : 'Select Variant') : t('soldOut') }}</span>
            </button>
          </div>

          <!-- Product Details -->
          <div class="product-details">
            <!-- Name -->
            <h3 class="product-name">{{ product.name }}</h3>

            <!-- Price (below name, aligned right) -->
            <div class="price-row">
              <p class="product-price">{{ product.price }}</p>
            </div>
            
            <!-- Rating & Sold Count -->
            <div class="product-rating-row">
              <span class="star-icon">⭐</span>
              <span class="rating-val">{{ product.rating || '4.8' }}</span>
              <span class="divider-bullet">•</span>
              <span class="sold-count">{{ product.soldCount || '100+' }} {{ currentLang === 'id' ? 'terjual' : 'sold' }}</span>
            </div>

            <!-- Location -->
            <div class="product-location-row">
              <svg class="pin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span class="location-text">{{ product.location || 'Warehouse Kita' }}</span>
            </div>

            <!-- Divider -->
            <div class="product-card-divider"></div>

            <!-- Seller Info -->
            <div class="product-seller-row">
              <div class="seller-avatar">
                <img v-if="product.sellerAvatar" :src="product.sellerAvatar" :alt="product.sellerName" class="seller-avatar-img" />
                <span v-else class="seller-k">k</span>
              </div>
              <div class="seller-info-text">
                <span class="provided-by">{{ currentLang === 'id' ? 'Disediakan oleh' : 'Provided by' }}</span>
                <div class="seller-name-row">
                  <span class="seller-name">{{ product.sellerName || 'moofeet' }}</span>
                  <svg class="verified-badge-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0D5EF4">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Overlay Modal -->
    <transition name="fade">
      <div v-if="selectedProduct" class="qv-overlay" @click.self="closeQuickView">
        <div class="qv-modal">
          <!-- Close Button -->
          <button class="qv-close-btn" @click="closeQuickView" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qv-close-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Desktop Two-Column Split / Mobile Single-Column -->
          <div class="qv-content">
            <!-- Left Column: Media Gallery -->
            <div class="qv-gallery">
              <!-- Large main showcase -->
              <div class="qv-showcase" :class="{ 'zoomed': isZoomed }">
                <img :src="selectedProduct.images[activeImgIndex]" :alt="selectedProduct.name" class="qv-main-image" @click="isZoomed = !isZoomed" />
                
                <!-- Zoom Toggle -->
                <button class="qv-zoom-btn" @click.stop="isZoomed = !isZoomed" :aria-label="isZoomed ? 'Zoom out' : 'Zoom in'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qv-zoom-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                <!-- Navigation Arrows -->
                <button class="qv-nav-btn prev" @click.stop="prevImage" aria-label="Previous image">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qv-arrow-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button class="qv-nav-btn next" @click.stop="nextImage" aria-label="Next image">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qv-arrow-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- Thumbnails Row -->
              <div class="qv-thumbnails">
                <button 
                  v-for="(img, idx) in selectedProduct.images" 
                  :key="idx" 
                  class="qv-thumb-btn"
                  :class="{ 'active': idx === activeImgIndex }"
                  @click.stop="selectThumbnail(idx)"
                >
                  <img :src="img" :alt="`${selectedProduct.name} preview ${idx + 1}`" class="qv-thumb-img" />
                </button>
              </div>
            </div>

            <!-- Right Column: Product Information -->
            <div class="qv-info">
              <!-- Header info -->
              <div class="qv-info-header">
                <span class="qv-tag">DEATHROCKSTAR (DRS) MART</span>
                <h2 class="qv-title">{{ selectedProduct.name }}</h2>
                
                <!-- Ratings Row -->
                <div class="qv-rating-row">
                  <div class="qv-stars">
                    <span v-for="star in 5" :key="star" class="qv-star">★</span>
                  </div>
                  <span class="qv-reviews">(12 {{ currentLang === 'id' ? 'Ulasan' : 'Reviews' }})</span>
                </div>

                <!-- Price -->
                <p class="qv-price">{{ selectedProduct.price }}</p>

                <!-- Description -->
                <p class="qv-body-text qv-header-desc">{{ selectedProduct.description[currentLang] || selectedProduct.description }}</p>
              </div>

              <!-- Variants Selectors -->
              <div class="qv-variants">
                <!-- Size Selector -->
                <div class="qv-variant-group">
                  <div class="qv-variant-header">
                    <h4 class="qv-section-title">{{ t('size') }}</h4>
                    <button class="qv-size-guide-btn" @click.stop="openSizeGuide">
                      <svg class="ruler-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 21H3V3l18 18Z"/>
                        <path d="M8 21v-3"/>
                        <path d="M12 21v-3"/>
                        <path d="M16 21v-3"/>
                      </svg>
                      <span>{{ t('sizeGuide') }}</span>
                    </button>
                  </div>
                  <div class="qv-size-chips">
                    <button 
                      v-for="size in selectedProduct.sizes" 
                      :key="size" 
                      class="qv-size-chip"
                      :class="{ 'active': size === selectedSize }"
                      @click.stop="selectSize(size)"
                    >
                      {{ size }}
                    </button>
                  </div>
                </div>

                <!-- Quantity Selector -->
                <div class="qv-variant-group">
                  <h4 class="qv-section-title">{{ t('quantity') }}</h4>
                  <div class="qv-quantity-stock-row">
                    <div class="qv-qty-stepper">
                      <button class="qv-qty-btn" @click.stop="decrementQty" :disabled="selectedQuantity <= 0">-</button>
                      <span class="qv-qty-val">{{ selectedQuantity }}</span>
                      <button class="qv-qty-btn" @click.stop="incrementQty" :disabled="selectedQuantity >= currentStock">+</button>
                    </div>

                    <!-- Stock Badge Pill -->
                    <div class="qv-stock-badge-pill" :class="{ 'sold-out': currentStock <= 0 }">
                      <span class="stock-dot"></span>
                      <span class="stock-text">
                        {{ currentStock > 0 ? `${t('availableStock')} (${currentStock})` : t('outOfStock') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Bar (Desktop side-by-side) -->
              <div class="qv-actions desktop-actions">
                <button 
                  class="qv-btn-primary" 
                  :disabled="currentStock <= 0 || selectedQuantity <= 0"
                  :class="{ 'btn-sold-out': currentStock <= 0 || selectedQuantity <= 0 }"
                  @click.stop="handleAddToCart"
                >
                  <svg v-if="currentStock > 0 && selectedQuantity > 0" class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg v-else class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>{{ currentStock > 0 ? t('addToCart') : t('soldOut') }}</span>
                </button>
                <button class="qv-btn-secondary" @click.stop="handleChat">
                  <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{{ t('chat') }}</span>
                </button>
              </div>

            </div>
          </div>

          <!-- Sticky Mobile Action Bar -->
          <div class="qv-actions mobile-actions">
            <button 
              class="qv-btn-primary" 
              :disabled="currentStock <= 0 || selectedQuantity <= 0"
              :class="{ 'btn-sold-out': currentStock <= 0 || selectedQuantity <= 0 }"
              @click.stop="handleAddToCart"
            >
              <svg v-if="currentStock > 0 && selectedQuantity > 0" class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <svg v-else class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>{{ currentStock > 0 ? t('addToCart') : t('soldOut') }}</span>
            </button>
            <button class="qv-btn-secondary" @click.stop="handleChat">
              <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{{ t('chat') }}</span>
            </button>
          </div>

        </div>
      </div>
    </transition>

    <!-- Size Guide Image Modal Popup -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isSizeGuideOpen" class="size-guide-overlay" @click.self="closeSizeGuide">
          <div class="size-guide-modal">
            <div class="size-guide-header">
              <h3>{{ currentLang === 'id' ? 'Panduan Ukuran' : 'Size Guide' }}</h3>
              <button class="size-guide-close" @click="closeSizeGuide" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="size-guide-body">
              <img 
                :src="selectedProduct?.sizeChartImage || defaultSizeChart" 
                alt="Panduan Ukuran / Size Guide" 
                class="size-guide-img"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
/* Size Guide Modal Popup */
.size-guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.size-guide-modal {
  position: relative;
  background-color: #121212;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
}

.size-guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #2a2a2a;
  background-color: #181818;
}

.size-guide-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #ffffff;
  text-transform: uppercase;
}

.size-guide-close {
  background: transparent;
  border: none;
  color: #a3a3a3;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-guide-close:hover {
  background-color: #2a2a2a;
  color: #ffffff;
}

.size-guide-close svg {
  width: 20px;
  height: 20px;
}

.size-guide-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0a0a0a;
}

.size-guide-img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.merch-section {
  background-color: var(--bg-primary);
  padding: 4rem 0 4rem 0;
  border-top: 1px solid var(--border-color);
}

/* Section Header styling */
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
  font-size: clamp(1.4rem, 2.8vw, 2.2rem);
  font-weight: 800;
  line-height: 1;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  padding-bottom: 4px;
}

.link-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.view-all-link:hover .link-arrow {
  transform: translateX(4px);
}

/* Grid Layout */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

/* Product Card */
.product-card {
  display: flex;
  flex-direction: column;
  background-color: #1E1E1E;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.product-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
}

/* Product Image Wrapper */
.product-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #0b0b0b;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
}

.product-badge-label {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 5;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.product-badge-label.sold-out {
  background-color: #ff3b30;
  color: #ffffff;
}

.product-badge-label.pre-order {
  background-color: #2563eb;
  color: #ffffff;
}

.product-badge-label.limited {
  background-color: #f59e0b;
  color: #000000;
}

.product-badge-label.best-seller {
  background-color: #10b981;
  color: #ffffff;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.1) brightness(0.9);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Pilih Varian Button styling overlay inside image */
.quick-add-btn {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  color: #000000;
  padding: 0.65rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover .quick-add-btn {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn:hover {
  background-color: #e5e5e5;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
}

.quick-add-btn:disabled,
.quick-add-btn.disabled-btn {
  background-color: #333333 !important;
  color: #888888 !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  opacity: 0.5 !important;
  transform: translateY(0) !important;
}

.cart-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

/* Product Details */
.product-details {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
  background-color: #1E1E1E;
}

.product-name {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 500;
  color: #FFFFFF;
  margin: 0;
  text-transform: none;
  line-height: 1.3;
}

.price-row {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0.25rem;
}

.product-price {
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  white-space: nowrap;
}

/* Rating, Location, and Seller styling */
.product-rating-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #A3A3A3;
  margin-top: 0.35rem;
}

.star-icon {
  font-size: 0.85rem;
}

.rating-val {
  color: #FFFFFF;
  font-weight: 700;
}

.divider-bullet {
  color: #525252;
}

.product-location-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #A3A3A3;
  margin-top: 0.35rem;
}

.pin-icon {
  width: 12px;
  height: 12px;
  color: #FFFFFF;
  flex-shrink: 0;
}

.location-text {
  color: #FFFFFF;
  font-weight: 500;
}

.product-card-divider {
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  margin: 0.75rem 0;
  width: 100%;
}

.product-seller-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.seller-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #0D5EF4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(13, 94, 244, 0.2);
  overflow: hidden;
}

.seller-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.seller-k {
  color: #ffffff;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 1rem;
  line-height: 1;
  transform: translateY(-0.5px);
}

.seller-info-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.provided-by {
  font-size: 0.6rem;
  font-weight: 500;
  color: #525252;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.seller-name-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1px;
}

.seller-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #FFFFFF;
}

.verified-badge-svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.quantity-row {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.qty-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-icon {
  width: 12px;
  height: 12px;
}

.qty-value {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
  width: 28px;
  text-align: center;
  user-select: none;
}

.product-divider {
  height: 1px;
  background-color: var(--border-color);
  width: 100%;
}

.product-details-bottom {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.partner-store {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.partner-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
  filter: grayscale(100%) contrast(1.5) brightness(1.2);
}

.partner-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.partner-label {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  line-height: 1.2;
}

.partner-name {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  text-transform: lowercase;
}

/* ========================================== */
/* QUICK VIEW OVERLAY MODAL STYLING           */
/* ========================================== */

.qv-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* Quick View Modal Card */
.qv-modal {
  position: relative;
  width: 100%;
  max-width: 960px;
  max-height: 90vh;
  background-color: #0e0e0e;
  border: 1px solid #242424;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  overflow: hidden;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85);
}

/* Close Button */
.qv-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 20;
  background: rgba(18, 18, 18, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a3a3a3;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qv-close-btn:hover {
  color: #ffffff;
  background: #262626;
}

.qv-close-icon {
  width: 20px;
  height: 20px;
}

/* Split Content */
.qv-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: 100%;
}

/* Left Column: Media Gallery */
.qv-gallery {
  width: 48%;
  border-right: 1px solid #222222;
  display: flex;
  flex-direction: column;
  background-color: #080808;
}

.qv-showcase {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #080808;
  overflow: hidden;
  padding: 0;
  border-bottom: 1px solid #1f1f1f;
}

.qv-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Zoomed State */
.qv-showcase.zoomed .qv-main-image {
  transform: scale(1.6);
  cursor: zoom-out;
}

.qv-showcase:not(.zoomed) .qv-main-image {
  cursor: zoom-in;
}

/* Zoom icon button */
.qv-zoom-btn {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  background: rgba(18, 18, 18, 0.85);
  border: 1px solid #2a2a2a;
  color: #ffffff;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  z-index: 5;
}

.qv-zoom-btn:hover {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

.qv-zoom-icon {
  width: 16px;
  height: 16px;
}

/* Nav arrows */
.qv-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(18, 18, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  z-index: 5;
}

.qv-nav-btn:hover {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

.qv-nav-btn.prev {
  left: 1rem;
}

.qv-nav-btn.next {
  right: 1rem;
}

.qv-arrow-icon {
  width: 18px;
  height: 18px;
}

/* Thumbnails */
.qv-thumbnails {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background-color: #080808;
}

.qv-thumb-btn {
  background: #0d0d0d;
  border: 1px solid #242424;
  width: 64px;
  height: 64px;
  aspect-ratio: 1 / 1;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: var(--transition-fast);
  opacity: 0.65;
}

.qv-thumb-btn:hover {
  opacity: 1;
  border-color: #555555;
}

.qv-thumb-btn.active {
  opacity: 1;
  border: 2px solid #ffffff;
  outline: none;
}

.qv-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

/* Right Column: Info */
.qv-info {
  width: 52%;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  overflow-y: auto;
  padding: 2.5rem 3rem;
  background-color: #0e0e0e;
  text-align: left;
}

/* Scrollbar for qv-info */
.qv-info::-webkit-scrollbar {
  width: 6px;
}

.qv-info::-webkit-scrollbar-track {
  background: #0e0e0e;
}

.qv-info::-webkit-scrollbar-thumb {
  background: #262626;
}

/* Header Content */
.qv-info-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.qv-tag {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #737373;
  text-transform: uppercase;
}

.qv-title {
  font-family: var(--font-heading), 'Arial Black', sans-serif;
  font-size: 1.65rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0.25rem 0 0 0;
  text-transform: uppercase;
  line-height: 1.2;
}

.qv-rating-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.qv-stars {
  color: #eab308;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

.qv-reviews {
  font-size: 0.8rem;
  color: #737373;
  font-weight: 500;
}

.qv-price {
  font-family: var(--font-body), sans-serif;
  font-size: 1.75rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0.75rem 0 0 0;
}

/* Sections */
.qv-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.qv-section-title {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ffffff;
  text-transform: uppercase;
  margin: 0;
}

.qv-body-text {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #a3a3a3;
  margin: 0;
}

/* Quantity Stock Row Layout */
.qv-quantity-stock-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.qv-stock-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #121212;
  border: 1px solid #262626;
  border-radius: 8px;
  padding: 0.55rem 1rem;
  transition: all 0.3s ease;
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4cd964;
  display: inline-block;
  box-shadow: 0 0 8px rgba(76, 217, 100, 0.4);
}

.stock-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #a3a3a3;
  letter-spacing: 0.02em;
}

/* Sold Out State styling */
.qv-stock-badge-pill.sold-out {
  background-color: rgba(255, 59, 48, 0.1);
  border-color: rgba(255, 59, 48, 0.3);
}

.qv-stock-badge-pill.sold-out .stock-dot {
  background-color: #ff3b30;
  box-shadow: 0 0 8px rgba(255, 59, 48, 0.4);
}

.qv-stock-badge-pill.sold-out .stock-text {
  color: #ff453a;
}

.qv-header-desc {
  margin-top: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #242424;
}

/* Variants */
.qv-variants {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.qv-variant-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.qv-variant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.qv-size-guide-btn {
  background: none;
  border: none;
  color: #a3a3a3;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.qv-size-guide-btn:hover {
  color: #ffffff;
}

.ruler-icon {
  width: 14px;
  height: 14px;
  opacity: 0.85;
}

/* Size Chips */
.qv-size-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.qv-size-chip {
  background: #0c0c0c;
  border: 1px solid #2f2f2f;
  color: #a3a3a3;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 48px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qv-size-chip:hover {
  border-color: #ffffff;
  color: #ffffff;
}

.qv-size-chip.active {
  background-color: #000000;
  border: 2px solid #ffffff;
  color: #ffffff;
  font-weight: 900;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
  opacity: 0;
  pointer-events: none;
}

/* Qty Stepper */
.qv-qty-stepper {
  display: flex;
  align-items: center;
  border: 1px solid #2f2f2f;
  background-color: #080808;
  border-radius: 8px;
  width: fit-content;
  height: 44px;
  overflow: hidden;
}

.qv-qty-btn {
  background: none;
  border: none;
  color: #ffffff;
  width: 40px;
  height: 100%;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.qv-qty-btn:hover:not(:disabled) {
  background-color: #242424;
}

.qv-qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qv-qty-val {
  font-family: var(--font-body), sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  color: #ffffff;
  width: 40px;
  text-align: center;
}

/* Action Buttons */
.qv-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.qv-btn-primary {
  flex: 1.4;
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 0.9rem 1.5rem;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
}

.qv-btn-primary:hover {
  background-color: #f2f2f2;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.25);
}

.qv-btn-primary.btn-sold-out {
  background-color: rgba(255, 59, 48, 0.1) !important;
  color: #ff453a !important;
  border: 1px solid rgba(255, 59, 48, 0.3) !important;
  cursor: not-allowed;
  box-shadow: none !important;
}

.qv-btn-primary.btn-sold-out:hover {
  background-color: rgba(255, 59, 48, 0.15) !important;
  box-shadow: none !important;
}

.qv-btn-secondary {
  background-color: #121212;
  color: #ffffff;
  border: 1px solid #333333;
  padding: 0.9rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qv-btn-secondary:hover {
  border-color: #ffffff;
  background-color: #1a1a1a;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Hide mobile actions by default */
.qv-actions.mobile-actions {
  display: none;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive Layouts */
@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .merch-section {
    padding: 3rem 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
    margin-bottom: 2.5rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .product-details {
    padding: 1.25rem;
  }

  /* Modal adaptation into full-screen bottom sheet */
  .qv-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .qv-modal {
    max-height: 100vh;
    height: 100vh;
    border: none;
    background-color: #0c0c0c;
  }

  .qv-close-btn {
    top: 1rem;
    right: 1rem;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 50%;
    width: 38px;
    height: 38px;
    border: 1px solid #2C2C2C;
  }

  .qv-content {
    flex-direction: column;
    overflow-y: auto;
    padding-bottom: 100px; /* Space for the sticky bottom bar */
  }

  .qv-gallery {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #2C2C2C;
  }

  .qv-thumbnails {
    display: none; /* Hide thumbnails on mobile */
  }

  .qv-showcase {
    aspect-ratio: 1.1 / 1;
    border-bottom: none;
  }

  .qv-info {
    width: 100%;
    overflow-y: visible;
    padding: 2rem 1.5rem;
  }

  .qv-title {
    font-size: 22px;
  }

 
  .qv-actions.desktop-actions {
    display: none;
  }

  /* Fixed sticky mobile action bar at the very bottom */
  .qv-actions.mobile-actions {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #121212;
    border-top: 1px solid #2C2C2C;
    padding: 0.75rem 1rem;
    z-index: 100;
  }

  .qv-actions.mobile-actions .qv-btn-primary,
  .qv-actions.mobile-actions .qv-btn-secondary {
    padding: 0.75rem 1.25rem;
    font-size: 0.75rem;
  }

  /* Compact stock badge pill on mobile */
  .qv-stock-badge-pill {
    padding: 0.35rem 0.6rem;
  }
  .qv-stock-badge-pill .stock-text {
    font-size: 0.65rem;
  }
  .qv-stock-badge-pill .stock-dot {
    width: 6px;
    height: 6px;
  }
}
</style>
