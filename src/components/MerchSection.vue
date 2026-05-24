<script setup>
import { ref } from 'vue'
import { addItem, decrementItem, getItemQuantity, getVariantQuantity, setCartItemQuantity } from '../store/cart.js'

// Import local image assets
import teeImg from '../assets/images/merch_tee.png'
import hoodieImg from '../assets/images/merch_hoodie.png'
import capImg from '../assets/images/merch_cap.png'
import bagImg from '../assets/images/merch_bag.png'

// Import newly copied detail images for the gallery
import teeLogoDetail from '../assets/images/tee_detail_logo.png'
import teeLabelDetail from '../assets/images/tee_detail_label.png'
import teeFabricDetail from '../assets/images/tee_detail_fabric.png'

const products = ref([
  {
    id: 1,
    name: 'DRS LOGO TEE',
    price: 'Rp 149.000',
    image: teeImg,
    category: 'T-Shirt',
    description: 'Kaos resmi Deathrockstar dengan desain logo Track & Bark. Terbuat dari bahan cotton combed 30s yang nyaman dipakai sehari-hari. Cocok untuk kamu yang hidup di dalam dan untuk scene.',
    stock: 23,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pure Black', hex: '#000000' },
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Dark Grey', hex: '#2C2C2C' }
    ],
    images: [
      teeImg,
      teeLogoDetail,
      teeLabelDetail,
      teeFabricDetail
    ]
  },
  {
    id: 2,
    name: 'DRS HOODIE',
    price: 'Rp 299.000',
    image: hoodieImg,
    category: 'Hoodie',
    description: 'Hoodie pullover Deathrockstar premium dengan cetakan grafis bertekstur di bagian depan dan belakang. Dilengkapi kantong kanguru dan tali serut yang tebal. Melindungimu dari dinginnya malam di gig outdoor.',
    stock: 15,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pure Black', hex: '#000000' },
      { name: 'Dark Grey', hex: '#2C2C2C' }
    ],
    images: [
      hoodieImg,
      hoodieImg,
      hoodieImg,
      hoodieImg
    ]
  },
  {
    id: 3,
    name: 'DRS CAP',
    price: 'Rp 129.000',
    image: capImg,
    category: 'Accessories',
    description: 'Topi baseball Deathrockstar dengan strap besi yang bisa disesuaikan di bagian belakang. Menampilkan bordir logo depan bergaya brutalist yang tegas.',
    stock: 8,
    sizes: ['One Size'],
    colors: [
      { name: 'Pure Black', hex: '#000000' }
    ],
    images: [
      capImg,
      capImg,
      capImg,
      capImg
    ]
  },
  {
    id: 4,
    name: 'DRS TOTE BAG',
    price: 'Rp 99.000',
    image: bagImg,
    category: 'Accessories',
    description: 'Tote bag kanvas tebal tahan lama dengan desain grafis ikonik. Sangat luas untuk membawa piringan hitam, zine, merch, atau perlengkapan harianmu.',
    stock: 12,
    sizes: ['One Size'],
    colors: [
      { name: 'Pure Black', hex: '#000000' },
      { name: 'Pure White', hex: '#ffffff' }
    ],
    images: [
      bagImg,
      bagImg,
      bagImg,
      bagImg
    ]
  }
])

// Modal State
const selectedProduct = ref(null)
const activeImgIndex = ref(0)
const selectedSize = ref('M')
const selectedColor = ref('Pure Black')
const selectedQuantity = ref(0)
const isZoomed = ref(false)

const openQuickView = (product) => {
  selectedProduct.value = product
  activeImgIndex.value = 0
  selectedSize.value = product.sizes.includes('M') ? 'M' : product.sizes[0]
  selectedColor.value = product.colors[0]?.name || ''
  selectedQuantity.value = getVariantQuantity(product.id, selectedSize.value, selectedColor.value)
  isZoomed.value = false
  document.body.style.overflow = 'hidden'
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
  selectedQuantity.value = getVariantQuantity(selectedProduct.value.id, selectedSize.value, selectedColor.value)
}

const incrementQty = () => {
  selectedQuantity.value++
}

const decrementQty = () => {
  if (selectedQuantity.value > 0) {
    selectedQuantity.value--
  }
}

const handleAddToCart = () => {
  if (!selectedProduct.value) return
  setCartItemQuantity(selectedProduct.value, selectedSize.value, selectedColor.value, selectedQuantity.value)
  closeQuickView()
}

const handleChat = () => {
  alert(`Connecting to store manager about ${selectedProduct.value.name}...`)
}

const openSizeGuide = () => {
  alert(`Size Guide:\nS: 47 x 67 cm\nM: 50 x 70 cm\nL: 53 x 73 cm\nXL: 56 x 75 cm\nXXL: 59 x 77 cm`)
}
</script>

