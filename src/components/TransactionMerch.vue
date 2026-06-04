<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { t, currentLang } from '../store/lang.js'
import { cartItems, totalCartPrice, formatPrice, totalItemsCount } from '../store/cart.js'

const GOOGLE_MAPS_API_KEY = "AIzaSyBxZekg89Ut1U72fFpQldJAenvgTy197As"
const GOOGLE_MAPS_MAP_ID = "795838f77e7bb079c78f5aac"

// --- Global Form States ---
const isMobileSummaryExpanded = ref(false)

const buyerForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  countryCode: '+62'
})

// Will hold the finalized address data after modal finishes
const savedAddress = ref(null)

const originData = reactive({
  latitude: null,
  longitude: null,
  postal_code: null,
  store_location_id: null,
  admin_fee: 0,
  weight: 0
})

const shippingFee = ref(0)
const shippingOptions = ref([])
const selectedShipping = ref(null)
const isLoadingShipping = ref(false)

const mainErrors = reactive({
  buyerName: '',
  buyerEmail: '',
  buyerPhone: '',
  address: ''
})

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// --- Address Modal States ---
const isAddressModalOpen = ref(false)
const addressStep = ref(1) // 1: Autogeolocation, 2: Pinpoint Maps, 3: Detail Alamat Form
const mapContainer = ref(null)
let mapInstance = null
let markerInstance = null

const searchInputRef = ref(null)
let autocompleteInstance = null

const addressForm = reactive({
  address_name: 'Rumah',
  nama_penerima: '',
  phone: '',
  province_id: '',
  city_id: '',
  zipcode: '',
  address_detail: '',
  latitude: -6.200000,
  longitude: 106.816666
})

const addressErrors = reactive({
  nama_penerima: '',
  phone: '',
  province_id: '',
  city_id: '',
  zipcode: '',
  address_detail: ''
})

const provinces = ref([])
const cities = ref([])

const searchProvinceQuery = ref('')
const showProvinceDropdown = ref(false)

const searchCityQuery = ref('')
const showCityDropdown = ref(false)

const filteredProvinces = computed(() => {
  if (!searchProvinceQuery.value) return provinces.value
  const q = searchProvinceQuery.value.toLowerCase()
  return provinces.value.filter(p => {
    const n = p.province || p.name || p.province_name || ''
    return n.toLowerCase().includes(q)
  })
})

const filteredCities = computed(() => {
  if (!searchCityQuery.value) return cities.value
  const q = searchCityQuery.value.toLowerCase()
  return cities.value.filter(c => {
    const n = (c.type ? c.type + ' ' : '') + (c.city || c.name || c.city_name || '')
    return n.toLowerCase().includes(q)
  })
})

const selectProvince = (prov) => {
  addressForm.province_id = prov.id || prov.province_id
  searchProvinceQuery.value = prov.province || prov.name || prov.province_name
  showProvinceDropdown.value = false
}

const selectCity = (city) => {
  addressForm.city_id = city.id || city.city_id
  searchCityQuery.value = (city.type ? city.type + ' ' : '') + (city.city || city.name || city.city_name || '')
  showCityDropdown.value = false
}

// --- API Fetchers ---
const fetchOriginData = async () => {
  if (cartItems.value.length === 0) return
  const firstItem = cartItems.value[0]
  if (firstItem && firstItem.slug) {
    try {
      const response = await fetch(`https://api.kolektix.my.id/api/product/${firstItem.slug}`)
      const result = await response.json()
      if (result.data) {
        originData.admin_fee = result.data.admin_fee || 0
        originData.weight = Number(result.data.weight)
        if (result.data.store_location) {
          originData.latitude = result.data.store_location.latitude
          originData.longitude = result.data.store_location.longitude
          originData.postal_code = result.data.store_location.postal_code
          originData.store_location_id = result.data.store_location.id
        }
      }
    } catch (e) {
      console.error('Failed to fetch origin data', e)
    }
  }
}

const fetchProvinces = async () => {
  try {
    const res = await fetch('https://api.kolektix.my.id/api/province')
    const result = await res.json()
    if (result.data) {
      provinces.value = result.data
    }
  } catch (e) {
    console.error('Failed to fetch provinces', e)
  }
}

