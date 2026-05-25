<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { t, currentLang } from '../store/lang.js'

// Import local image assets for dynamic display in order summary
import noiseImg from '../assets/images/event_noise_parade.png'
import southSideImg from '../assets/images/event_south_side.png'
import undercityImg from '../assets/images/event_undercity.png'

// Full events data (consistent with other pages)
const events = [
  {
    id: 1,
    title: 'NOISE PARADE 2026',
    date: '2026-06-15',
    day: '15',
    month: 'JUN',
    year: '2026',
    location: 'Jakarta Pusat',
    venue: 'Live House, Jakarta',
    address: 'Jl. Kemang Raya No. 16, Jakarta Selatan',
    time: '19:00 - 23:00 WIB (Doors open 18:00 WIB)',
    image: noiseImg,
    category: 'LIVE HOUSE',
    price: 150000,
    desc: 'Noise Parade 2026 hadir kembali dengan energi lebih besar! Malam penuh dentuman musik, aksi panggung, dan euforia tanpa henti.'
  },
  {
    id: 2,
    title: 'SOUTH SIDE FEST',
    date: '2026-06-29',
    day: '29',
    month: 'JUN',
    year: '2026',
    location: 'Jakarta Selatan',
    venue: 'Parkir Timur Senayan, Jakarta',
    address: 'Gelora Bung Karno, Jl. Pintu Satu Senayan, Jakarta Pusat',
    time: '15:00 - 22:00 WIB (Doors open 14:00 WIB)',
    image: southSideImg,
    category: 'FESTIVAL',
    price: 250000,
    desc: 'South Side Fest membawa parade musik alternatif terbesar tahun ini ke Jakarta.'
  },
  {
    id: 3,
    title: 'UNDERCITY GIGS',
    date: '2026-07-12',
    day: '12',
    month: 'JUL',
    year: '2026',
    location: 'Bandung',
    venue: 'Ruang Bawah Tanah, Bandung',
    address: 'Jl. Braga No. 109, Sumur Bandung, Bandung',
    time: '19:00 - 23:00 WIB (Doors open 18:30 WIB)',
    image: undercityImg,
    category: 'UNDERGROUND',
    price: 120000,
    desc: 'Sebuah malam gigs intim yang berisik di jantung kota Bandung.'
  },
  {
    id: 4,
    title: 'METALCORE MANIA',
    date: '2026-08-05',
    day: '05',
    month: 'AGU',
    year: '2026',
    location: 'Jakarta Barat',
    venue: 'Tennis Indoor Senayan, Jakarta',
    address: 'Jl. Pintu Satu Senayan, Kompleks Gelora Bung Karno, Jakarta Pusat',
    time: '18:00 - 22:00 WIB (Doors open 17:00 WIB)',
    image: noiseImg,
    category: 'CONCERT',
    price: 180000,
    desc: 'Gelombang distorsi metalcore termegah siap menghantam ibu kota.'
  },
  {
    id: 5,
    title: 'INDIE POP GIGS',
    date: '2026-05-10',
    day: '10',
    month: 'MEI',
    year: '2026',
    location: 'Yogyakarta',
    venue: 'Rossi Musik, Jakarta',
    address: 'Jl. Fatmawati No. 30, Jakarta Selatan',
    time: '20:00 - 23:00 WIB (Doors open 19:00 WIB)',
    image: southSideImg,
    category: 'LIVE HOUSE',
    price: 90000,
    desc: 'Gigs indie pop berbalut melodi manis, lirik reflektif, dan suasana hangat yang akrab.'
  },
  {
    id: 6,
    title: 'RETRO SOUNDS 2026',
    date: '2026-04-20',
    day: '20',
    month: 'APR',
    year: '2026',
    location: 'Surabaya',
    venue: 'Gambir Expo Kemayoran, Jakarta',
    address: 'Arena PRJ Kemayoran, Jakarta Pusat',
    time: '14:00 - 23:00 WIB (Doors open 13:00 WIB)',
    image: undercityImg,
    category: 'FESTIVAL',
    price: 200000,
    desc: 'Kembali ke era kejayaan piringan hitam, synth analog, dan lagu-lagu klasik legendaris.'
  },
  {
    id: 7,
    title: 'JAZZ IN THE GARDEN',
    date: '2026-03-15',
    day: '15',
    month: 'MAR',
    year: '2026',
    location: 'Bogor',
    venue: 'Kebun Raya Bogor, Bogor',
    address: 'Jl. Ir. H. Juanda No. 13, Bogor Tengah, Bogor',
    time: '16:00 - 20:00 WIB (Doors open 15:00 WIB)',
    image: noiseImg,
    category: 'CONCERT',
    price: 160000,
    desc: 'Harmoni musik jazz berkelas di bawah rindangnya pepohonan sore hari.'
  },
  {
    id: 8,
    title: 'HARDCORE SUMMER',
    date: '2026-02-28',
    day: '28',
    month: 'PEB',
    year: '2026',
    location: 'Denpasar',
    venue: 'Rossi Musik, Jakarta',
    address: 'Jl. Fatmawati No. 30, Jakarta Selatan',
    time: '17:00 - 22:00 WIB (Doors open 16:00 WIB)',
    image: southSideImg,
    category: 'UNDERGROUND',
    price: 100000,
    desc: 'Energi hardcore penuh letupan, teriakan lantang, dan semangat kebersamaan komunitas punk lokal.'
  },
  {
    id: 9,
    title: 'PUNK ROCK ATTACK',
    date: '2026-07-20',
    day: '20',
    month: 'JUL',
    year: '2026',
    location: 'Tangerang',
    venue: 'Indoor Arena, Tangerang',
    address: 'Kawasan BSD City, Tangerang, Banten',
    time: '18:00 - 22:00 WIB (Doors open 17:00 WIB)',
    image: undercityImg,
    category: 'UNDERGROUND',
    price: 110000,
    desc: 'Malam distorsi kencang khas punk rock dengan ketukan d-beat cepat, lirik sarkastik yang jujur, dan panggung penuh lompatan.'
  },
  {
    id: 10,
    title: 'FOLK ACADEMY 2026',
    date: '2026-08-15',
    day: '15',
    month: 'AGU',
    year: '2026',
    location: 'Malang',
    venue: 'Amphitheater, Malang',
    address: 'Jl. Ijen No. 45, Klojen, Malang, Jawa Timur',
    time: '19:00 - 22:00 WIB (Doors open 18:00 WIB)',
    image: noiseImg,
    category: 'LIVE HOUSE',
    price: 130000,
    desc: 'Senandung gitar akustik, tiupan harmonika, dan suara biola yang menyatu menciptakan malam folk.'
  },
  {
    id: 11,
    title: 'HIP HOP SUMMIT',
    date: '2026-09-02',
    day: '02',
    month: 'SEP',
    year: '2026',
    location: 'Jakarta Utara',
    venue: 'Pantai Indah Kapuk, Jakarta',
    address: 'Kawasan PIK 2, Jakarta Utara',
    time: '16:00 - 23:00 WIB (Doors open 15:00 WIB)',
    image: southSideImg,
    category: 'FESTIVAL',
    price: 220000,
    desc: 'Parade rima terbaik dari jajaran rapper, DJ, breakdancer, dan graffiti artist.'
  },
  {
    id: 12,
    title: 'ECHOES OF THE EAST',
    date: '2026-09-18',
    day: '18',
    month: 'SEP',
    year: '2026',
    location: 'Makassar',
    venue: 'Fort Rotterdam, Makassar',
    address: 'Jl. Ujung Pandang, Makassar, Sulawesi Selatan',
    time: '17:00 - 22:00 WIB (Doors open 16:00 WIB)',
    image: undercityImg,
    category: 'CONCERT',
    price: 175000,
    desc: 'Sebuah perayaan musikal megah yang mengangkat band-band independen.'
  },
  {
    id: 13,
    title: 'SYNTHWAVE NIGHT',
    date: '2026-05-05',
    day: '05',
    month: 'MEI',
    year: '2026',
    location: 'Semarang',
    venue: 'Old Town Hall, Semarang',
    address: 'Jl. Letjen Suprapto No. 31, Kota Lama, Semarang',
    time: '20:00 - 23:00 WIB (Doors open 19:00 WIB)',
    image: noiseImg,
    category: 'LIVE HOUSE',
    price: 95000,
    desc: 'Hanyutkan diri Anda dalam gemerlap lampu neon, ketukan drum mesin retro, dan synthesizer.'
  },
  {
    id: 14,
    title: 'SUMMER BLAST 2026',
    date: '2026-04-12',
    day: '12',
    month: 'APR',
    year: '2026',
    location: 'Medan',
    venue: 'Lapangan Benteng, Medan',
    address: 'Jl. Pengadilan, Petisah Tengah, Medan, Sumatera Utara',
    time: '14:00 - 22:00 WIB (Doors open 13:00 WIB)',
    image: southSideImg,
    category: 'FESTIVAL',
    price: 210000,
    desc: 'Festival musim panas termegah di Medan.'
  },
  {
    id: 15,
    title: 'ACOUSTIC SESSION',
    date: '2026-03-25',
    day: '25',
    month: 'MAR',
    year: '2026',
    location: 'Solo',
    venue: 'Taman Balekambang, Solo',
    address: 'Jl. Ahmad Yani, Surakarta, Jawa Tengah',
    time: '19:30 - 21:30 WIB (Doors open 18:30 WIB)',
    image: undercityImg,
    category: 'CONCERT',
    price: 80000,
    desc: 'Petikan dawai gitar akustik berpadu dengan ketukan perkusi.'
  },
  {
    id: 16,
    title: 'POST-ROCK VISIONS',
    date: '2026-02-10',
    day: '10',
    month: 'PEB',
    year: '2026',
    location: 'Bandung',
    venue: 'Dago Tea House, Bandung',
    address: 'Jl. Bukit Dago Utara No. 53, Coblong, Bandung',
    time: '19:00 - 23:00 WIB (Doors open 18:00 WIB)',
    image: noiseImg,
    category: 'UNDERGROUND',
    price: 115000,
    desc: 'Perjalanan musikal instrumental tanpa batas.'
  }
]

