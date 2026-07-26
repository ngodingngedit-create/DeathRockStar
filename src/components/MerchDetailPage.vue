<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { t, currentLang } from '../store/lang.js'
import { getVariantQuantity, setCartItemQuantity } from '../store/cart.js'
import { products, fetchProducts } from '../store/apiStore.js'

const props = defineProps({
  productId: {
    type: Number,
    required: true
  }
})

onMounted(() => {
  if (products.value.length === 0) {
    fetchProducts()
  }
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Current Product from store
const currentProduct = computed(() => {
  const p = products.value.find(item => item.id === props.productId)
  if (p) return p
  return products.value[0] || {
    id: props.productId,
    name: 'Death Rock Star Official Merch',
    price: 'Rp 180.000',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2574&auto=format&fit=crop',
    description: { id: 'Official Merchandise Death Rock Star.', en: 'Official Merchandise Death Rock Star.' },
    stock: 10,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2574&auto=format&fit=crop'],
    rating: '4.8',
    soldCount: '100+',
    sizeChartImage: 'https://api.kolektix.com/storage/uploads/products/product_6a21cabdaeaee.jpeg'
  }
})

// Gallery State
const activeImgIndex = ref(0)
const isZoomed = ref(false)

// Selection State
const selectedSize = ref('M')
const selectedColor = ref('')
const selectedQuantity = ref(1)

// Active Tab ('description' | 'reviews' | 'recommendations')
const activeTab = ref('description')

// Sticky Bar Scroll State
const isStickyBar = ref(false)

const handleScroll = () => {
  if (window.scrollY > 320) {
    isStickyBar.value = true
  } else {
    isStickyBar.value = false
  }
}

const scrollToSection = (sectionId, tabName) => {
  activeTab.value = tabName
  if (sectionId === 'recommendations') {
    const el = document.querySelector('.related-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  } else {
    const el = document.querySelector('.md-tabs-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}

const initSelectedVariant = () => {
  if (!currentProduct.value) return
  const varians = currentProduct.value.varians || []
  const inStockVarian = varians.find(v => v.stock > 0)
  if (inStockVarian && (inStockVarian.size || inStockVarian.name)) {
    selectedSize.value = inStockVarian.size || inStockVarian.name
  } else if (currentProduct.value.sizes && currentProduct.value.sizes.length > 0) {
    selectedSize.value = currentProduct.value.sizes.includes('M') ? 'M' : currentProduct.value.sizes[0]
  } else {
    selectedSize.value = ''
  }
  updateQuantityState()
}

onMounted(() => {
  initSelectedVariant()
})

watch(() => props.productId, () => {
  activeImgIndex.value = 0
  isZoomed.value = false
  initSelectedVariant()
})

const currentStock = computed(() => {
  if (!currentProduct.value) return 0
  const varians = currentProduct.value.varians || []
  if (varians.length > 0) {
    const match = varians.find(v => !selectedSize.value || v.size === selectedSize.value || v.name === selectedSize.value)
    if (match) return match.stock
  }
  return currentProduct.value.stock || 0
})

const updateQuantityState = () => {
  if (!currentProduct.value) return
  const cartQty = getVariantQuantity(currentProduct.value.id, selectedSize.value, selectedColor.value)
  if (cartQty > 0) {
    selectedQuantity.value = Math.min(cartQty, currentStock.value)
  } else if (currentStock.value > 0) {
    selectedQuantity.value = 1
  } else {
    selectedQuantity.value = 0
  }
}

watch(selectedSize, () => {
  updateQuantityState()
})

const parsedPrice = computed(() => {
  if (!currentProduct.value?.price) return 180000
  const numStr = currentProduct.value.price.replace(/[^0-9]/g, '')
  return parseInt(numStr) || 180000
})

const subtotalFormatted = computed(() => {
  const total = parsedPrice.value * (selectedQuantity.value || 1)
  return 'Rp ' + total.toLocaleString('id-ID')
})

const prevImage = () => {
  if (!currentProduct.value?.images) return
  const total = currentProduct.value.images.length
  activeImgIndex.value = (activeImgIndex.value - 1 + total) % total
}

const nextImage = () => {
  if (!currentProduct.value?.images) return
  const total = currentProduct.value.images.length
  activeImgIndex.value = (activeImgIndex.value + 1) % total
}

const selectThumbnail = (idx) => {
  activeImgIndex.value = idx
}

const selectSize = (size) => {
  selectedSize.value = size
  updateQuantityState()
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
  if (!currentProduct.value || currentStock.value <= 0 || selectedQuantity.value <= 0) return
  setCartItemQuantity(currentProduct.value, selectedSize.value, selectedColor.value, selectedQuantity.value)
  alert(currentLang.value === 'id' 
    ? `${currentProduct.value.name} (${selectedSize.value}) berhasil ditambahkan ke keranjang!` 
    : `${currentProduct.value.name} (${selectedSize.value}) added to cart!`)
}

const handleChat = () => {
  alert(currentLang.value === 'id' 
    ? `Menghubungi manajer toko mengenai ${currentProduct.value.name}...` 
    : `Connecting to store manager about ${currentProduct.value.name}...`)
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({ title: currentProduct.value.name, url: window.location.href })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert(currentLang.value === 'id' ? 'Link produk telah disalin!' : 'Product link copied!')
  }
}

const isWishlisted = ref(false)

const handleWishlist = () => {
  isWishlisted.value = !isWishlisted.value
  alert(currentLang.value === 'id' 
    ? (isWishlisted.value ? 'Produk ditambahkan ke favorit!' : 'Produk dihapus dari favorit!') 
    : (isWishlisted.value ? 'Product added to wishlist!' : 'Product removed from wishlist!'))
}

// Size Guide Modal Popup State
const isSizeGuideOpen = ref(false)
const defaultSizeChart = 'https://api.kolektix.com/storage/uploads/products/product_6a21cabdaeaee.jpeg'

const openSizeGuide = () => {
  isSizeGuideOpen.value = true
}

const closeSizeGuide = () => {
  isSizeGuideOpen.value = false
}

// Back navigation
const goBack = () => {
  window.location.hash = '#merch-page'
}

// Related products
const relatedProducts = computed(() => {
  return products.value.filter(p => p.id !== props.productId).slice(0, 4)
})

const goToProduct = (id) => {
  window.location.hash = `#merch-detail-${id}`
}
</script>

<template>
  <div class="merch-detail-page">
    
    <!-- Sticky Tab Navigation Bar when Scrolled (Positioned at top: 90px below Navbar) -->
    <div class="md-sticky-header-bar" :class="{ 'visible': isStickyBar }">
      <div class="container md-sticky-container">
        <!-- Column 1: Title appears on left when scrolled -->
        <h4 class="md-sticky-title">{{ currentProduct.name }}</h4>
        
        <!-- Column 2: Tab Navigation Links aligned with Column 2 position -->
        <div class="md-sticky-tabs">
          <button 
            class="md-tab-btn" 
            :class="{ 'active': activeTab === 'description' }"
            @click="scrollToSection('description', 'description')"
          >
            Detail Produk
          </button>
          <button 
            class="md-tab-btn" 
            :class="{ 'active': activeTab === 'reviews' }"
            @click="scrollToSection('reviews', 'reviews')"
          >
            Ulasan (12)
          </button>
          <button 
            class="md-tab-btn" 
            :class="{ 'active': activeTab === 'recommendations' }"
            @click="scrollToSection('recommendations', 'recommendations')"
          >
            Rekomendasi
          </button>
        </div>

        <!-- Column 3: Empty space matching Column 3 checkout card width -->
        <div class="md-sticky-col3-space"></div>
      </div>
    </div>

    <div class="container">
      
      <!-- 3-Column Layout Grid -->
      <div class="md-3col-container">
        
        <!-- Column 1: Left Gallery Showcase & md-thumbnails -->
        <div class="md-col-gallery">
          <div class="md-showcase" :class="{ 'zoomed': isZoomed }">
            <img 
              :src="(currentProduct.images && currentProduct.images[activeImgIndex]) || currentProduct.image" 
              :alt="currentProduct.name" 
              class="md-main-image" 
              @click="isZoomed = !isZoomed" 
            />
            
            <!-- Zoom Button -->
            <button class="md-zoom-btn" @click.stop="isZoomed = !isZoomed" :aria-label="isZoomed ? 'Zoom out' : 'Zoom in'">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="md-zoom-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- Nav Arrows -->
            <button v-if="currentProduct.images && currentProduct.images.length > 1" class="md-nav-btn prev" @click.stop="prevImage" aria-label="Previous image">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="md-arrow-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button v-if="currentProduct.images && currentProduct.images.length > 1" class="md-nav-btn next" @click.stop="nextImage" aria-label="Next image">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="md-arrow-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- md-thumbnails -->
          <div v-if="currentProduct.images && currentProduct.images.length > 1" class="md-thumbnails">
            <button 
              v-for="(img, idx) in currentProduct.images" 
              :key="idx" 
              class="md-thumb-btn"
              :class="{ 'active': idx === activeImgIndex }"
              @click.stop="selectThumbnail(idx)"
            >
              <img :src="img" :alt="`${currentProduct.name} ${idx + 1}`" class="md-thumb-img" />
            </button>
          </div>
        </div>

        <!-- Column 2: Center Product Details & Tabs -->
        <div class="md-col-info">
          <h1 class="md-title">{{ currentProduct.name }}</h1>
          
          <div class="md-meta-row">
            <span class="md-sold-count">Terjual {{ currentProduct.soldCount || '100+' }}</span>
          </div>

          <div class="md-price">{{ currentProduct.price }}</div>

          <div class="md-divider"></div>

          <!-- Merchant / Store Info Box -->
          <div class="md-merchant-box">
            <div class="merchant-logo">Ber</div>
            <div class="merchant-details">
              <h4 class="merchant-name">bereanid</h4>
              <span class="merchant-location">Jakarta</span>
            </div>
          </div>

          <div class="md-divider"></div>

          <!-- Size Selection Section -->
          <div class="md-size-section">
            <div class="md-size-header">
              <span class="md-size-label">Pilih Ukuran: <strong class="md-size-val">{{ selectedSize || '-' }}</strong></span>
              <button class="md-size-guide-btn" @click.stop="openSizeGuide">
                <svg class="ruler-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 21H3V3l18 18Z"/>
                  <path d="M8 21v-3"/>
                  <path d="M12 21v-3"/>
                  <path d="M16 21v-3"/>
                </svg>
                <span>Panduan Ukuran</span>
              </button>
            </div>
            
            <div class="md-size-chips">
              <button 
                v-for="size in currentProduct.sizes" 
                :key="size" 
                class="md-size-chip"
                :class="{ 'active': size === selectedSize }"
                @click.stop="selectSize(size)"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="md-divider"></div>

          <!-- Tabs Section -->
          <div class="md-tabs-section">
            <div class="md-tabs-bar">
              <button 
                class="md-tab-btn" 
                :class="{ 'active': activeTab === 'description' }"
                @click="scrollToSection('description', 'description')"
              >
                Detail Produk
              </button>
              <button 
                class="md-tab-btn" 
                :class="{ 'active': activeTab === 'reviews' }"
                @click="scrollToSection('reviews', 'reviews')"
              >
                Ulasan (12)
              </button>
              <button 
                class="md-tab-btn" 
                :class="{ 'active': activeTab === 'recommendations' }"
                @click="scrollToSection('recommendations', 'recommendations')"
              >
                Rekomendasi
              </button>
            </div>

            <div class="md-tab-content">
              <div v-if="activeTab === 'description'" class="md-desc-text">
                <p>{{ currentProduct.description[currentLang] || currentProduct.description }}</p>
              </div>
              <div v-else-if="activeTab === 'reviews'" class="md-reviews-content">
                <div class="review-item">
                  <div class="review-header">
                    <div class="rev-stars">★★★★★</div>
                    <span class="rev-user">Raka M.</span>
                  </div>
                  <p class="rev-text">Bahan kaosnya sangat adem dan sablonannya berkualitas tinggi. Sangat recommended!</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Column 3: Right Sticky Checkout Card -->
        <div class="md-col-checkout">
          <div class="md-checkout-card">
            <h3 class="checkout-title">Jumlah</h3>

            <!-- Quantity Stepper & Stock -->
            <div class="checkout-qty-row">
              <div class="md-qty-stepper">
                <button class="md-qty-btn" @click.stop="decrementQty" :disabled="selectedQuantity <= 0">-</button>
                <span class="md-qty-val">{{ selectedQuantity }}</span>
                <button class="md-qty-btn" @click.stop="incrementQty" :disabled="selectedQuantity >= currentStock">+</button>
              </div>
              <span class="checkout-stock-text">
                Stok {{ currentStock > 0 ? currentStock : 0 }}
              </span>
            </div>

            <!-- Subtotal Row -->
            <div class="checkout-subtotal-row">
              <span class="subtotal-label">Subtotal</span>
              <span class="subtotal-amount">{{ subtotalFormatted }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="checkout-buttons">
              <button 
                class="btn-add-cart" 
                :disabled="currentStock <= 0 || selectedQuantity <= 0"
                :class="{ 'btn-disabled': currentStock <= 0 || selectedQuantity <= 0 }"
                @click="handleAddToCart"
              >
                <span class="plus-ic">+</span> Tambah Keranjang
              </button>

              <button 
                class="btn-buy-now"
                :disabled="currentStock <= 0 || selectedQuantity <= 0"
                :class="{ 'btn-disabled': currentStock <= 0 || selectedQuantity <= 0 }"
                @click="handleAddToCart"
              >
                Beli Sekarang
              </button>
            </div>

            <!-- Action Icons Row (Share, Wishlist, Chat) -->
            <div class="checkout-icon-actions">
              <button class="icon-action-btn" title="Bagikan" @click="handleShare">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="act-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9a3 3 0 100-2.684 3 3 0 000 2.684z" />
                </svg>
              </button>

              <button 
                class="icon-action-btn love-btn" 
                :class="{ 'is-active': isWishlisted }" 
                :title="isWishlisted ? 'Hapus dari Favorit' : 'Tambah ke Favorit'" 
                @click="handleWishlist"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  :fill="isWishlisted ? '#ef4444' : 'none'" 
                  viewBox="0 0 24 24" 
                  :stroke="isWishlisted ? '#ef4444' : 'currentColor'" 
                  class="act-icon love-icon"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-4.5-4.5c-1.26 0-2.438.63-3.14 1.636C11.334 6.948 10.156 6.318 8.896 6.318a4.5 4.5 0 00-4.578 0z" />
                </svg>
              </button>

              <button class="chat-action-btn" @click="handleChat">
                <span>Chat</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="act-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>

          </div>
        </div>

      </div>

      <!-- Related Products Section (Rekomendasi) -->
      <div v-if="relatedProducts.length > 0" class="related-section">
        <h3 class="related-title">{{ currentLang === 'id' ? 'PRODUK LAINNYA' : 'YOU MAY ALSO LIKE' }}</h3>
        <div class="related-grid">
          <div 
            v-for="p in relatedProducts" 
            :key="p.id" 
            class="related-card"
            @click="goToProduct(p.id)"
          >
            <div class="rel-img-wrapper">
              <img :src="p.image" :alt="p.name" class="rel-img" />
            </div>
            <div class="rel-info">
              <span class="rel-cat">{{ p.category }}</span>
              <h4 class="rel-name">{{ p.name }}</h4>
              <span class="rel-price">{{ p.price }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

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
                :src="currentProduct?.sizeChartImage || defaultSizeChart" 
                alt="Panduan Ukuran / Size Guide" 
                class="size-guide-img"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.merch-detail-page {
  background-color: #0b0b0b;
  padding: 7rem 0 5rem 0;
  min-height: 100vh;
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

/* Sticky Header Bar when Scrolled - Positioned at top: 80px below Navbar */
.md-sticky-header-bar {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  background-color: #0e0e0e;
  border-bottom: 1px solid #242424;
  z-index: 95;
  padding: 0.75rem 0;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.md-sticky-header-bar.visible {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.md-sticky-container {
  display: grid;
  grid-template-columns: 380px 1fr 340px;
  gap: 2.5rem;
  align-items: center;
}

.md-sticky-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.md-sticky-tabs {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.md-sticky-col3-space {
  width: 100%;
}

/* 3-Column Container */
.md-3col-container {
  display: grid;
  grid-template-columns: 380px 1fr 340px;
  gap: 2.5rem;
  margin-bottom: 4rem;
  align-items: start;
}

/* Column 1: Left Gallery Showcase & md-thumbnails */
.md-col-gallery {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 135px;
  align-self: start;
  z-index: 80;
}

.md-showcase {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #080808;
  border: 1px solid #242424;
  border-radius: 12px;
  overflow: hidden;
  padding: 0;
}

.md-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.md-showcase.zoomed .md-main-image {
  transform: scale(1.6);
  cursor: zoom-out;
}

.md-showcase:not(.zoomed) .md-main-image {
  cursor: zoom-in;
}

.md-zoom-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(18, 18, 18, 0.85);
  border: 1px solid #2a2a2a;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 5;
}

.md-zoom-btn:hover {
  background: #ffffff;
  color: #000000;
}

.md-zoom-icon {
  width: 16px;
  height: 16px;
}

.md-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(18, 18, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 5;
}

.md-nav-btn:hover {
  background: #ffffff;
  color: #000000;
}

.md-nav-btn.prev { left: 0.75rem; }
.md-nav-btn.next { right: 0.75rem; }

.md-arrow-icon {
  width: 16px;
  height: 16px;
}

/* md-thumbnails */
.md-thumbnails {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.md-thumb-btn {
  background: #0d0d0d;
  border: 1px solid #242424;
  width: 64px;
  height: 64px;
  aspect-ratio: 1 / 1;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: all 0.2s ease;
  opacity: 0.65;
}

.md-thumb-btn:hover {
  opacity: 1;
  border-color: #555555;
}

.md-thumb-btn.active {
  opacity: 1;
  border: 2px solid #ffffff;
}

.md-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Column 2: Center Info & Tabs */
.md-col-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-top: 0;
  margin-top: 0;
}

.md-title {
  font-family: var(--font-heading), 'Arial Black', sans-serif;
  font-size: 1.65rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

.md-meta-row {
  margin-top: 0.4rem;
}

.md-sold-count {
  font-size: 0.85rem;
  color: #a3a3a3;
  font-weight: 500;
}

.md-price {
  font-family: var(--font-body), sans-serif;
  font-size: 1.75rem;
  font-weight: 900;
  color: #ffffff;
  margin-top: 0.75rem;
}

.md-divider {
  height: 1px;
  background-color: #242424;
  margin: 1.25rem 0;
  width: 100%;
}

/* Merchant Box */
.md-merchant-box {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.merchant-logo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #333333;
  background-color: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: serif, Georgia, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  font-style: italic;
  color: #ffffff;
}

.merchant-details {
  display: flex;
  flex-direction: column;
}

.merchant-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.merchant-location {
  font-size: 0.8rem;
  color: #888888;
}

/* Size Section */
.md-size-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.md-size-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.md-size-label {
  font-size: 0.875rem;
  color: #a3a3a3;
}

.md-size-val {
  color: #ffffff;
}

.md-size-guide-btn {
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

.md-size-guide-btn:hover {
  color: #ffffff;
}

.ruler-icon {
  width: 14px;
  height: 14px;
  opacity: 0.85;
}

.md-size-chips {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.md-size-chip {
  background: #0c0c0c;
  border: 1px solid #2f2f2f;
  color: #a3a3a3;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.md-size-chip:hover {
  border-color: #ffffff;
  color: #ffffff;
}

.md-size-chip.active {
  border: 2px solid #ffffff;
  background-color: #000000;
  color: #ffffff;
  font-weight: 900;
}

/* Tabs */
.md-tabs-section {
  scroll-margin-top: 155px;
}

.md-tabs-bar {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #242424;
  position: relative;
}

.md-tab-btn {
  background: none;
  border: none;
  position: relative;
  padding: 0.75rem 0.25rem 0.85rem 0.25rem;
  color: #737373;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.25s ease;
}

.md-tab-btn:hover {
  color: #e5e5e5;
}

.md-tab-btn.active {
  color: #ffffff;
  font-weight: 800;
}

.md-tab-btn::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  width: 0;
  height: 3px;
  background-color: #ffffff;
  border-radius: 4px;
  transform: translateX(-50%);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

.md-tab-btn.active::after {
  width: 100%;
}

.md-tab-content {
  padding-top: 1.25rem;
}

.md-desc-text p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #a3a3a3;
  margin: 0;
}

.review-item {
  background: #121212;
  border: 1px solid #242424;
  border-radius: 10px;
  padding: 1rem;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.rev-stars {
  color: #eab308;
  font-size: 0.85rem;
}

.rev-user {
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}

.rev-text {
  font-size: 0.85rem;
  color: #a3a3a3;
  margin: 0;
}

/* Column 3: Right Checkout Card Sticky Stay (Positioned top: 150px so it stays floating cleanly below sticky navbar and header) */
.md-col-checkout {
  position: sticky;
  top: 135px;
  align-self: start;
  z-index: 85;
}

.md-checkout-card {
  background-color: #0e0e0e;
  border: 1px solid #242424;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.checkout-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.checkout-qty-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.md-qty-stepper {
  display: flex;
  align-items: center;
  border: 1px solid #2f2f2f;
  background-color: #080808;
  border-radius: 20px;
  width: fit-content;
  height: 38px;
  overflow: hidden;
}

.md-qty-btn {
  background: none;
  border: none;
  color: #ffffff;
  width: 36px;
  height: 100%;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.md-qty-btn:hover:not(:disabled) {
  background-color: #242424;
}

.md-qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.md-qty-val {
  font-size: 0.9rem;
  font-weight: 800;
  color: #ffffff;
  width: 32px;
  text-align: center;
}

.checkout-stock-text {
  font-size: 0.85rem;
  color: #a3a3a3;
  font-weight: 600;
}

.checkout-subtotal-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
}

.subtotal-label {
  font-size: 0.85rem;
  color: #888888;
}

.subtotal-amount {
  font-size: 1.25rem;
  font-weight: 900;
  color: #ffffff;
}

/* Checkout Buttons - Matching Website Dark Theme */
.checkout-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-add-cart {
  background-color: #ffffff;
  color: #000000;
  border: none;
  border-radius: 24px;
  padding: 0.85rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  width: 100%;
}

.btn-add-cart:hover:not(.btn-disabled) {
  background-color: #f2f2f2;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.25);
}

.btn-buy-now {
  background-color: #121212;
  color: #ffffff;
  border: 1px solid #333333;
  border-radius: 24px;
  padding: 0.85rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-buy-now:hover:not(.btn-disabled) {
  background-color: #1a1a1a;
  border-color: #ffffff;
}

.btn-disabled {
  opacity: 0.4;
  cursor: not-allowed !important;
  transform: none !important;
}

.plus-ic {
  font-size: 1.1rem;
  font-weight: 900;
}

/* Icon Actions */
.checkout-icon-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.icon-action-btn {
  background: #121212;
  border: 1px solid #2f2f2f;
  color: #a3a3a3;
  cursor: pointer;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.icon-action-btn:hover {
  color: #ffffff;
  border-color: #555555;
  background-color: #1a1a1a;
  transform: translateY(-2px);
}

.icon-action-btn.love-btn:hover {
  color: #ef4444;
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.12);
}

.icon-action-btn.love-btn.is-active {
  color: #ef4444;
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.18);
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.4);
  animation: heartPulse 0.35s ease;
}

@keyframes heartPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

.act-icon {
  width: 18px;
  height: 18px;
  transition: all 0.25s ease;
}

.love-btn.is-active .love-icon {
  filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.7));
}

.chat-action-btn {
  background: #121212;
  border: 1px solid #333333;
  border-radius: 20px;
  color: #ffffff;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-action-btn:hover {
  background-color: #1a1a1a;
  border-color: #ffffff;
}

/* Related Products Section */
.related-section {
  margin-top: 3rem;
  scroll-margin-top: 155px;
}

.related-title {
  font-family: var(--font-heading), 'Arial Black', sans-serif;
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: left;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.related-card {
  background-color: #0e0e0e;
  border: 1px solid #242424;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-card:hover {
  transform: translateY(-4px);
  border-color: #444444;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.rel-img-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: #080808;
}

.rel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card:hover .rel-img {
  transform: scale(1.05);
}

.rel-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;
}

.rel-cat {
  font-size: 0.7rem;
  font-weight: 700;
  color: #737373;
  text-transform: uppercase;
}

.rel-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rel-price {
  font-size: 0.9rem;
  font-weight: 800;
  color: #e5e5e5;
  margin-top: 0.25rem;
}

/* Responsive Mobile & Tablet Adjustments */
@media (max-width: 1024px) {
  .md-sticky-header-bar {
    top: 80px;
  }
  .md-sticky-container {
    grid-template-columns: 300px 1fr;
  }
  .md-sticky-col3-space {
    display: none;
  }
  .md-3col-container {
    grid-template-columns: 320px 1fr;
    gap: 2rem;
  }
  .md-col-checkout {
    grid-column: span 2;
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .merch-detail-page {
    padding: 5rem 0 5rem 0;
  }

  .md-sticky-header-bar {
    display: none !important;
  }

  .md-3col-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .md-col-gallery {
    position: relative;
    top: 0;
    z-index: 1;
  }

  .md-col-checkout {
    grid-column: span 1;
    position: relative;
    top: 0;
    z-index: 1;
  }

  .md-showcase {
    border-radius: 10px;
  }

  .md-thumbnails {
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .md-thumb-btn {
    width: 52px;
    height: 52px;
    border-radius: 6px;
  }

  .md-col-info {
    padding-top: 0;
  }

  .md-title {
    font-size: 1.3rem;
    line-height: 1.35;
  }

  .md-price {
    font-size: 1.45rem;
  }

  .md-size-chips {
    gap: 0.5rem;
  }

  .md-size-chip {
    width: 40px;
    height: 40px;
    font-size: 0.8rem;
    border-radius: 6px;
  }

  .md-tabs-section {
    scroll-margin-top: 130px;
  }

  .md-tabs-bar {
    position: sticky;
    top: 70px;
    z-index: 85;
    background-color: #0b0b0b;
    padding-top: 0.6rem;
    padding-bottom: 0.2rem;
    border-bottom: 1px solid #242424;
    gap: 1.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .md-tabs-bar::-webkit-scrollbar {
    display: none;
  }

  .md-tab-btn {
    font-size: 0.85rem;
    white-space: nowrap;
    padding: 0.6rem 0.2rem 0.7rem 0.2rem;
  }

  .md-checkout-card {
    padding: 1.25rem;
    border-radius: 14px;
  }

  .related-section {
    margin-top: 2rem;
  }

  .related-title {
    font-size: 1.1rem;
    margin-bottom: 1.25rem;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
}

/* Size Guide Modal Popup */
.size-guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
}
</style>
