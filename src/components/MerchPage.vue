<script setup>
import { ref, computed, onMounted } from 'vue'
import { t, currentLang } from '../store/lang.js'
import { addItem, decrementItem, getItemQuantity, getVariantQuantity, setCartItemQuantity } from '../store/cart.js'
import { products, fetchProducts } from '../store/apiStore.js'

const activeCategory = ref('all')

const categories = ['all', 'clothing', 'accessories', 'dailyNeeds', 'bundling']

onMounted(() => {
  if (products.value.length === 0) {
    fetchProducts()
  }
})

// Filtered products list
const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return products.value
  }
  const categoryMap = {
    clothing: 'Pakaian',
    accessories: 'Aksesoris',
    dailyNeeds: 'Kebutuhan Harian',
    bundling: 'Bundling'
  }
  const targetCategory = categoryMap[activeCategory.value]
  return products.value.filter(p => p.category === targetCategory)
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

// Modal State
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
  <div class="merch-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <span class="section-tag">{{ t('officialCatalog') }}</span>
        <h1 class="page-title">{{ t('merchandise') }}</h1>
        <p class="page-subtitle">{{ t('catalogDesc') }}</p>
      </div>

      <!-- Categories Filter Tabs -->
      <div class="categories-filter">
        <button 
          v-for="cat in categories" 
          :key="cat" 
          class="filter-tab-btn" 
          :class="{ 'active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ t(cat) }}
        </button>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="product-card"
          @click="openQuickView(product)"
        >
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
            <!-- Quick Add Button -->
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
            <h3 class="product-name">{{ product.name }}</h3>

            <div class="price-row">
              <p class="product-price">{{ product.price }}</p>
            </div>
            
            <div class="product-rating-row">
              <span class="star-icon">⭐</span>
              <span class="rating-val">{{ product.rating || '4.8' }}</span>
              <span class="divider-bullet">•</span>
              <span class="sold-count">{{ product.soldCount || '100+' }} {{ currentLang === 'id' ? 'terjual' : 'sold' }}</span>
            </div>

            <div class="product-location-row">
              <svg class="pin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span class="location-text">{{ product.location || 'Warehouse Kita' }}</span>
            </div>

            <div class="product-card-divider"></div>

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

      <div v-else class="no-products-found">
        <p>{{ currentLang === 'id' ? 'Tidak ada produk ditemukan untuk kategori ini.' : 'No products found for this category.' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.merch-page {
  background-color: var(--bg-primary);
  padding: 8rem 0 6rem 0;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem auto;
}

.section-tag {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.page-title {
  font-family: var(--font-heading), 'Arial Black', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0.5rem 0 1rem 0;
  text-transform: uppercase;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Categories Filter */
.categories-filter {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 3.5rem;
}

.filter-tab-btn {
  background: #141414;
  border: 1px solid #242424;
  color: #a3a3a3;
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab-btn:hover {
  border-color: #ffffff;
  color: #ffffff;
}

.filter-tab-btn.active {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
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

.cart-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

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

.no-products-found {
  padding: 4rem 0;
  text-align: center;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