// Prop definitions to receive event context
const props = defineProps({
  eventId: {
    type: Number,
    default: 1
  }
})

// Reactive checkout state loaded from localStorage
const checkoutData = ref(null)

const loadCheckoutData = () => {
  const dataStr = localStorage.getItem('kolektix_checkout')
  if (dataStr) {
    try {
      checkoutData.value = JSON.parse(dataStr)
    } catch (e) {
      console.error('Failed to parse checkout data:', e)
    }
  }

  // Fallback to active event details if no checkout data is found
  if (!checkoutData.value) {
    checkoutData.value = {
      eventId: 1,
      tickets: [
        {
          id: 'normal',
          name: 'GELOMBANG AWAL OTW NORMAL',
          price: 150000,
          qty: 1
        }
      ],
      totalPrice: 150000,
      totalQty: 1
    }
  }
}

// Compute active event details dynamically
const activeEvent = computed(() => {
  const id = checkoutData.value ? checkoutData.value.eventId : 1
  return events.find(e => e.id === id) || events[0]
})

const formatPrice = (price) => {
  return price.toLocaleString('id-ID')
}

// Navigation trigger to go back or home
const goBack = () => {
  window.location.hash = `#event-detail-${activeEvent.value.id}`
}

// Accordion Expand/Collapse States
const isBuyerExpanded = ref(true)
const isTicketHolderExpanded = ref(true)

// Buyer Information Form Data
const buyerForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  countryCode: '+62'
})

// Ticket Holder Information Form Data
const ticketHolderForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  countryCode: '+62'
})

// Gunakan Data Pemesan (Use Buyer Data) Toggle
const useBuyerData = ref(false)

// Watch buyerForm and automatically sync to ticketHolderForm if toggle is active
watch(
  () => ({ ...buyerForm }),
  (newVal) => {
    if (useBuyerData.value) {
      ticketHolderForm.fullName = newVal.fullName
      ticketHolderForm.email = newVal.email
      ticketHolderForm.phone = newVal.phone
      ticketHolderForm.countryCode = newVal.countryCode
    }
  },
  { deep: true }
)

// Watch the toggle itself
watch(useBuyerData, (newVal) => {
  if (newVal) {
    ticketHolderForm.fullName = buyerForm.fullName
    ticketHolderForm.email = buyerForm.email
    ticketHolderForm.phone = buyerForm.phone
    ticketHolderForm.countryCode = buyerForm.countryCode
  }
})