const fetchCities = async (provId) => {
  if (!provId) {
    cities.value = []
    return
  }
  try {
    const res = await fetch(`https://api.kolektix.my.id/api/city?province_id=${provId}`)
    const result = await res.json()
    if (result.data) {
      cities.value = result.data
    }
  } catch (e) {
    console.error('Failed to fetch cities', e)
  }
}

watch(() => addressForm.province_id, (newVal) => {
  if (newVal) {
    addressForm.city_id = ''
    searchCityQuery.value = ''
    fetchCities(newVal)
  }
})

// --- Modal Actions ---
const openAddressModal = () => {
  isAddressModalOpen.value = true
  addressStep.value = 1
  fetchProvinces()

  setTimeout(initMap, 200)
}

const closeAddressModal = () => {
  isAddressModalOpen.value = false
}

const useCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        addressForm.latitude = position.coords.latitude
        addressForm.longitude = position.coords.longitude
        goToStep2()
      },
      (error) => {
        console.warn('Geolocation blocked/failed, defaulting to Jakarta center', error)
        goToStep2()
      }
    )
  } else {
    goToStep2()
  }
}

const goToStep2 = () => {
  addressStep.value = 2
  setTimeout(initMap, 200)
}

const goToStep3 = () => {
  if (markerInstance) {
    const pos = markerInstance.getPosition()
    addressForm.latitude = pos.lat()
    addressForm.longitude = pos.lng()
  }
  addressStep.value = 3
}

const goBackToStep1 = () => {
  addressStep.value = 1
  setTimeout(initMap, 200)
}