<template>
  <section id="merch" class="merch-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-left">
          <span class="section-tag">MERCH</span>
          <h2 class="section-title">MADE FOR THE SCENE.</h2>
        </div>
        <a href="#merch-page" class="view-all-link hover-underline">
          VIEW ALL MERCH 
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
            <img :src="product.image" :alt="product.name" class="product-image" />
            <div class="product-overlay">
              <button class="quick-add-btn" @click.stop="addItem(product)">
                <span>QUICK ADD</span>
                <svg class="plus-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
 
          <!-- Product Details -->
          <div class="product-details">
            <!-- Name -->
            <h3 class="product-name">{{ product.name }}</h3>

            <!-- Price (below name, aligned right) -->
            <div class="price-row">
              <p class="product-price">{{ product.price }}</p>
            </div>
            
            <!-- Quantity controls (below price, aligned right) -->
            <div class="quantity-row">
              <div class="quantity-controls" @click.stop>
                <button 
                  class="qty-btn minus" 
                  @click="decrementItem(product.id)"
                  :disabled="getItemQuantity(product.id) === 0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qty-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4" />
                  </svg>
                </button>
                <span class="qty-value">{{ getItemQuantity(product.id) }}</span>
                <button 
                  class="qty-btn plus" 
                  @click="addItem(product)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qty-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Divider Line -->
            <div class="product-divider"></div>

            <!-- Creator Section (below divider, aligned left) -->
            <div class="product-details-bottom">
              <div class="partner-store">
                <img src="/logo_mocca.png" alt="Mocca Logo" class="partner-logo" />
                <div class="partner-info">
                  <span class="partner-label">Partner Store</span>
                  <span class="partner-name">mocca</span>
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
                  <span class="qv-reviews">(12 Reviews)</span>
                </div>

                <!-- Price -->
                <p class="qv-price">{{ selectedProduct.price }}</p>

                <!-- Description -->
                <p class="qv-body-text qv-header-desc">{{ selectedProduct.description }}</p>
              </div>

              <!-- Variants Selectors -->
              <div class="qv-variants">
                <!-- Size Selector -->
                <div class="qv-variant-group">
                  <div class="qv-variant-header">
                    <h4 class="qv-section-title">SIZE</h4>
                    <button class="qv-size-guide-btn" @click.stop="openSizeGuide">
                      <svg class="ruler-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 21H3V3l18 18Z"/>
                        <path d="M8 21v-3"/>
                        <path d="M12 21v-3"/>
                        <path d="M16 21v-3"/>
                      </svg>
                      <span>Size Guide</span>
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

                <!-- Color Selector -->
                <div class="qv-variant-group">
                  <h4 class="qv-section-title">COLOR</h4>
                  <div class="qv-color-swatches">
                    <button 
                      v-for="color in selectedProduct.colors" 
                      :key="color.name" 
                      class="qv-color-swatch"
                      :class="{ 'active': color.name === selectedColor }"
                      :style="{ backgroundColor: color.hex }"
                      :title="color.name"
                      @click.stop="selectColor(color.name)"
                    >
                      <span class="sr-only">{{ color.name }}</span>
                    </button>
                  </div>
                </div>

                <!-- Quantity Selector -->
                <div class="qv-variant-group">
                  <h4 class="qv-section-title">QUANTITY</h4>
                  <div class="qv-quantity-stock-row">
                    <div class="qv-qty-stepper">
                      <button class="qv-qty-btn" @click.stop="decrementQty" :disabled="selectedQuantity <= 0">-</button>
                      <span class="qv-qty-val">{{ selectedQuantity }}</span>
                      <button class="qv-qty-btn" @click.stop="incrementQty">+</button>
                    </div>

                    <!-- Stock Badge Pill -->
                    <div class="qv-stock-badge-pill" :class="{ 'sold-out': selectedProduct.stock <= 0 }">
                      <span class="stock-dot"></span>
                      <span class="stock-text">
                        {{ selectedProduct.stock > 0 ? `Stok tersedia (${selectedProduct.stock})` : 'Stok habis' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Bar (Desktop side-by-side) -->
              <div class="qv-actions desktop-actions">
                <button 
                  class="qv-btn-primary" 
                  :disabled="selectedProduct.stock <= 0"
                  :class="{ 'btn-sold-out': selectedProduct.stock <= 0 }"
                  @click.stop="handleAddToCart"
                >
                  <svg v-if="selectedProduct.stock > 0" class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg v-else class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>{{ selectedProduct.stock > 0 ? 'TAMBAH KE KERANJANG' : 'SOLD OUT' }}</span>
                </button>
                <button class="qv-btn-secondary" @click.stop="handleChat">
                  <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>CHAT</span>
                </button>
              </div>

            </div>
          </div>

          <!-- Sticky Mobile Action Bar -->
          <div class="qv-actions mobile-actions">
            <button 
              class="qv-btn-primary" 
              :disabled="selectedProduct.stock <= 0"
              :class="{ 'btn-sold-out': selectedProduct.stock <= 0 }"
              @click.stop="handleAddToCart"
            >
              <svg v-if="selectedProduct.stock > 0" class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <svg v-else class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>{{ selectedProduct.stock > 0 ? 'TAMBAH KE KERANJANG' : 'SOLD OUT' }}</span>
            </button>
            <button class="qv-btn-secondary" @click.stop="handleChat">
              <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>CHAT</span>
            </button>
          </div>

        </div>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.merch-section {
  background-color: var(--bg-primary);
  padding: 8rem 0 4rem 0;
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
  font-size: clamp(2rem, 4vw, 3rem);
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
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  transition: var(--transition-smooth);
  cursor: pointer;
}

.product-card:hover {
  border-color: var(--border-color-hover);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8);
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

/* Overlay & Quick Add Button */
.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--text-primary);
  color: var(--bg-primary);
  padding: 0.75rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  transform: translateY(15px);
  transition: var(--transition-smooth);
}