// Agreement Checkboxes
const isDataAccurate = ref(false)
const isTermsAgreed = ref(true) // Checked by default according to prompt

// Form errors
const errors = reactive({
  buyerName: '',
  buyerEmail: '',
  buyerPhone: '',
  holderName: '',
  holderEmail: '',
  holderPhone: '',
  dataAccurate: ''
})

// Country code dropdowns toggle
const showBuyerCountryDropdown = ref(false)
const showHolderCountryDropdown = ref(false)

const countryCodes = [
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' }
]

const selectBuyerCountry = (code) => {
  buyerForm.countryCode = code
  showBuyerCountryDropdown.value = false
}

const selectHolderCountry = (code) => {
  ticketHolderForm.countryCode = code
  showHolderCountryDropdown.value = false
}

// Countdown Timer State (starts at 15 minutes / 900 seconds)
const totalSeconds = ref(900)
let timerInterval = null

const minutesStr = computed(() => {
  const m = Math.floor(totalSeconds.value / 60)
  return m.toString().padStart(2, '0')
})

const secondsStr = computed(() => {
  const s = totalSeconds.value % 60
  return s.toString().padStart(2, '0')
})

// Circular progress offset calculations for the countdown timer
// SVG Circle Circumference = 2 * PI * r = 2 * 3.14159 * 18 = 113.1
const strokeDashoffset = computed(() => {
  const maxSeconds = 900
  const progress = totalSeconds.value / maxSeconds
  return 113.1 * (1 - progress)
})

// Date formatter in Indonesian (e.g. Senin, 10 Agustus 2026)
const formatEventDayAndDate = (dateStr) => {
  if (!dateStr) return ''
  const dateObj = new Date(dateStr)
  
  // Indonesian days
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const dayName = days[dateObj.getDay()]
  
  // Indonesian months
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const dayNum = dateObj.getDate()
  const monthName = months[dateObj.getMonth()]
  const yearNum = dateObj.getFullYear()
  
  return `${dayName}, ${dayNum} ${monthName} ${yearNum}`
}

onMounted(() => {
  loadCheckoutData()
  window.addEventListener('hashchange', loadCheckoutData)
  
  // Start the countdown timer
  timerInterval = setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--
    } else {
      clearInterval(timerInterval)
      alert(currentLang.value === 'id' 
        ? 'Waktu pembayaran Anda telah habis. Silakan pesan ulang tiket Anda.' 
        : 'Your checkout time has expired. Please re-book your tickets.')
      window.location.hash = '#events-page'
    }
  }, 1000)
  
  // Close country dropdowns when clicking outside
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', loadCheckoutData)
  if (timerInterval) clearInterval(timerInterval)
  document.removeEventListener('click', handleOutsideClick)
})

const handleOutsideClick = (e) => {
  if (!e.target.closest('.country-dropdown-wrapper')) {
    showBuyerCountryDropdown.value = false
    showHolderCountryDropdown.value = false
  }
}

