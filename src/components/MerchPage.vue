<script setup>
import { ref, computed } from 'vue'
import { t, currentLang } from '../store/lang.js'
import { addItem, decrementItem, getItemQuantity, getVariantQuantity, setCartItemQuantity } from '../store/cart.js'

// Import local image assets
import teeImg from '../assets/images/merch_tee.png'
import hoodieImg from '../assets/images/merch_hoodie.png'
import capImg from '../assets/images/merch_cap.png'
import bagImg from '../assets/images/merch_bag.png'

// Import detail images for gallery
import teeLogoDetail from '../assets/images/tee_detail_logo.png'
import teeLabelDetail from '../assets/images/tee_detail_label.png'
import teeFabricDetail from '../assets/images/tee_detail_fabric.png'

const activeCategory = ref('all')

const categories = ['all', 'clothing', 'accessories', 'dailyNeeds', 'bundling']

// Expanded catalog products
const products = ref([
  {
    id: 1,
    name: 'DRS LOGO TEE',
    price: 'Rp 149.000',
    image: teeImg,
    category: 'Pakaian',
    description: {
      id: 'Kaos resmi Deathrockstar dengan desain logo Track & Bark. Terbuat dari bahan cotton combed 30s yang nyaman dipakai sehari-hari.',
      en: 'Official Deathrockstar t-shirt with Track & Bark logo design. Made from cotton combed 30s fabric for daily comfort.'
    },
    stock: 23,
    label: 'BEST SELLER',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pure Black', hex: '#000000' },
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Dark Grey', hex: '#2C2C2C' }
    ],
    images: [teeImg, teeLogoDetail, teeLabelDetail, teeFabricDetail]
  },
  {
    id: 2,
    name: 'DRS HOODIE',
    price: 'Rp 299.000',
    image: hoodieImg,
    category: 'Pakaian',
    description: {
      id: 'Hoodie pullover Deathrockstar premium dengan cetakan grafis bertekstur di bagian depan dan belakang. Melindungimu dari dinginnya malam.',
      en: 'Premium Deathrockstar pullover hoodie with textured graphic print on the front and back. Keeps you warm during cold nights.'
    },
    stock: 15,
    label: 'PRE-ORDER',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pure Black', hex: '#000000' },
      { name: 'Dark Grey', hex: '#2C2C2C' }
    ],
    images: [hoodieImg, hoodieImg, hoodieImg, hoodieImg]
  },
  {
    id: 3,
    name: 'DRS CAP',
    price: 'Rp 129.000',
    image: capImg,
    category: 'Aksesoris',
    description: {
      id: 'Topi baseball Deathrockstar dengan strap besi yang bisa disesuaikan di bagian belakang. Bordir logo depan bergaya brutalist.',
      en: 'Deathrockstar baseball cap with adjustable metal strap on the back. Features brutalist-style embroidered front logo.'
    },
    stock: 0,
    label: 'SOLD OUT',
    sizes: ['One Size'],
    colors: [{ name: 'Pure Black', hex: '#000000' }],
    images: [capImg, capImg, capImg, capImg]
  },
  {
    id: 4,
    name: 'DRS TOTE BAG',
    price: 'Rp 99.000',
    image: bagImg,
    category: 'Aksesoris',
    description: {
      id: 'Tote bag kanvas tebal dengan desain grafis ikonik. Sangat luas untuk membawa piringan hitam, zine, merch, atau perlengkapan harianmu.',
      en: 'Thick canvas tote bag with iconic graphic design. Very spacious for carrying vinyls, zines, merch, or daily gear.'
    },
    stock: 12,
    label: 'LIMITED',
    sizes: ['One Size'],
    colors: [
      { name: 'Pure Black', hex: '#000000' },
      { name: 'Pure White', hex: '#ffffff' }
    ],
    images: [bagImg, bagImg, bagImg, bagImg]
  },
  {
    id: 5,
    name: 'DRS ZIP HOODIE',
    price: 'Rp 349.000',
    image: hoodieImg,
    category: 'Pakaian',
    description: {
      id: 'Zip-up hoodie premium dengan zipper besi YKK kokoh. Menampilkan print grafis minimalis di bagian dada kiri dan logo besar di punggung.',
      en: 'Premium zip-up hoodie with sturdy YKK metal zipper. Features a minimalist graphic print on the left chest and large back logo.'
    },
    stock: 18,
    label: 'PRE-ORDER',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Pure Black', hex: '#000000' }],
    images: [hoodieImg, hoodieImg]
  },
  {
    id: 6,
    name: 'DRS BEANIE',
    price: 'Rp 119.000',
    image: capImg,
    category: 'Aksesoris',
    description: {
      id: 'Beanie rajut hangat untuk melengkapi gaya grunge scene kamu. Bahan elastis lembut dan tidak gatal.',
      en: 'Warm knit beanie to complete your grunge scene style. Soft elastic material that does not scratch.'
    },
    stock: 20,
    label: 'BEST SELLER',
    sizes: ['One Size'],
    colors: [
      { name: 'Pure Black', hex: '#000000' },
      { name: 'Dark Grey', hex: '#2C2C2C' }
    ],
    images: [capImg]
  },
  {
    id: 7,
    name: 'DRS BARK TEE',
    price: 'Rp 149.000',
    image: teeImg,
    category: 'Pakaian',
    description: {
      id: 'Edisi kaos grafis anjing DRS ikonik. Cetak sablon discharge berkualitas tinggi di atas kain katun combed 30s premium.',
      en: 'Iconic DRS dog graphic tee edition. High-quality discharge screen print on premium cotton combed 30s fabric.'
    },
    stock: 0,
    label: 'SOLD OUT',
    colors: [{ name: 'Pure Black', hex: '#000000' }],
    images: [teeImg, teeLogoDetail]
  },
  {
    id: 8,
    name: 'DRS COFFEE MUG',
    price: 'Rp 79.000',
    image: bagImg,
    category: 'Kebutuhan Harian',
    description: {
      id: 'Mug keramik hitam matte tebal dengan sablon logo Deathrockstar. Cocok untuk kopi pagi sebelum mendengarkan piringan hitam favorit.',
      en: 'Thick matte black ceramic mug with Deathrockstar logo screen print. Perfect for morning coffee before vinyl sessions.'
    },
    stock: 30,
    label: 'LIMITED',
    sizes: ['One Size'],
    colors: [{ name: 'Matte Black', hex: '#1C1C1C' }],
    images: [bagImg]
  },
  {
    id: 9,
    name: 'DRS STICKER PACK',
    price: 'Rp 29.000',
    image: capImg,
    category: 'Aksesoris',
    description: {
      id: 'Satu pak berisi 8 stiker vinyl tahan air dengan berbagai macam logo dan artwork Deathrockstar. Tempel di laptop, gitar, atau helm.',
      en: 'A pack containing 8 waterproof vinyl stickers with various Deathrockstar logos and artworks. Paste on laptops, guitars, or helmets.'
    },
    stock: 50,
    label: 'BEST SELLER',
    sizes: ['One Size'],
    colors: [{ name: 'Multi-Color', hex: '#ffffff' }],
    images: [capImg]
  },
  {
    id: 10,
    name: 'DRS SOCKS PACK',
    price: 'Rp 49.000',
    image: bagImg,
    category: 'Aksesoris',
    description: {
      id: 'Kaos kaki rajut sporty katun tebal dengan rajutan logo DRS di sisi kanan dan kiri. Nyaman untuk dipakai moshpit.',
      en: 'Sporty knit thick cotton socks with DRS logo knitted on both sides. Comfortable for moshpits.'
    },
    stock: 40,
    label: 'LIMITED',
    sizes: ['One Size'],
    colors: [
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Pure Black', hex: '#000000' }
    ],
    images: [bagImg]
  },
  {
    id: 11,
    name: 'DRS STARTER BUNDLE',
    price: 'Rp 199.000',
    image: bagImg,
    category: 'Bundling',
    description: {
      id: 'Paket hemat starter pack berisi 1 DRS Tote Bag + 1 DRS Coffee Mug + 1 DRS Sticker Pack. Pilihan tepat untuk merchandise kolektif.',
      en: 'Value starter pack containing 1 DRS Tote Bag + 1 DRS Coffee Mug + 1 DRS Sticker Pack. Great choice for collective merch.'
    },
    stock: 10,
    label: 'LIMITED',
    sizes: ['One Size'],
    colors: [{ name: 'Pure Black', hex: '#000000' }],
    images: [bagImg]
  },
  {
    id: 12,
    name: 'DRS COMPLETE BUNDLE',
    price: 'Rp 499.000',
    image: hoodieImg,
    category: 'Bundling',
    description: {
      id: 'Bundling lengkap paling dicari: 1 DRS Logo Tee + 1 DRS Hoodie + 1 DRS Cap + 1 DRS Tote Bag. Paket lengkap scene rockstar sejati.',
      en: 'The most sought-after bundle: 1 DRS Logo Tee + 1 DRS Hoodie + 1 DRS Cap + 1 DRS Tote Bag. Complete package for a true scene rockstar.'
    },
    stock: 5,
    label: 'PRE-ORDER',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Pure Black', hex: '#000000' }],
    images: [hoodieImg, teeImg, capImg, bagImg]
  }
])