.product-card:hover .quick-add-btn {
  transform: translateY(0);
}

.quick-add-btn:hover {
  background-color: #e5e5e5;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.plus-icon {
  width: 14px;
  height: 14px;
}

/* Product Details */
.product-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  text-align: left;
}

.product-name {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-primary);
  margin: 0;
}

.price-row {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.product-price {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
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
  border-radius: 4px;
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
  width: 100vw;
  height: 100vh;
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
  max-width: 1024px;
  max-height: 90vh;
  background-color: #121212;
  border: 1px solid #2C2C2C;
  border-radius: 0px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  overflow: hidden;
  box-shadow: none; /* flat design */
}

/* Close Button */
.qv-close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  background: none;
  border: none;
  color: #a3a3a3;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.qv-close-btn:hover {
  color: #ffffff;
}

.qv-close-icon {
  width: 24px;
  height: 24px;
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
  width: 50%;
  border-right: 1px solid #2C2C2C;
  display: flex;
  flex-direction: column;
  background-color: #0b0b0b;
}

.qv-showcase {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0b0b;
  overflow: hidden;
  border-bottom: 1px solid #2C2C2C;
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
  top: 1rem;
  left: 1rem;
  background: rgba(18, 18, 18, 0.85);
  border: 1px solid #2C2C2C;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
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
  background: rgba(18, 18, 18, 0.85);
  border: 1px solid #2C2C2C;
  color: #ffffff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  z-index: 2;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0px;
  background-color: #121212;
}

.qv-thumb-btn {
  background: none;
  border: none;
  aspect-ratio: 1 / 1;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  border-right: 1px solid #2C2C2C;
  transition: var(--transition-fast);
  opacity: 0.6;
}

.qv-thumb-btn:last-child {
  border-right: none;
}

.qv-thumb-btn:hover {
  opacity: 0.9;
}

.qv-thumb-btn.active {
  opacity: 1;
  outline: 2px solid #ffffff;
  outline-offset: -2px;
}

.qv-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Right Column: Info */
.qv-info {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  overflow-y: auto;
  padding: 2.5rem;
  background-color: #121212;
  text-align: left;
}

/* Scrollbar for qv-info */
.qv-info::-webkit-scrollbar {
  width: 6px;
}

.qv-info::-webkit-scrollbar-track {
  background: #121212;
}

.qv-info::-webkit-scrollbar-thumb {
  background: #2C2C2C;
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
  letter-spacing: 0.15em;
  color: #a3a3a3;
  text-transform: uppercase;
}

.qv-title {
  font-family: var(--font-heading), 'Arial Black', sans-serif;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin: 0;
}

.qv-rating-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.qv-stars {
  color: #ffffff;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.qv-reviews {
  font-size: 0.75rem;
  color: #a3a3a3;
}

.qv-price {
  font-family: var(--font-body), sans-serif;
  font-size: 1.75rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0.5rem 0 0 0;
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
  letter-spacing: 0.1em;
  color: #ffffff;
  text-transform: uppercase;
  margin: 0;
}

.qv-body-text {
  font-size: 0.875rem;
  line-height: 1.6;
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
  background-color: #181818;
  border: 1px solid #2C2C2C;
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
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
  margin-top: 1rem;
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
  background: none;
  border: 1px solid #2C2C2C;
  color: #a3a3a3;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 48px;
  height: 38px;
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
  font-weight: 800;
}

/* Color Swatches */
.qv-color-swatches {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.qv-color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  position: relative;
}

.qv-color-swatch:hover {
  transform: scale(1.08);
}

.qv-color-swatch.active {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
  border-color: transparent;
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
  border: 1px solid #2C2C2C;
  background-color: #0b0b0b;
  width: fit-content;
}

.qv-qty-btn {
  background: none;
  border: none;
  color: #ffffff;
  width: 40px;
  height: 40px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.qv-qty-btn:hover:not(:disabled) {
  background-color: #2C2C2C;
}

.qv-qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qv-qty-val {
  font-family: var(--font-body), sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
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
  flex: 1;
  background-color: #e5e5e5;
  color: #000000;
  border: none;
  padding: 1.25rem 2rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-transform: uppercase;
  border-radius: 0px;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.qv-btn-primary:hover {
  background-color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.25);
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
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #2C2C2C;
  padding: 1.25rem 2rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-transform: uppercase;
  border-radius: 0px;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.qv-btn-secondary:hover {
  border-color: #ffffff;
  background-color: rgba(255, 255, 255, 0.05);
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
    padding: 5rem 0;
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