// Simple email validation helper
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Submit checkout
const handleCheckout = () => {
  // Reset errors
  errors.buyerName = ''
  errors.buyerEmail = ''
  errors.buyerPhone = ''
  errors.holderName = ''
  errors.holderEmail = ''
  errors.holderPhone = ''
  errors.dataAccurate = ''

  let hasError = false

  // Validate Buyer
  if (!buyerForm.fullName.trim()) {
    errors.buyerName = currentLang.value === 'id' ? 'Nama lengkap wajib diisi' : 'Full name is required'
    hasError = true
  }
  if (!buyerForm.email.trim()) {
    errors.buyerEmail = currentLang.value === 'id' ? 'Email wajib diisi' : 'Email is required'
    hasError = true
  } else if (!isValidEmail(buyerForm.email)) {
    errors.buyerEmail = currentLang.value === 'id' ? 'Format email tidak valid' : 'Invalid email format'
    hasError = true
  }
  if (!buyerForm.phone.trim()) {
    errors.buyerPhone = currentLang.value === 'id' ? 'Nomor telepon wajib diisi' : 'Phone number is required'
    hasError = true
  } else if (!/^\d{8,14}$/.test(buyerForm.phone.trim())) {
    errors.buyerPhone = currentLang.value === 'id' ? 'Nomor telepon harus berupa 8-14 digit angka' : 'Phone number must be 8-14 digits'
    hasError = true
  }

  // Validate Ticket Holder (if not synced or even if synced, double check values)
  if (!ticketHolderForm.fullName.trim()) {
    errors.holderName = currentLang.value === 'id' ? 'Nama pemilik tiket wajib diisi' : 'Ticket holder name is required'
    hasError = true
  }
  if (!ticketHolderForm.email.trim()) {
    errors.holderEmail = currentLang.value === 'id' ? 'Email pemilik tiket wajib diisi' : 'Ticket holder email is required'
    hasError = true
  } else if (!isValidEmail(ticketHolderForm.email)) {
    errors.holderEmail = currentLang.value === 'id' ? 'Format email tidak valid' : 'Invalid email format'
    hasError = true
  }
  if (!ticketHolderForm.phone.trim()) {
    errors.holderPhone = currentLang.value === 'id' ? 'Nomor telepon pemilik tiket wajib diisi' : 'Ticket holder phone is required'
    hasError = true
  } else if (!/^\d{8,14}$/.test(ticketHolderForm.phone.trim())) {
    errors.holderPhone = currentLang.value === 'id' ? 'Nomor telepon harus berupa 8-14 digit angka' : 'Phone number must be 8-14 digits'
    hasError = true
  }

  // Validate Checkboxes
  if (!isDataAccurate.value) {
    errors.dataAccurate = currentLang.value === 'id' ? 'Anda wajib menyetujui pernyataan kebenaran data' : 'You must confirm your data is accurate'
    hasError = true
  }
  if (!isTermsAgreed.value) {
    alert(currentLang.value === 'id' ? 'Anda harus menyetujui Syarat & Ketentuan' : 'You must agree to the Terms & Conditions')
    hasError = true
  }

  if (hasError) {
    // Scroll to the first error
    setTimeout(() => {
      const firstError = document.querySelector('.error-message')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    return
  }

  // Simulation Success!
  alert(currentLang.value === 'id' 
    ? '🎉 Pembayaran Berhasil!\n\nTiket elektronik (E-Ticket) telah dikirimkan ke email pemesan dan pemilik tiket.\nTerima kasih telah bertransaksi di Kolektix! 🤘' 
    : '🎉 Payment Successful!\n\nYour E-Ticket has been successfully sent to the email addresses provided.\nThank you for choosing Kolektix! 🤘')
  
  // Go back to home
  window.location.hash = ''
}

// Collapsible Mobile Summary Toggle
const isMobileSummaryExpanded = ref(false)
</script>

<template>
  <div class="transaction-checkout-page">
    <div class="container checkout-container">
      
      <!-- Back Header Button -->
      <div class="back-navigation-row">
        <button class="btn-back-link" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="back-icon-svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ currentLang === 'id' ? 'Kembali' : 'Back' }}</span>
        </button>
      </div>

      <!-- Main Layout Structure -->
      <div class="checkout-layout-grid">
        
        <!-- Left Column: Form Section (60-65%) -->
        <div class="checkout-forms-column">
          <h1 class="main-checkout-title">
            {{ currentLang === 'id' ? 'Informasi Pribadi' : 'Personal Informasi' }}
          </h1>

          <!-- Mobile Collapsible Order Summary Bar (Only displays on Mobile) -->
          <div class="mobile-summary-collapse-card">
            <div class="summary-collapse-header" @click="isMobileSummaryExpanded = !isMobileSummaryExpanded">
              <div class="collapse-header-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="summary-bag-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span class="collapse-title-text">{{ currentLang === 'id' ? 'Lihat Ringkasan Pesanan' : 'View Order Summary' }}</span>
                <span class="mobile-total-badge">Rp {{ formatPrice((checkoutData?.totalPrice || 150000) + 10000) }}</span>
              </div>
              <svg class="chevron-collapse-icon" :class="{ rotated: isMobileSummaryExpanded }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            
            <transition name="accordion-slide">
              <div v-show="isMobileSummaryExpanded" class="mobile-summary-collapse-content">
                <div class="mobile-summary-inner">
                  <div class="mini-event-info">
                    <div class="mini-event-title">{{ activeEvent.title }}</div>
                    <div class="mini-event-meta">{{ formatEventDayAndDate(activeEvent.date) }} | {{ activeEvent.venue }}</div>
                  </div>
                  
                  <div v-for="ticket in (checkoutData?.tickets || [])" :key="ticket.id" class="mobile-price-row">
                    <span class="mobile-price-lbl">{{ ticket.name }} x{{ ticket.qty }}</span>
                    <span class="mobile-price-val">Rp {{ formatPrice(ticket.price * ticket.qty) }}</span>
                  </div>

                  <div class="mobile-price-row">
                    <span class="mobile-price-lbl">{{ currentLang === 'id' ? 'Biaya Layanan' : 'Service Fee' }}</span>
                    <span class="mobile-price-val">Rp 10.000</span>
                  </div>
                  <div class="mobile-price-divider"></div>
                  <div class="mobile-price-row total">
                    <span class="mobile-price-lbl">{{ currentLang === 'id' ? 'Total Pembayaran' : 'Total Payment' }}</span>
                    <span class="mobile-price-val">Rp {{ formatPrice((checkoutData?.totalPrice || 150000) + 10000) }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Card 1: Data Pemesan (Buyer Information) -->
          <div class="accordion-card" :class="{ 'is-expanded': isBuyerExpanded }">
            <div class="accordion-header" @click="isBuyerExpanded = !isBuyerExpanded">
              <div class="header-left-title-box">
                <span class="accordion-card-title">{{ currentLang === 'id' ? 'Data Pemesan' : 'Data Pemesan' }}</span>
              </div>
              <svg class="chevron-accordion-icon" :class="{ rotated: isBuyerExpanded }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </div>

            <transition name="accordion-slide">
              <div v-show="isBuyerExpanded" class="accordion-body">
                <div class="form-fields-wrapper">
                  
                  <!-- Full Name Input -->
                  <div class="form-group" :class="{ 'has-error': errors.buyerName }">
                    <label class="form-field-label">{{ currentLang === 'id' ? 'Nama Lengkap' : 'Nama Lengkap' }}</label>
                    <input 
                      type="text" 
                      v-model="buyerForm.fullName" 
                      placeholder="Nama Lengkap" 
                      class="checkout-text-input" 
                    />
                    <span v-if="errors.buyerName" class="error-message">{{ errors.buyerName }}</span>
                  </div>

                  <!-- Email Input -->
                  <div class="form-group" :class="{ 'has-error': errors.buyerEmail }">
                    <label class="form-field-label">Email</label>
                    <input 
                      type="email" 
                      v-model="buyerForm.email" 
                      placeholder="Contoh: example@example.com" 
                      class="checkout-text-input" 
                    />
                    <span v-if="errors.buyerEmail" class="error-message">{{ errors.buyerEmail }}</span>
                  </div>

                  <!-- Phone Number Input with Prefix Dropdown -->
                  <div class="form-group" :class="{ 'has-error': errors.buyerPhone }">
                    <label class="form-field-label">{{ currentLang === 'id' ? 'No Telepon' : 'No Telepon' }}</label>
                    <div class="phone-input-group">
                      <!-- Dropdown prefix -->
                      <div class="country-dropdown-wrapper" id="buyer-country-drop">
                        <button class="btn-prefix-dropdown" @click.stop="showBuyerCountryDropdown = !showBuyerCountryDropdown">
                          <span>{{ buyerForm.countryCode }}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="chevron-down-mini">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        
                        <div v-if="showBuyerCountryDropdown" class="dropdown-list-container">
                          <button 
                            v-for="country in countryCodes" 
                            :key="country.code" 
                            class="dropdown-item-btn"
                            @click="selectBuyerCountry(country.code)"
                          >
                            <span class="dropdown-flag">{{ country.flag }}</span>
                            <span class="dropdown-name">{{ country.name }}</span>
                            <span class="dropdown-code">{{ country.code }}</span>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Input field -->
                      <input 
                        type="tel" 
                        v-model="buyerForm.phone" 
                        placeholder="Contoh: 81234567890" 
                        class="checkout-phone-input" 
                      />
                    </div>
                    <span v-if="errors.buyerPhone" class="error-message">{{ errors.buyerPhone }}</span>
                  </div>

                </div>
              </div>
            </transition>
          </div>

          <!-- Card 2: Tiket Details (Ticket Holder Information) -->
          <div class="accordion-card" :class="{ 'is-expanded': isTicketHolderExpanded }">
            <div class="accordion-header" @click="isTicketHolderExpanded = !isTicketHolderExpanded">
              <div class="header-left-title-box">
                <!-- Ticket Icon -->
                <svg class="accordion-ticket-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 8.5C21 8.22 20.78 8 20.5 8C19.12 8 18 6.88 18 5.5C18 5.22 17.78 5 17.5 5H6.5C6.22 5 6 5.22 6 5.5C6 6.88 4.88 8 3.5 8C3.22 8 3 8.22 3 8.5V15.5C3 15.78 3.22 16 3.5 16C4.88 16 6 17.12 6 18.5C6 18.78 6.22 19 6.5 19H17.5C17.78 19 18 18.78 18 18.5C18 17.12 19.12 16 20.5 16C20.78 16 21 15.78 21 15.5V8.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="ticket-header-text-block">
                  <span class="accordion-card-title secondary">1. Pemilik Tiket {{ checkoutData?.tickets?.[0]?.name || 'GELOMBANG AWAL OTW NORMAL' }}</span>
                  <span class="accordion-card-subtitle">1 Tiket x Rp {{ formatPrice(checkoutData?.tickets?.[0]?.price || 150000) }}</span>
                </div>
              </div>
              <svg class="chevron-accordion-icon" :class="{ rotated: isTicketHolderExpanded }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </div>

            <transition name="accordion-slide">
              <div v-show="isTicketHolderExpanded" class="accordion-body">
                
                <!-- Toggle Gunakan Data Pemesan -->
                <div class="toggle-switch-wrapper">
                  <span class="toggle-label-text">Gunakan Data Pemesan</span>
                  <label class="switch-control">
                    <input type="checkbox" v-model="useBuyerData" />
                    <span class="switch-slider round"></span>
                  </label>
                </div>

                <div class="form-fields-wrapper mt-3" :class="{ 'is-disabled-overlay': useBuyerData }">
                  <!-- Disabled overlay if syncing with buyer -->
                  <div v-if="useBuyerData" class="fields-disabled-mask" @click.stop="useBuyerData = false"></div>
                  
                  <!-- Full Name Input -->
                  <div class="form-group" :class="{ 'has-error': errors.holderName }">
                    <label class="form-field-label">{{ currentLang === 'id' ? 'Nama Lengkap' : 'Nama Lengkap' }}</label>
                    <input 
                      type="text" 
                      v-model="ticketHolderForm.fullName" 
                      placeholder="Nama Lengkap" 
                      class="checkout-text-input" 
                      :disabled="useBuyerData"
                    />
                    <span v-if="errors.holderName" class="error-message">{{ errors.holderName }}</span>
                  </div>

                  <!-- Email Input -->
                  <div class="form-group" :class="{ 'has-error': errors.holderEmail }">
                    <label class="form-field-label">Email</label>
                    <input 
                      type="email" 
                      v-model="ticketHolderForm.email" 
                      placeholder="Contoh: example@example.com" 
                      class="checkout-text-input" 
                      :disabled="useBuyerData"
                    />
                    <span v-if="errors.holderEmail" class="error-message">{{ errors.holderEmail }}</span>
                  </div>

                  <!-- Phone Number Input with Prefix Dropdown -->
                  <div class="form-group" :class="{ 'has-error': errors.holderPhone }">
                    <label class="form-field-label">{{ currentLang === 'id' ? 'No Telepon' : 'No Telepon' }}</label>
                    <div class="phone-input-group">
                      <!-- Dropdown prefix -->
                      <div class="country-dropdown-wrapper" id="holder-country-drop">
                        <button 
                          class="btn-prefix-dropdown" 
                          @click.stop="!useBuyerData ? showHolderCountryDropdown = !showHolderCountryDropdown : null"
                          :disabled="useBuyerData"
                        >
                          <span>{{ ticketHolderForm.countryCode }}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="chevron-down-mini">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        
                        <div v-if="showHolderCountryDropdown" class="dropdown-list-container">
                          <button 
                            v-for="country in countryCodes" 
                            :key="country.code" 
                            class="dropdown-item-btn"
                            @click="selectHolderCountry(country.code)"
                          >
                            <span class="dropdown-flag">{{ country.flag }}</span>
                            <span class="dropdown-name">{{ country.name }}</span>
                            <span class="dropdown-code">{{ country.code }}</span>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Input field -->
                      <input 
                        type="tel" 
                        v-model="ticketHolderForm.phone" 
                        placeholder="Contoh: 81234567890" 
                        class="checkout-phone-input" 
                        :disabled="useBuyerData"
                      />
                    </div>
                    <span v-if="errors.holderPhone" class="error-message">{{ errors.holderPhone }}</span>
                  </div>

                </div>
              </div>
            </transition>
          </div>

          <!-- Card 3: Terms & Agreement Checkboxes -->
          <div class="checkbox-agreement-card">
            <div class="checkbox-row-wrapper" :class="{ 'has-error': errors.dataAccurate }">
              <label class="custom-checkbox-container">
                <input type="checkbox" v-model="isDataAccurate" />
                <span class="checkbox-checkmark"></span>
                <span class="checkbox-label-text">
                  Saya menyatakan bahwa data yang saya berikan adalah benar dan dapat dipertanggungjawabkan.
                </span>
              </label>
              <div v-if="errors.dataAccurate" class="error-message-checkbox">{{ errors.dataAccurate }}</div>
            </div>

            <div class="checkbox-row-wrapper mt-3">
              <label class="custom-checkbox-container">
                <input type="checkbox" v-model="isTermsAgreed" />
                <span class="checkbox-checkmark checked-fill"></span>
                <span class="checkbox-label-text">
                  Saya telah membaca dan menyetujui Syarat & Ketentuan serta Kebijakan Privasi.
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary Sidebar (35-40%) -->
        <div class="checkout-sidebar-column">
          <div class="sticky-order-summary-card">
            <h2 class="summary-card-title">Ringkasan Pesanan</h2>

            <!-- Event Banner Dynamic Image (Adjusts to selected event) -->
            <div class="event-summary-banner-box">
              <img :src="activeEvent.image" :alt="activeEvent.title" class="event-summary-banner-img" />
            </div>

            <!-- Event Details -->
            <div class="event-summary-details-section">
              <h3 class="event-summary-main-title">{{ activeEvent.title }}</h3>
              
              <div class="event-summary-meta-list">
                <!-- Date -->
                <div class="summary-meta-item">
                  <svg class="summary-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatEventDayAndDate(activeEvent.date) }}</span>
                </div>
                
                <!-- Location -->
                <div class="summary-meta-item">
                  <svg class="summary-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ activeEvent.venue }}</span>
                </div>

                <!-- Category Tags -->
                <div class="summary-meta-item">
                  <svg class="summary-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.248.586 1.813l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.565-.374-1.813.586-1.813h4.906a1 1 0 00.95-.69l1.519-4.674z" />
                  </svg>
                  <span>{{ activeEvent.category }} • {{ currentLang === 'id' ? 'Musik' : 'Music' }}</span>
                </div>
              </div>
            </div>

            <!-- Price Breakdown Section -->
            <div class="price-breakdown-section">
              <!-- Ticket Type details -->
              <div v-for="ticket in (checkoutData?.tickets || [])" :key="ticket.id" class="price-breakdown-row ticket-type-row">
                <div class="ticket-type-lbl-stack">
                  <span class="breakdown-lbl">Tipe Tiket:</span>
                  <span class="breakdown-desc">{{ ticket.name }}</span>
                </div>
                <div class="breakdown-qty-price-box">
                  <span class="qty-badge">{{ ticket.qty }} x Rp {{ formatPrice(ticket.price) }}</span>
                </div>
              </div>

              <!-- Subtotal -->
              <div class="price-breakdown-row">
                <span class="breakdown-text-lbl">Subtotal</span>
                <span class="breakdown-val">Rp {{ formatPrice(checkoutData?.totalPrice || 150000) }}</span>
              </div>

              <!-- Biaya Layanan -->
              <div class="price-breakdown-row service-fee-row">
                <div class="service-fee-lbl-box">
                  <span class="breakdown-text-lbl">Biaya Layanan</span>
                  <div class="info-tooltip-container">
                    <svg class="info-circle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="tooltip-text-bubble">Biaya administrasi & pemrosesan tiket Kolektix</span>
                  </div>
                </div>
                <span class="breakdown-val">Rp 10.000</span>
              </div>

              <!-- Divider -->
              <div class="summary-line-divider"></div>

              <!-- Total Pembayaran -->
              <div class="total-payment-row">
                <span class="total-pay-lbl">Total Pembayaran</span>
                <span class="total-pay-amount">Rp {{ formatPrice((checkoutData?.totalPrice || 150000) + 10000) }}</span>
              </div>
            </div>

            <!-- Security Trust Badges -->
            <div class="security-badges-container">
              <!-- Lock Security Badge -->
              <div class="security-badge-item">
                <svg class="security-badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p class="security-badge-text">Pembayaran Anda dilindungi sistem keamanan terenkripsi.</p>
              </div>

              <!-- E-Ticket badge -->
              <div class="security-badge-item">
                <svg class="security-badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p class="security-badge-text">E-ticket akan dikirimkan ke email Anda setelah pembayaran berhasil.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Sticky Navigation Bar -->
    <div class="sticky-bottom-action-bar">
      <div class="container bottom-action-bar-container">
        
        <!-- Left: Countdown Timer & secure checkout text -->
        <div class="bottom-bar-left-timer-info">
          <!-- Countdown Timer Icon with circular SVG progress bar -->
          <div class="circular-timer-box">
            <svg class="circular-timer-svg" viewBox="0 0 40 40">
              <!-- Background Circle -->
              <circle cx="20" cy="20" r="18" fill="none" stroke="#222222" stroke-width="3" />
              <!-- Decreasing Progress Circle (Stroke replaced with white color) -->
              <circle 
                cx="20" 
                cy="20" 
                r="18" 
                fill="none" 
                stroke="#ffffff" 
                stroke-width="3" 
                stroke-linecap="round"
                stroke-dasharray="113.1"
                :stroke-dashoffset="strokeDashoffset"
                transform="rotate(-90 20 20)"
                class="progress-circle-ring"
              />
            </svg>
            <div class="timer-digits-text">{{ minutesStr }}:{{ secondsStr }}</div>
          </div>
          
          <div class="bottom-bar-security-statement-block">
            <span class="secure-badge-label">KOLEKTIX SECURE</span>
            <p class="secure-badge-desc">Pembayaran ini akan diproses melalui Kolektix.</p>
          </div>
        </div>

        <!-- Right: Prominent checkout CTA button -->
        <div class="bottom-bar-right-cta">
          <button class="btn-beli-tiket-checkout" @click="handleCheckout">
            {{ currentLang === 'id' ? 'Beli Tiket' : 'Beli Tiket' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========================================== */
/* GENERAL THEMING & DESIGN SYSTEM            */
/* ========================================== */
.transaction-checkout-page {
  background-color: #0e0e0e; /* Matches Website Primary Dark Background */
  min-height: 100vh;
  padding: 6.5rem 0 11rem 0; /* extra space at bottom for sticky bar */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #ffffff; /* Matches Website Text Primary (White) */
  text-align: left;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Back Link Row */
.back-navigation-row {
  margin-bottom: 1.5rem;
}

.btn-back-link {
  background: none;
  border: none;
  color: #a3a3a3; /* Matches Website text-secondary */
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
}

.btn-back-link:hover {
  color: #ffffff; /* Swapped brown with white hover color */
}

.back-icon-svg {
  width: 16px;
  height: 16px;
}

/* ========================================== */
/* GRID LAYOUT FOR CHECKOUT SYSTEM            */
/* ========================================== */
.checkout-layout-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2.5rem;
  align-items: flex-start;
}

/* Main Heading Title */
.main-checkout-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 2rem 0;
  font-family: 'Outfit', sans-serif;
}

/* ========================================== */
/* ACCORDION CARDS STYLES                     */
/* ========================================== */
.accordion-card {
  background-color: #121212; /* Matches Website Secondary Dark Background */
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08); /* Matches Website Border Color */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  margin-bottom: 1.25rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.accordion-card.is-expanded {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.accordion-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  background-color: #121212;
}

.header-left-title-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.accordion-ticket-icon {
  width: 24px;
  height: 24px;
  color: #ffffff; /* Swapped brown with white color */
  flex-shrink: 0;
}

.ticket-header-text-block {
  display: flex;
  flex-direction: column;
}

.accordion-card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
}

.accordion-card-title.secondary {
  font-size: 0.95rem;
  line-height: 1.3;
}

.accordion-card-subtitle {
  font-size: 0.8rem;
  color: #a3a3a3;
  font-weight: 500;
  margin-top: 2px;
}

.chevron-accordion-icon {
  width: 20px;
  height: 20px;
  color: #a3a3a3;
  transition: transform 0.3s ease;
}

.chevron-accordion-icon.rotated {
  transform: rotate(180deg);
}

/* Accordion body sliding animation */
.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.accordion-slide-enter-from,
.accordion-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-body {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  background-color: #121212;
}

/* ========================================== */
/* FORM INPUTS & INTERACTION STYLES          */
/* ========================================== */
.form-fields-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-field-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}

.checkout-text-input,
.checkout-phone-input {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: #1a1a1a;
  color: #ffffff;
  outline: none;
  font-family: inherit;
  transition: all 0.25s ease;
}

.checkout-text-input::placeholder,
.checkout-phone-input::placeholder {
  color: #525252; /* Matches Website muted color */
}

.checkout-text-input:focus,
.checkout-phone-input:focus {
  border-color: #ffffff; /* Swapped brown with white focus color */
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15);
}

/* Error states */
.form-group.has-error .checkout-text-input,
.form-group.has-error .checkout-phone-input {
  border-color: #C94C4C;
}

.error-message {
  font-size: 0.75rem;
  font-weight: 600;
  color: #C94C4C;
  margin-top: 2px;
}

/* Phone input layout with prefix selector */
.phone-input-group {
  display: flex;
  gap: 0.5rem;
  position: relative;
}

.country-dropdown-wrapper {
  position: relative;
}

.btn-prefix-dropdown {
  height: 100%;
  padding: 0 0.75rem;
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.btn-prefix-dropdown:hover {
  background-color: #262626;
}

.btn-prefix-dropdown:focus {
  border-color: #ffffff; /* Swapped brown with white focus color */
}

.chevron-down-mini {
  width: 16px;
  height: 16px;
  color: #a3a3a3;
}

.dropdown-list-container {
  position: absolute;
  top: 105%;
  left: 0;
  z-index: 100;
  background-color: #181818;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  width: 220px;
  max-height: 250px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0.4rem;
}

.dropdown-item-btn {
  padding: 0.6rem 0.8rem;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-align: left;
  font-size: 0.85rem;
  color: #ffffff;
  cursor: pointer;
  border-radius: 6px;
  font-family: inherit;
  transition: background-color 0.15s ease;
}

.dropdown-item-btn:hover {
  background-color: #262626;
}

.dropdown-flag {
  font-size: 1.1rem;
}

.dropdown-name {
  flex-grow: 1;
}

.dropdown-code {
  font-weight: 700;
  color: #a3a3a3;
}

/* ========================================== */
/* TOGGLE SWITCH STYLES                       */
/* ========================================== */
.toggle-switch-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  margin-bottom: 0.75rem;
}

.toggle-label-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
}