// --- Maps Logic ---
const initMap = () => {
  if (!window.google) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapLib`
    script.async = true
    script.defer = true
    window.initGoogleMapLib = () => {
      if (addressStep.value === 2) renderMap()
      if (addressStep.value === 1) initAutocomplete()
    }
    document.head.appendChild(script)
  } else {
    if (addressStep.value === 2) renderMap()
    if (addressStep.value === 1) initAutocomplete()
  }
}

const initAutocomplete = () => {
  if (searchInputRef.value && window.google && window.google.maps.places) {
    autocompleteInstance = new window.google.maps.places.Autocomplete(searchInputRef.value, {
      fields: ['geometry', 'name', 'formatted_address']
    });
    
    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }
      
      addressForm.latitude = place.geometry.location.lat();
      addressForm.longitude = place.geometry.location.lng();
      addressForm.address_detail = place.formatted_address || place.name;
      
      goToStep2();
    });
  }
}

const renderMap = () => {
  if (mapContainer.value) {
    const center = { lat: addressForm.latitude, lng: addressForm.longitude }
    mapInstance = new window.google.maps.Map(mapContainer.value, {
      center,
      zoom: 16,
      mapId: GOOGLE_MAPS_MAP_ID,
      disableDefaultUI: true,
      zoomControl: true
    })
    
    markerInstance = new window.google.maps.Marker({
      position: center,
      map: mapInstance,
      draggable: true
    })

    window.google.maps.event.addListener(markerInstance, 'dragend', () => {
      const pos = markerInstance.getPosition()
      addressForm.latitude = pos.lat()
      addressForm.longitude = pos.lng()
    })
  }
}

// --- Finalize Address ---
const saveAddress = () => {
  // Reset errors
  Object.keys(addressErrors).forEach(k => addressErrors[k] = '')
  let hasError = false
  
  if (!addressForm.nama_penerima.trim()) { addressErrors.nama_penerima = 'Wajib diisi'; hasError = true }
  if (!addressForm.phone.trim()) { addressErrors.phone = 'Wajib diisi'; hasError = true }
  if (!addressForm.province_id) { addressErrors.province_id = 'Pilih provinsi'; hasError = true }
  if (!addressForm.city_id) { addressErrors.city_id = 'Pilih kota'; hasError = true }
  if (!addressForm.zipcode.trim()) { addressErrors.zipcode = 'Wajib diisi'; hasError = true }
  if (!addressForm.address_detail.trim()) { addressErrors.address_detail = 'Wajib diisi'; hasError = true }

  if (hasError) return

  savedAddress.value = { ...addressForm }
  closeAddressModal()
  mainErrors.address = ''

  checkShippingCosts()
}

const checkShippingCosts = async () => {
  if (!savedAddress.value) return
  
  
  isLoadingShipping.value = true
  shippingOptions.value = []
  isSubmitting.value = false
  
  const payload = {
    origin_postal_code: originData.postal_code || "16511",
    destination_postal_code: savedAddress.value.zipcode,
    origin_latitude: originData.latitude || -6.40618147570509,
    origin_longitude: originData.longitude || 106.7689288865081,
    destination_latitude: savedAddress.value.latitude,
    destination_longitude: savedAddress.value.longitude,
    weight: cartItems.value.reduce((acc, item) => acc + (Number(item.weight) * item.quantity), 0)
  }
  
  try {
    const res = await fetch('https://api.kolektix.my.id/api/shipping/cek-all-ongkir', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const result = await res.json()
    
    let dataArr = []
    if (result.rates && result.rates.regular) {
      dataArr = result.rates.regular
    }
    
    if (dataArr.length > 0) {
      shippingOptions.value = dataArr
      selectedShipping.value = dataArr[0]
      updateShippingFee()
    }
  } catch(e) {
    console.error('Failed to check shipping', e)
  } finally {
    isLoadingShipping.value = false
  }
}

const updateShippingFee = () => {
  if (selectedShipping.value) {
    shippingFee.value = selectedShipping.value.price || selectedShipping.value.cost || 0
  } else {
    shippingFee.value = 0
  }
}


// --- Checkout Calculations & Submit ---
const totalAdminFee = computed(() => {
  return originData.admin_fee || 2000
})

const grandTotal = computed(() => {
  return totalCartPrice.value + totalAdminFee.value + shippingFee.value
})

const goBack = () => {
  window.location.hash = '#merch-page'
}

const isSubmitting = ref(false)

const handleCheckoutSubmit = async () => {
  // Reset main errors
  mainErrors.buyerName = ''
  mainErrors.buyerEmail = ''
  mainErrors.buyerPhone = ''
  mainErrors.address = ''

  let hasError = false
  if (!buyerForm.fullName.trim()) { mainErrors.buyerName = 'Nama lengkap wajib diisi'; hasError = true }
  if (!buyerForm.email.trim() || !isValidEmail(buyerForm.email)) { mainErrors.buyerEmail = 'Email tidak valid'; hasError = true }
  if (!buyerForm.phone.trim()) { mainErrors.buyerPhone = 'No Telepon wajib diisi'; hasError = true }
  
  if (!savedAddress.value) {
    mainErrors.address = 'Anda belum memilih alamat pengiriman'
    hasError = true
  }

  if (hasError) {
    alert('Silakan periksa kembali formulir Anda.')
    return
  }

  const addr = savedAddress.value

  const payload = {
    user_id: null,
    name_pemesan: buyerForm.fullName,
    email_pemesan: buyerForm.email,
    phone_pemesan: buyerForm.phone,
    creator_id: null,
    total_price: totalCartPrice.value,
    grandtotal: grandTotal.value,
    admin_fee: totalAdminFee.value,
    discount: 0,
    product: cartItems.value.map(item => ({
      product_id: item.product_id,
      qty: item.quantity,
      price: item.priceNum,
      weight: Number(item.weight),
      admin_fee: item.admin_fee || 0,
      order_notes: "",
      variant_id: item.variant_id
    })),
    is_pickup_instore: 0,
    is_delivery: 1,
    payment_method: "xendit",
    payment_method_id: 4,
    courier: {
        main: selectedShipping.value?.name || selectedShipping.value?.courier_name || selectedShipping.value?.courier || "Pos Indonesia",
        type: selectedShipping.value?.type || selectedShipping.value?.service || selectedShipping.value?.service_type || "Pos Reguler",
        courier_company: selectedShipping.value?.courier_company || selectedShipping.value?.courier || "pos indonesia",
        courier_type: selectedShipping.value?.courier_type || selectedShipping.value?.service || "reg",
        origin_contact_name: "DRS Store",
        origin_contact_phone: "081234567890",
        origin_address: "Origin Store Address",
        origin_postal_code: originData.postal_code || "16511",
        destination_postal_code: addr.zipcode,
        origin_latitude: originData.latitude || -6.40618147570509,
        origin_longitude: originData.longitude || 106.7689288865081,
        destination_latitude: addr.latitude,
        destination_longitude: addr.longitude,
        name: addr.nama_penerima,
        phone: addr.phone,
        address: addr.address_detail,
        weight: cartItems.value.reduce((acc, item) => acc + (Number(item.weight) * item.quantity), 0),
        price: shippingFee.value
    },
    address: {
        user_id: null,
        is_main_address: 1,
        province_id: addr.province_id,
        city_id: addr.city_id,
        address_detail: addr.address_detail,
        address_name: addr.address_name,
        zipcode: addr.zipcode,
        latitude: String(addr.latitude),
        longitude: String(addr.longitude),
        nama_penerima: addr.nama_penerima,
        phone: addr.phone,
        is_active: 1
    },
    success_redirect_url: "https://store.deelestari.com/merch-invoice/{invoice_merch}",
    failure_redirect_url: "https://store.deelestari.com/checkout",
    is_microsite: 1,
    microsite_url: "https://store.deelestari.com"
  }

  console.log("PAYLOAD SUBMIT:", payload)

  isSubmitting.value = true
  try {
    const res = await fetch('https://api.kolektix.my.id/api/transaction-merch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const result = await res.json()
    
    if (res.ok && result.data && result.data.xendit_url) {
      alert(currentLang.value === 'id' ? 'Pesanan berhasil dibuat! Anda akan dialihkan ke pembayaran.' : 'Order created! Redirecting to payment.')
      cartItems.value = [] // clear cart
      window.location.href = result.data.xendit_url
    } else if (result.xendit_url) {
      alert(currentLang.value === 'id' ? 'Pesanan berhasil dibuat! Anda akan dialihkan ke pembayaran.' : 'Order created! Redirecting to payment.')
      cartItems.value = [] // clear cart
      window.location.href = result.xendit_url
    } else {
      console.error('Submission failed:', result)
      alert(currentLang.value === 'id' ? 'Gagal membuat pesanan: ' + (result.message || 'Terjadi kesalahan') : 'Failed to create order: ' + (result.message || 'An error occurred'))
    }
  } catch (error) {
    console.error('Checkout error:', error)
    alert(currentLang.value === 'id' ? 'Terjadi kesalahan saat memproses pesanan Anda.' : 'An error occurred while processing your order.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (cartItems.value.length === 0) {
    window.location.hash = '#merch-page'
  }
  fetchOriginData()
})

</script>

<template>
  <div class="transaction-checkout-page">
    <div class="container checkout-container">
      
      <!-- Back Navigation -->
      <div class="back-navigation-row">
        <button class="btn-back-link" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="back-icon-svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ currentLang === 'id' ? 'Kembali' : 'Back' }}</span>
        </button>
      </div>

      <div class="checkout-layout-grid">
        
        <!-- Left Column: Forms -->
        <div class="checkout-forms-column">
          <h1 class="main-checkout-title">
            {{ currentLang === 'id' ? 'Checkout Merchandise' : 'Merchandise Checkout' }}
          </h1>

          <!-- Mobile Summary -->
          <div class="mobile-summary-collapse-card">
            <div class="summary-collapse-header" @click="isMobileSummaryExpanded = !isMobileSummaryExpanded">
              <div class="collapse-header-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="summary-bag-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span class="collapse-title-text">{{ currentLang === 'id' ? 'Lihat Ringkasan Pesanan' : 'View Order Summary' }}</span>
                <span class="mobile-total-badge">{{ formatPrice(grandTotal) }}</span>
              </div>
              <svg class="chevron-collapse-icon" :class="{ rotated: isMobileSummaryExpanded }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            
            <transition name="accordion-slide">
              <div v-show="isMobileSummaryExpanded" class="mobile-summary-collapse-content">
                <div class="mobile-summary-inner">
                  <div v-for="item in cartItems" :key="item.id" class="mobile-price-row">
                    <span class="mobile-price-lbl">{{ item.name }} x{{ item.quantity }}</span>
                    <span class="mobile-price-val">{{ formatPrice(item.priceNum * item.quantity) }}</span>
                  </div>
                  <div class="mobile-price-row">
                    <span class="mobile-price-lbl">Ongkos Kirim</span>
                    <span class="mobile-price-val">{{ formatPrice(shippingFee) }}</span>
                  </div>
                  <div class="mobile-price-row">
                    <span class="mobile-price-lbl">Biaya Admin</span>
                    <span class="mobile-price-val">{{ formatPrice(totalAdminFee) }}</span>
                  </div>
                  <div class="mobile-price-divider"></div>
                  <div class="mobile-price-row total">
                    <span class="mobile-price-lbl">Total Pembayaran</span>
                    <span class="mobile-price-val">{{ formatPrice(grandTotal) }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Data Pemesan -->
          <div class="accordion-card is-expanded">
            <div class="accordion-header">
              <div class="header-left-title-box">
                <span class="accordion-card-title">Data Pemesan</span>
              </div>
            </div>
            <div class="accordion-body">
              <div class="form-fields-wrapper">
                <div class="form-group" :class="{ 'has-error': mainErrors.buyerName }">
                  <label class="form-field-label">Nama Lengkap Pemesan</label>
                  <input type="text" v-model="buyerForm.fullName" placeholder="Nama Lengkap" class="checkout-text-input" />
                  <span v-if="mainErrors.buyerName" class="error-message">{{ mainErrors.buyerName }}</span>
                </div>

                <div class="form-group" :class="{ 'has-error': mainErrors.buyerEmail }">
                  <label class="form-field-label">Email Pemesan</label>
                  <input type="email" v-model="buyerForm.email" placeholder="example@example.com" class="checkout-text-input" />
                  <span v-if="mainErrors.buyerEmail" class="error-message">{{ mainErrors.buyerEmail }}</span>
                </div>

                <div class="form-group" :class="{ 'has-error': mainErrors.buyerPhone }">
                  <label class="form-field-label">No Telepon Pemesan</label>
                  <div class="phone-input-group">
                    <div class="country-dropdown-wrapper">
                      <button class="btn-prefix-dropdown">
                        <span>{{ buyerForm.countryCode }}</span>
                      </button>
                    </div>
                    <input type="tel" v-model="buyerForm.phone" placeholder="81234567890" class="checkout-phone-input" />
                  </div>
                  <span v-if="mainErrors.buyerPhone" class="error-message">{{ mainErrors.buyerPhone }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Alamat Pengiriman -->
          <div class="accordion-card is-expanded">
            <div class="accordion-header">
              <div class="header-left-title-box">
                <span class="accordion-card-title">Alamat Pengiriman</span>
              </div>
            </div>
            <div class="accordion-body">
              <div v-if="savedAddress" class="saved-address-box">
                <div class="address-tag">{{ savedAddress.address_name }}</div>
                <h4 class="address-name">{{ savedAddress.nama_penerima }} ({{ savedAddress.phone }})</h4>
                <p class="address-desc">{{ savedAddress.address_detail }}, Kode Pos: {{ savedAddress.zipcode }}</p>
                <button class="btn-secondary mt-4 mb-4" @click="openAddressModal">Ubah Alamat</button>

                <div class="shipping-method-section pt-4" style="border-top: 1px solid rgba(255,255,255,0.1)">
                  <h4 class="form-field-label mb-2">Pilih Kurir Pengiriman</h4>
                  <div v-if="isLoadingShipping" class="text-gray-400 text-sm">Sedang menghitung ongkos kirim...</div>
                  <div v-else-if="shippingOptions.length > 0">
                    <select v-model="selectedShipping" @change="updateShippingFee" class="checkout-select-input">
                      <option v-for="(opt, idx) in shippingOptions" :key="idx" :value="opt">
                        {{ opt.name || opt.courier_name || opt.courier || opt.company }} {{ opt.service || opt.type || '' }} - {{ formatPrice(opt.price || opt.cost || 0) }}
                      </option>
                    </select>
                  </div>
                  <div v-else class="text-red-400 text-sm">Metode pengiriman tidak tersedia.</div>
                </div>
              </div>
              <div v-else class="no-address-box">
                <p class="text-gray-400 mb-4">Anda belum memasukkan alamat pengiriman.</p>
                <button class="btn-primary" @click="openAddressModal">+ Tambah Alamat Pengiriman</button>
                <span v-if="mainErrors.address" class="error-message block mt-2">{{ mainErrors.address }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Summary (Desktop) -->
        <div class="checkout-summary-column desktop-summary-only">
          <div class="order-summary-card">
            <h3 class="summary-card-title">Ringkasan Pesanan</h3>
            
            <div class="summary-items-scroll">
              <div v-for="item in cartItems" :key="item.id" class="summary-item-row">
                <div class="sum-item-img-box">
                  <img :src="item.image" :alt="item.name" />
                </div>
                <div class="sum-item-info">
                  <span class="sum-item-name">{{ item.name }}</span>
                  <span class="sum-item-qty">Qty: {{ item.quantity }}</span>
                </div>
                <div class="sum-item-price">
                  {{ formatPrice(item.priceNum * item.quantity) }}
                </div>
              </div>
            </div>
            
            <div class="summary-totals-box">
              <div class="totals-line">
                <span class="totals-label">Subtotal</span>
                <span class="totals-val">{{ formatPrice(totalCartPrice) }}</span>
              </div>
              <div class="totals-line">
                <span class="totals-label">Ongkos Kirim</span>
                <span class="totals-val">{{ formatPrice(shippingFee) }}</span>
              </div>
              <div class="totals-line">
                <span class="totals-label">Biaya Admin</span>
                <span class="totals-val">{{ formatPrice(totalAdminFee) }}</span>
              </div>
              <div class="totals-divider"></div>
              <div class="totals-line grand-total-line">
                <span class="totals-label">Total Pembayaran</span>
                <span class="totals-val">{{ formatPrice(grandTotal) }}</span>
              </div>
            </div>

            <div class="summary-actions">
              <button 
                class="btn-primary-block checkout-submit-btn" 
                :disabled="!savedAddress || !shippingFee || isSubmitting"
                :class="{ 'disabled-btn': !savedAddress || !shippingFee || isSubmitting }"
                @click="handleCheckoutSubmit"
              >
                {{ isSubmitting ? (currentLang === 'id' ? 'Memproses...' : 'Processing...') : (currentLang === 'id' ? 'Bayar Sekarang' : 'Pay Now') }}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>

    <!-- Address Selection Modal -->
    <transition name="fade">
      <div v-if="isAddressModalOpen" class="address-modal-overlay" @click.self="closeAddressModal">
        <div class="address-modal-content">
          <button class="close-modal-btn" @click="closeAddressModal">×</button>
          
          <h2 class="modal-title">Tambah Alamat Pengiriman</h2>
          <div class="modal-steps-indicator">
            <span :class="{'active': addressStep >= 1}">1. Cari Lokasi</span>
            <span class="step-divider">></span>
            <span :class="{'active': addressStep >= 2}">2. Pinpoint</span>
            <span class="step-divider">></span>
            <span :class="{'active': addressStep >= 3}">3. Detail Alamat</span>
          </div>

          <!-- Step 1: Search Location -->
          <div v-if="addressStep === 1" class="step-content">
            <p class="step-desc">Gunakan fitur deteksi lokasi otomatis atau cari alamat Anda.</p>
            
            <div class="form-group">
              <input type="text" ref="searchInputRef" class="checkout-text-input mb-4" placeholder="Cari alamat / lokasi..." />
            </div>

            <button class="btn-primary w-full location-btn" @click="useCurrentLocation">
              📍 Gunakan Lokasi Saat Ini
            </button>
            <div class="divider-text">ATAU</div>
            <button class="btn-secondary w-full" @click="goToStep2">
              Lanjut ke Pinpoint Peta
            </button>
          </div>

          <!-- Step 2: Maps Pinpoint -->
          <div v-if="addressStep === 2" class="step-content">
            <p class="step-desc">Geser pin untuk menandai lokasi persis pengiriman Anda.</p>
            <div ref="mapContainer" class="maps-container"></div>
            <button class="btn-primary w-full mt-4" @click="goToStep3">Simpan Koordinat</button>
            <button class="btn-outline w-full mt-2" @click="goBackToStep1">Kembali</button>
          </div>

          <!-- Step 3: Detail Form -->
          <div v-if="addressStep === 3" class="step-content form-scrollable">
            <div class="form-group" :class="{'has-error': addressErrors.nama_penerima}">
              <label class="form-field-label">Nama Penerima</label>
              <input type="text" v-model="addressForm.nama_penerima" class="checkout-text-input" />
              <span class="error-message" v-if="addressErrors.nama_penerima">{{ addressErrors.nama_penerima }}</span>
            </div>

            <div class="form-group" :class="{'has-error': addressErrors.phone}">
              <label class="form-field-label">No Telepon Penerima</label>
              <input type="tel" v-model="addressForm.phone" class="checkout-text-input" />
              <span class="error-message" v-if="addressErrors.phone">{{ addressErrors.phone }}</span>
            </div>

            <div class="form-group">
              <label class="form-field-label">Label Alamat</label>
              <input type="text" v-model="addressForm.address_name" class="checkout-text-input" placeholder="Cth: Rumah, Kantor" />
            </div>

            <div class="form-group" :class="{'has-error': addressErrors.province_id}">
              <label class="form-field-label">Provinsi</label>
              <div class="custom-select-wrapper">
                <input type="text"
                       v-model="searchProvinceQuery"
                       @focus="showProvinceDropdown = true"
                       @blur="setTimeout(() => showProvinceDropdown = false, 200)"
                       class="checkout-text-input"
                       placeholder="Ketik untuk mencari provinsi..." />
                
                <div class="dropdown-options" v-if="showProvinceDropdown">
                  <div class="dropdown-option" 
                       v-for="prov in filteredProvinces" 
                       :key="prov.id || prov.province_id"
                       @mousedown="selectProvince(prov)">
                    {{ prov.province || prov.name || prov.province_name }}
                  </div>
                  <div v-if="filteredProvinces.length === 0" class="dropdown-no-results">
                    Tidak ada provinsi ditemukan.
                  </div>
                </div>
              </div>
              <span class="error-message" v-if="addressErrors.province_id">{{ addressErrors.province_id }}</span>
            </div>

            <div class="form-group" :class="{'has-error': addressErrors.city_id}">
              <label class="form-field-label">Kota / Kabupaten</label>
              <div class="custom-select-wrapper">
                <input type="text"
                       v-model="searchCityQuery"
                       @focus="showCityDropdown = true"
                       @blur="setTimeout(() => showCityDropdown = false, 200)"
                       class="checkout-text-input"
                       placeholder="Ketik untuk mencari kota..." 
                       :disabled="!addressForm.province_id" />
                
                <div class="dropdown-options" v-if="showCityDropdown">
                  <div class="dropdown-option" 
                       v-for="city in filteredCities" 
                       :key="city.id || city.city_id"
                       @mousedown="selectCity(city)">
                    {{ city.type || '' }} {{ city.city || city.name || city.city_name }}
                  </div>
                  <div v-if="filteredCities.length === 0" class="dropdown-no-results">
                    Tidak ada kota ditemukan.
                  </div>
                </div>
              </div>
              <span class="error-message" v-if="addressErrors.city_id">{{ addressErrors.city_id }}</span>
            </div>

            <div class="form-group" :class="{'has-error': addressErrors.zipcode}">
              <label class="form-field-label">Kode Pos</label>
              <input type="text" v-model="addressForm.zipcode" class="checkout-text-input" />
              <span class="error-message" v-if="addressErrors.zipcode">{{ addressErrors.zipcode }}</span>
            </div>

            <div class="form-group" :class="{'has-error': addressErrors.address_detail}">
              <label class="form-field-label">Detail Alamat Lengkap (Patokan)</label>
              <textarea v-model="addressForm.address_detail" rows="3" class="checkout-text-input" placeholder="Cth: Jl. Raya No 5, pagar hitam"></textarea>
              <span class="error-message" v-if="addressErrors.address_detail">{{ addressErrors.address_detail }}</span>
            </div>

            <button class="btn-primary w-full mt-4" @click="saveAddress">Simpan Alamat Pengiriman</button>
            <button class="btn-outline w-full mt-2" @click="addressStep = 2">Kembali ke Peta</button>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<style scoped>
/* Resizing standard styles */
.transaction-checkout-page {
  padding: 100px 0 60px 0;
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.back-navigation-row {
  margin-bottom: 2rem;
}

.btn-back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
}

.btn-back-link:hover {
  color: var(--text-primary);
}

.back-icon-svg {
  width: 20px;
  height: 20px;
}

.checkout-layout-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
  align-items: start;
}

.main-checkout-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
}

/* Accordions */
.accordion-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.accordion-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
}

.accordion-card-title {
  font-weight: 700;
  font-size: 1.1rem;
}

.accordion-body {
  padding: 1.5rem;
}

/* Forms */
.form-group {
  margin-bottom: 1.25rem;
}

.form-field-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ccc;
}

.checkout-text-input, .checkout-phone-input, .checkout-select-input {
  width: 100%;
  padding: 0.85rem 1rem;
  background-color: #111;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-family: inherit;
}

.checkout-select-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.phone-input-group {
  display: flex;
  gap: 0.5rem;
}

.btn-prefix-dropdown {
  background: #222;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  height: 100%;
}

.btn-primary {
  background-color: #fff;
  color: #000;
  border: none;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #ddd;
}

.btn-secondary {
  background-color: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 0.65rem 1.2rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: rgba(255,255,255,0.1);
}

.btn-outline {
  background-color: transparent;
  color: #ccc;
  border: 1px solid #666;
  padding: 0.85rem 1.5rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}

.w-full {
  width: 100%;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.block {
  display: block;
}

/* Saved Address Box */
.saved-address-box {
  background: #222;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.25rem;
  border-radius: 8px;
}
.address-tag {
  background: #444;
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.address-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.address-desc {
  font-size: 0.9rem;
  color: #bbb;
  line-height: 1.4;
}

/* Modal specific */
.address-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.address-modal-content {
  background: #111;
  border: 1px solid rgba(255,255,255,0.1);
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.close-modal-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
}
.close-modal-btn:hover { color: #fff; }
.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}
.modal-steps-indicator {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 1.5rem;
  font-weight: 600;
}
.modal-steps-indicator span.active {
  color: #fff;
}
.step-divider {
  color: #444;
}
.step-desc {
  font-size: 0.9rem;
  color: #bbb;
  margin-bottom: 1.5rem;
}
.divider-text {
  text-align: center;
  margin: 1.5rem 0;
  color: #666;
  font-size: 0.8rem;
  font-weight: bold;
}
.maps-container {
  width: 100%;
  height: 350px;
  border-radius: 8px;
  background: #222;
}
.form-scrollable {
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Order Summary (Desktop) */
.order-summary-card {
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  position: sticky;
  top: 100px;
}

.summary-card-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.summary-item-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.sum-item-img-box img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.sum-item-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.sum-item-name {
  font-weight: 700;
  font-size: 0.9rem;
}

.sum-item-qty {
  font-size: 0.8rem;
  color: #aaa;
}

.sum-item-price {
  font-weight: 700;
  font-size: 0.9rem;
}

.totals-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #ccc;
  font-size: 0.9rem;
}

.totals-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

.grand-total-line {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
}

.btn-primary-block {
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  color: #000;
  border: none;
  font-weight: 800;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1.5rem;
}

.error-message {
  color: #ff3b30;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 992px) {
  .checkout-layout-grid {
    grid-template-columns: 1fr;
  }
  .desktop-summary-only {
    display: none;
  }
}

.mobile-summary-collapse-card {
  display: none;
}
@media (max-width: 992px) {
  .mobile-summary-collapse-card {
    display: block;
    background-color: #1a1a1a;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }
  .summary-collapse-header {
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #222;
  }
  .collapse-header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .summary-bag-icon {
    width: 20px;
    height: 20px;
  }
  .mobile-total-badge {
    margin-left: 0.5rem;
    font-weight: 700;
  }
  .mobile-summary-inner {
    padding: 1.5rem;
  }
  .mobile-price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #ccc;
  }
  .mobile-price-row.total {
    color: #fff;
    font-weight: 800;
    font-size: 1.1rem;
  }
  .mobile-price-divider {
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 1rem 0;
  }
}

/* Custom Searchable Dropdown Styles */
.custom-select-wrapper {
  position: relative;
  width: 100%;
}
.dropdown-options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #111;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
.dropdown-option {
  padding: 0.85rem 1rem;
  color: #fff;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.dropdown-option:last-child {
  border-bottom: none;
}
.dropdown-option:hover {
  background-color: #222;
}
.dropdown-no-results {
  padding: 0.85rem 1rem;
  color: #888;
  text-align: center;
}
</style>

<style>
/* Google Maps Places Autocomplete Dropdown z-index fix */
.pac-container {
  z-index: 10000 !important;
  background-color: #111;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
}
.pac-item {
  border-top: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 8px;
  cursor: pointer;
}
.pac-item:hover {
  background-color: #222;
}
.pac-item-query {
  color: #fff;
  font-weight: bold;
}
</style>