// Filtered products list
const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return products.value
  }
  const categoryMapping = {
    clothing: 'Pakaian',
    accessories: 'Aksesoris',
    dailyNeeds: 'Kebutuhan Harian',
    bundling: 'Bundling'
  }
  const targetCat = categoryMapping[activeCategory.value]
  return products.value.filter(p => p.category === targetCat)
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
const selectedColor = ref('')
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
  alert(currentLang.value === 'id' 
    ? `Menghubungi manajer toko mengenai ${selectedProduct.value.name}...` 
    : `Connecting to store manager about ${selectedProduct.value.name}...`)
}

const openSizeGuide = () => {
  alert(currentLang.value === 'id' 
    ? `Panduan Ukuran:\nS: 47 x 67 cm\nM: 50 x 70 cm\nL: 53 x 73 cm\nXL: 56 x 75 cm\nXXL: 59 x 77 cm` 
    : `Size Guide:\nS: 47 x 67 cm\nM: 50 x 70 cm\nL: 53 x 73 cm\nXL: 56 x 75 cm\nXXL: 59 x 77 cm`)
}
</script>

<template>
  <div class="merch-page">
    <div class="container">
      <!-- Section Header -->
      <div class="page-header">
        <span class="page-tag">{{ t('merch') }}</span>
        <h1 class="page-title">{{ t('merchCatalogTitle') }}</h1>
        <p class="page-subtitle">{{ t('merchCatalogSubtitle') }}</p>
      </div>

      <!-- Category Filter Buttons -->
      <div class="filter-wrapper">
        <div class="filter-container">
          <button 
            v-for="cat in categories" 
            :key="cat" 
            class="filter-btn"
            :class="{ 'active': activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ t(cat) }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card" @click="openQuickView(product)">
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
            <div class="product-overlay">
              <button 
                class="quick-add-btn" 
                :class="{ 'disabled-btn': product.stock <= 0 }"
                :disabled="product.stock <= 0"
                @click.stop="addItem(product)"
              >
                <span>{{ product.stock > 0 ? t('quickAdd') : t('soldOut') }}</span>
                <svg v-if="product.stock > 0" class="plus-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
 
          <!-- Product Details -->
          <div class="product-details">
            <h3 class="product-name">{{ product.name }}</h3>

            <div class="price-row">
              <p class="product-price">{{ product.price }}</p>
            </div>
            
            <!-- Quantity controls -->
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
                  :disabled="product.stock <= 0 || getItemQuantity(product.id) >= product.stock"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qty-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Divider Line -->
            <div class="product-divider"></div>

            <!-- Creator Section -->
            <div class="product-details-bottom">
              <div class="partner-store">
                <img src="/logo_mocca.png" alt="Mocca Logo" class="partner-logo" />
                <div class="partner-info">
                  <span class="partner-label">{{ t('partnerStore') }}</span>
                  <span class="partner-name">mocca</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Products Found State -->
      <div v-if="filteredProducts.length === 0" class="no-products">
        <p>{{ t('noProducts') }}</p>
      </div>
    </div>

    <!-- Quick View Overlay Modal -->
    <transition name="fade">
      <div v-if="selectedProduct" class="qv-overlay" @click.self="closeQuickView">
        <div class="qv-modal">
          <button class="qv-close-btn" @click="closeQuickView" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qv-close-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="qv-content">
            <!-- Left Column: Media Gallery -->
            <div class="qv-gallery">
              <div class="qv-showcase" :class="{ 'zoomed': isZoomed }">
                <img :src="selectedProduct.images[activeImgIndex]" :alt="selectedProduct.name" class="qv-main-image" @click="isZoomed = !isZoomed" />
                
                <button class="qv-zoom-btn" @click.stop="isZoomed = !isZoomed" :aria-label="isZoomed ? 'Zoom out' : 'Zoom in'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="qv-zoom-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

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

              <!-- Thumbnails -->
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
              <div class="qv-info-header">
                <span class="qv-tag">DEATHROCKSTAR (DRS) MART</span>
                <h2 class="qv-title">{{ selectedProduct.name }}</h2>
                <div class="qv-rating-row">
                  <div class="qv-stars">
                    <span v-for="star in 5" :key="star" class="qv-star">★</span>
                  </div>
                  <span class="qv-reviews">(12 {{ currentLang === 'id' ? 'Ulasan' : 'Reviews' }})</span>
                </div>
                <p class="qv-price">{{ selectedProduct.price }}</p>

                <!-- Description -->
                <p class="qv-body-text qv-header-desc">{{ selectedProduct.description[currentLang] || selectedProduct.description }}</p>
              </div>

              <div class="qv-variants">
                <!-- Size Selector -->
                <div v-if="selectedProduct.sizes && selectedProduct.sizes.length > 0 && selectedProduct.sizes[0] !== 'One Size'" class="qv-variant-group">
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

                <!-- Color Selector -->
                <div v-if="selectedProduct.colors && selectedProduct.colors.length > 0" class="qv-variant-group">
                  <h4 class="qv-section-title">{{ t('color') }}</h4>
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
                  <h4 class="qv-section-title">{{ t('quantity') }}</h4>
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
                        {{ selectedProduct.stock > 0 ? `${t('availableStock')} (${selectedProduct.stock})` : t('outOfStock') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
                  <span>{{ selectedProduct.stock > 0 ? t('addToCart') : t('soldOut') }}</span>
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
              <span>{{ selectedProduct.stock > 0 ? t('addToCart') : t('soldOut') }}</span>
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
  </div>
</template>

<style scoped>
.merch-page {
  background-color: #0e0e0e;
  padding: 8rem 0 8rem 0;
  min-height: 100vh;
}

.page-header {
  text-align: left;
  margin-bottom: 3.5rem;
}

.page-tag {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  display: block;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1;
  color: #FFFFFF;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
}

/* Category Filter Styling */
.filter-wrapper {
  margin-bottom: 3rem;
  width: 100%;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: transparent;
  color: var(--text-secondary);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.filter-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.3);
}

.filter-btn.active {
  background-color: #FFFFFF;
  color: #121212;
  border-color: #FFFFFF;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

/* Product Card */
.product-card {
  display: flex;
  flex-direction: column;
  background-color: #1E1E1E;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.product-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  transition: all 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #FFFFFF;
  color: #121212;
  padding: 0.75rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  transform: translateY(15px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover .quick-add-btn {
  transform: translateY(0);
}

.quick-add-btn:hover {
  background-color: #e5e5e5;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.quick-add-btn:disabled,
.quick-add-btn.disabled-btn {
  background-color: #333333 !important;
  color: #888888 !important;
  cursor: not-allowed !important;
  border-color: #444444 !important;
  box-shadow: none !important;
  transform: translateY(0) !important;
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
  color: #FFFFFF;
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
  border: 1px solid rgba(255, 255, 255, 0.05);
  background-color: #151515;
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  background: none;
  border: none;
  color: #FFFFFF;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qty-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
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
  background-color: rgba(255, 255, 255, 0.05);
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
  width: 48px;
  height: 48px;
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
  font-size: 1rem;
  font-weight: 740;
  color: #FFFFFF;
  line-height: 1.2;
  text-transform: lowercase;
}

.no-products {
  padding: 4rem 0;
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* ========================================== */
/* QUICK VIEW MODAL STYLING (COPY FROM SECT)  */
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

.qv-modal {
  position: relative;
  width: 100%;
  max-width: 1024px;
  max-height: 90vh;
  background-color: #121212;
  border: 1px solid #2C2C2C;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  overflow: hidden;
}

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
  transition: all 0.2s ease;
}

.qv-close-btn:hover {
  color: #ffffff;
}

.qv-close-icon {
  width: 24px;
  height: 24px;
}

.qv-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: 100%;
}

.qv-gallery {
  width: 50%;
  border-right: 1px solid #2C2C2C;
  display: flex;
  flex-direction: column;
  background-color: #0b0b0b;
}

.qv-showcase {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.qv-main-image {
  max-width: 100%;
  max-height: 450px;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: zoom-in;
}

.qv-showcase.zoomed .qv-main-image {
  transform: scale(1.5);
  cursor: zoom-out;
}

.qv-zoom-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid #333;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qv-zoom-btn:hover {
  background-color: #fff;
  color: #000;
}

.qv-zoom-icon {
  width: 16px;
  height: 16px;
}

.qv-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid #333;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qv-nav-btn:hover {
  background-color: #fff;
  color: #000;
}

.qv-nav-btn.prev {
  left: 1rem;
}

.qv-nav-btn.next {
  right: 1rem;
}

.qv-arrow-icon {
  width: 16px;
  height: 16px;
}

.qv-thumbnails {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #2C2C2C;
  overflow-x: auto;
}

.qv-thumb-btn {
  width: 60px;
  height: 60px;
  border: 1px solid #2C2C2C;
  padding: 2px;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qv-thumb-btn.active, .qv-thumb-btn:hover {
  border-color: #fff;
}

.qv-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qv-info {
  width: 50%;
  padding: 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: left;
}

.qv-info-header {
  border-bottom: 1px solid #2C2C2C;
  padding-bottom: 1.5rem;
}

.qv-tag {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.qv-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0.5rem 0;
  color: #fff;
  line-height: 1.1;
}

.qv-rating-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.qv-stars {
  color: #ffcc00;
  font-size: 0.9rem;
}

.qv-reviews {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.qv-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.qv-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.qv-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.qv-body-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
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

.qv-variants {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.qv-variant-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.qv-size-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.qv-size-chip {
  padding: 0.5rem 1rem;
  border: 1px solid #333;
  background: none;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 48px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.qv-size-chip:hover {
  border-color: #ffffff;
  color: #fff;
}

.qv-size-chip.active {
  background-color: #000;
  color: #fff;
  border: 2px solid #ffffff;
}

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
  position: relative;
  transition: all 0.2s ease;
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

.qv-qty-stepper {
  display: flex;
  align-items: center;
  border: 1px solid #333;
  width: fit-content;
}

.qv-qty-btn {
  background: none;
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qv-qty-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
}

.qv-qty-btn:disabled {
  opacity: 0.3;
}

.qv-qty-val {
  width: 36px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.qv-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.qv-btn-primary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: #fff;
  color: #000;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qv-btn-primary:hover {
  background-color: #e5e5e5;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  border: 1px solid #333;
  color: #fff;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qv-btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: #fff;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.mobile-actions {
  display: none;
}

/* Responsive Media Queries */
@media (max-width: 1023px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .qv-overlay {
    padding: 1rem;
  }
  
  .qv-modal {
    max-height: 95vh;
  }
  
  .qv-content {
    flex-direction: column;
    overflow-y: auto;
  }
  
  .qv-gallery, .qv-info {
    width: 100%;
    border-right: none;
  }
  
  .qv-info {
    padding: 2rem;
    overflow-y: visible;
  }
  
  .desktop-actions {
    display: none;
  }
  
  .mobile-actions {
    display: flex;
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #121212;
    padding: 0.75rem 1rem;
    border-top: 1px solid #2C2C2C;
    z-index: 5;
  }

  .mobile-actions .qv-btn-primary {
    padding: 0.75rem 1.25rem;
    font-size: 0.75rem;
  }

  .mobile-actions .qv-btn-secondary {
    padding: 0.75rem 1.25rem;
    font-size: 0.75rem;
    width: auto;
    flex: 0 0 auto;
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

@media (max-width: 767px) {
  .merch-page {
    padding: 6rem 0 6rem 0;
  }
  
  .page-title {
    margin-bottom: 0.5rem;
  }
  
  .page-subtitle {
    font-size: 0.95rem;
  }
  
  /* Horizontal scroll categories on mobile */
  .filter-wrapper {
    margin-bottom: 2rem;
    overflow: hidden;
  }
  
  .filter-container {
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 0.5rem;
    padding-bottom: 0.75rem;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }
  
  .filter-container::-webkit-scrollbar {
    display: none; /* Hide scrollbar on Safari/Chrome */
  }
  
  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    border-radius: 6px;
    flex-shrink: 0;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