.switch-control {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch-control input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333333;
  transition: .3s;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}

input:checked + .switch-slider {
  background-color: #ffffff; /* Swapped brown with white active background */
}

input:checked + .switch-slider:before {
  transform: translateX(20px);
  background-color: #000000; /* Contrast black toggle dot */
}

.switch-slider.round {
  border-radius: 24px;
}

.switch-slider.round:before {
  border-radius: 50%;
}

/* Disabled Form Mask Effect */
.is-disabled-overlay {
  opacity: 0.65;
  pointer-events: none;
  user-select: none;
}

.fields-disabled-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: pointer;
}

/* ========================================== */
/* CHECKBOX / TERMS CARD                      */
/* ========================================== */
.checkbox-agreement-card {
  background-color: #121212;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  padding: 1.5rem;
  text-align: left;
  margin-bottom: 2rem;
}

.checkbox-row-wrapper {
  display: flex;
  flex-direction: column;
}

.checkbox-row-wrapper.has-error {
  border-left: 3px solid #C94C4C;
  padding-left: 0.5rem;
}

.custom-checkbox-container {
  display: flex;
  position: relative;
  padding-left: 2rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.4;
  color: #ffffff;
  user-select: none;
}

.custom-checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-checkmark {
  position: absolute;
  top: 2px;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #1a1a1a;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: all 0.2s ease;
}

/* Checkbox States */
.custom-checkbox-container:hover input ~ .checkbox-checkmark {
  border-color: #ffffff; /* Swapped brown with white border color */
}

.custom-checkbox-container input:checked ~ .checkbox-checkmark {
  background-color: #ffffff; /* Swapped brown with white background */
  border-color: #ffffff;
}

/* Default Checked fill indicator */
.checkbox-checkmark.checked-fill {
  background-color: #ffffff; /* Swapped brown with white background */
  border-color: #ffffff;
}

.checkbox-checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox-container input:checked ~ .checkbox-checkmark:after {
  display: block;
}

/* Checked mark inside style (Replaced with dark charcoal icon for contrast against white) */
.custom-checkbox-container .checkbox-checkmark:after {
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid #121212;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.error-message-checkbox {
  font-size: 0.72rem;
  color: #C94C4C;
  font-weight: 700;
  margin-top: 0.4rem;
  margin-left: 2rem;
}

.mt-3 {
  margin-top: 1rem;
}

/* ========================================== */
/* ORDER SUMMARY SIDEBAR STYLES               */
/* ========================================== */
.checkout-sidebar-column {
  position: sticky;
  top: 6.5rem;
}

.sticky-order-summary-card {
  background-color: #121212;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.summary-card-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 1.25rem 0;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.01em;
}

.event-summary-banner-box {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #0B0B0B;
}

.event-summary-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Event Metadata inside summary card */
.event-summary-details-section {
  text-align: left;
  margin-bottom: 1.5rem;
}

.event-summary-main-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.75rem 0;
}

.event-summary-meta-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.summary-meta-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #a3a3a3;
}

.summary-meta-icon {
  width: 16px;
  height: 16px;
  color: #a3a3a3;
  flex-shrink: 0;
}

/* Price breakdown area */
.price-breakdown-section {
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 1.25rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.price-breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.ticket-type-row {
  align-items: flex-start;
}

.ticket-type-lbl-stack {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 65%;
}

.breakdown-lbl {
  font-size: 0.72rem;
  font-weight: 800;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.breakdown-desc {
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.breakdown-qty-price-box {
  text-align: right;
}

.qty-badge {
  font-size: 0.75rem;
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff; /* Swapped gold with white color */
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 700;
}

.breakdown-text-lbl {
  font-weight: 600;
  color: #a3a3a3;
}

.breakdown-val {
  font-weight: 700;
  color: #ffffff;
}

/* Service fee line with tooltip */
.service-fee-lbl-box {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.info-circle-icon {
  width: 14px;
  height: 14px;
  color: #a3a3a3;
  cursor: help;
}

.info-tooltip-container {
  position: relative;
  display: inline-flex;
}

.tooltip-text-bubble {
  visibility: hidden;
  width: 200px;
  background-color: #2D2D2D;
  color: #FFFFFF;
  text-align: center;
  border-radius: 6px;
  padding: 6px 10px;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 0.72rem;
  line-height: 1.3;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.info-tooltip-container:hover .tooltip-text-bubble {
  visibility: visible;
  opacity: 1;
}

/* Total Pembayaran line */
.summary-line-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.08);
  margin: 0.25rem 0;
}

.total-payment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.total-pay-lbl {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
}

.total-pay-amount {
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffffff; /* Swapped gold/accent with white text */
  letter-spacing: -0.02em;
}

/* Trust Security Badges */
.security-badges-container {
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.security-badge-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  text-align: left;
}

.security-badge-icon {
  width: 18px;
  height: 18px;
  color: #525252;
  flex-shrink: 0;
  margin-top: 1px;
}

.security-badge-text {
  font-size: 0.72rem;
  line-height: 1.4;
  color: #a3a3a3;
  margin: 0;
  font-weight: 500;
}

/* ========================================== */
/* STICKY BOTTOM NAVIGATION BAR               */
/* ========================================== */
.sticky-bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #121212;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem 0;
  z-index: 998;
}

.bottom-action-bar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Left Countdown Timer Widget */
.bottom-bar-left-timer-info {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.circular-timer-box {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.circular-timer-svg {
  width: 44px;
  height: 44px;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-circle-ring {
  transition: stroke-dashoffset 1s linear;
}

.timer-digits-text {
  font-size: 0.72rem;
  font-weight: 800;
  color: #ffffff;
  font-family: monospace;
}

.bottom-bar-security-statement-block {
  text-align: left;
}

.secure-badge-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #a3a3a3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.secure-badge-desc {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
  margin: 2px 0 0 0;
}

/* Right button CTA (Swapped brown background with white background and black text) */
.btn-beli-tiket-checkout {
  background-color: #ffffff; 
  color: #000000; 
  border: none;
  font-size: 0.95rem;
  font-weight: 800;
  padding: 0.9rem 2.5rem;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.25s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  font-family: inherit;
}

.btn-beli-tiket-checkout:hover {
  background-color: #e6e6e6;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
}

.btn-beli-tiket-checkout:active {
  transform: translateY(0);
}

/* ========================================== */
/* RESPONSIVE LAYOUTS & UX BEHAVIORS         */
/* ========================================== */
.mobile-summary-collapse-card {
  display: none; /* Hide on Desktop */
}

@media (max-width: 991px) {
  .checkout-layout-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .checkout-sidebar-column {
    display: none; /* Hidden on Mobile because it collapses at the top */
  }

  .mobile-summary-collapse-card {
    display: block;
    background-color: #121212;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .summary-collapse-header {
    padding: 1rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .collapse-header-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-grow: 1;
    text-align: left;
  }

  .summary-bag-icon {
    width: 20px;
    height: 20px;
    color: #ffffff; /* Swapped gold with white */
  }

  .collapse-title-text {
    font-size: 0.85rem;
    font-weight: 700;
    color: #ffffff;
    flex-grow: 1;
  }

  .mobile-total-badge {
    background-color: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #ffffff; /* Swapped gold with white */
    font-size: 0.8rem;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 4px;
    margin-right: 0.5rem;
  }

  .chevron-collapse-icon {
    width: 18px;
    height: 18px;
    color: #a3a3a3;
    transition: transform 0.3s ease;
  }

  .chevron-collapse-icon.rotated {
    transform: rotate(180deg);
  }

  .mobile-summary-collapse-content {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 1.25rem;
    background-color: #181818;
  }

  .mobile-summary-inner {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-align: left;
  }

  .mini-event-info {
    border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
    padding-bottom: 0.75rem;
    margin-bottom: 0.25rem;
  }

  .mini-event-title {
    font-size: 0.95rem;
    font-weight: 800;
    color: #ffffff;
  }

  .mini-event-meta {
    font-size: 0.75rem;
    color: #a3a3a3;
    margin-top: 2px;
    font-weight: 500;
  }

  .mobile-price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: #a3a3a3;
  }

  .mobile-price-row.total {
    font-size: 0.9rem;
    font-weight: 800;
    color: #ffffff; /* Swapped gold with white */
  }

  .mobile-price-row.total .mobile-price-val {
    font-size: 1.1rem;
  }

  .mobile-price-divider {
    height: 1px;
    background-color: rgba(255, 255, 255, 0.08);
  }
}

@media (max-width: 600px) {
  .transaction-checkout-page {
    padding-top: 5rem;
    padding-bottom: 12rem; /* even more space for taller bottom bar */
  }

  .main-checkout-title {
    font-size: 1.7rem;
    margin-bottom: 1.25rem;
  }

  .bottom-action-bar-container {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .bottom-bar-left-timer-info {
    justify-content: center;
  }

  .btn-beli-tiket-checkout {
    width: 100%;
    padding: 0.85rem 1.5rem;
  }
}
</style>
