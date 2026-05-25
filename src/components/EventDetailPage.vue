<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Import local image assets for fallback and display
import noiseImg from '../assets/images/event_noise_parade.png'
import southSideImg from '../assets/images/event_south_side.png'
import undercityImg from '../assets/images/event_undercity.png'

const props = defineProps({
  eventId: {
    type: Number,
    required: true
  }
})

// Full events data (identical to EventsPage.vue to ensure seamless data alignment)
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
    desc: 'Noise Parade 2026 hadir kembali dengan energi lebih besar! Malam penuh dentuman musik, aksi panggung, dan euforia tanpa henti. Bersiaplah untuk merasakan pengalaman live yang tak terlupakan bersama lineup terbaik pilihan Death Rock Star. Jangan sampai ketinggalan!'
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
    desc: 'South Side Fest membawa parade musik alternatif terbesar tahun ini ke Jakarta. Menampilkan panggung outdoor megah dengan pertunjukan audio visual kelas dunia, area kuliner kreatif, dan merchandise eksklusif hanya untuk Anda!'
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
    desc: 'Sebuah malam gigs intim yang berisik di jantung kota Bandung. Temui komunitas underground, rasakan getaran musik distorsi mentah, dan rayakan semangat independen bersama empat band andalan lokal.'
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
    desc: 'Gelombang distorsi metalcore termegah siap menghantam ibu kota. Aksi panggung penuh headbang, moshing pit aman, dan suara gahar menggelegar dari band-band cadas papan atas tanah air.'
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
    desc: 'Gigs indie pop berbalut melodi manis, lirik reflektif, dan suasana hangat yang akrab. Cocok untuk bersantai dan bernyanyi bersama teman-teman terdekat menikmati malam syahdu.'
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
    desc: 'Kembali ke era kejayaan piringan hitam, synth analog, dan lagu-lagu klasik legendaris. Event retro penuh gaya, pameran kaset lawas, dan parade musik yang memicu nostalgia mendalam.'
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
    desc: 'Harmoni musik jazz berkelas di bawah rindangnya pepohonan sore hari. Nikmati tiupan saksofon lembut dan petikan gitar akustik menawan di tengah sejuknya alam Kebun Raya Bogor.'
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
    desc: 'Energi hardcore penuh letupan, teriakan lantang, dan semangat kebersamaan komunitas punk lokal. Rayakan hari-hari akhir musim panas dengan aksi panggung super berisik.'
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
    desc: 'Malam distorsi kencang khas punk rock dengan ketukan d-beat cepat, lirik sarkastik yang jujur, dan panggung penuh lompatan atraktif. Siapkan sepatu boots terbaikmu!'
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
    desc: 'Senandung gitar akustik, tiupan harmonika, dan suara biola yang menyatu menciptakan malam penuh petualangan musikal folk bernada magis di kota Malang.'
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
    desc: 'Parade rima terbaik dari jajaran rapper, DJ, breakdancer, dan graffiti artist andalan. Rayakan kultur hip-hop sesungguhnya langsung di tepi pantai pasir putih PIK.'
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
    desc: 'Sebuah perayaan musikal megah yang mengangkat band-band independen berkarakter kuat dari bagian timur Indonesia dengan latar sejarah benteng Fort Rotterdam.'
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
    desc: 'Hanyutkan diri Anda dalam gemerlap lampu neon, ketukan drum mesin retro, dan petualangan melodi synthesizer futuristik 80-an di tengah arsitektur kolonial Kota Lama.'
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
    desc: 'Festival musim panas termegah di Medan. Panggung megah, jajaran kuliner lokal andalan, instalasi seni interaktif, dan penampilan heboh dari band pop-rock papan atas.'
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
    desc: 'Petikan dawai gitar akustik berpadu dengan ketukan perkusi santai menciptakan malam akustik intim yang menenangkan di bawah terangnya rembulan Kota Solo.'
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
    desc: 'Perjalanan musikal instrumental tanpa batas. Panggung penuh visual sinematik magis, melodi gitar delay berlapis, dan klimaks emosi membuncah khas musik post-rock.'
  }
]

// Current date benchmark for filtering past vs upcoming
const BENCHMARK_DATE = '2026-05-24'

// Countdown State
const countdown = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let countdownInterval = null

const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  
  // Set event time: 19:00 WIB of the event date
  const targetDate = new Date(`${currentEvent.value.date}T19:00:00+07:00`).getTime()
  
  const update = () => {
    const now = new Date().getTime()
    const diff = targetDate - now
    
    if (diff <= 0) {
      countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }
      return
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    countdown.value = {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    }
  }
  
  update()
  countdownInterval = setInterval(update, 1000)
}

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

// Strip out the extra parentheses (e.g. Doors open details) for cleaner display in metadata
const cleanTimeRange = computed(() => {
  const rawTime = currentEvent.value.time
  if (!rawTime) return ''
  return rawTime.split('(')[0].trim()
})

// Dynamic Organizer mapping
const eventOrganizer = computed(() => {
  const title = currentEvent.value.title
  if (!title) return 'Death Rock Star'
  
  if (title.includes('NOISE PARADE')) return 'Death Rock Star'
  if (title.includes('SOUTH SIDE')) return 'South Side Org'
  if (title.includes('UNDERCITY')) return 'Undercity Gigs'
  if (title.includes('METALCORE')) return 'Metalcore Indo'
  if (title.includes('INDIE POP')) return 'Indie Pop ID'
  if (title.includes('RETRO')) return 'Retro Club'
  if (title.includes('JAZZ')) return 'Jazz Garden'
  if (title.includes('HARDCORE')) return 'Hardcore Family'
  if (title.includes('PUNK')) return 'Punk Attack'
  if (title.includes('FOLK')) return 'Folk ID'
  if (title.includes('HIP HOP')) return 'PIK Collective'
  if (title.includes('ECHOES')) return 'East Collective'
  if (title.includes('SYNTHWAVE')) return 'Synthwave ID'
  if (title.includes('SUMMER')) return 'Blast Prod'
  if (title.includes('ACOUSTIC')) return 'Solo Acoustic'
  if (title.includes('POST-ROCK')) return 'Post-Rock Bandung'
  return 'Death Rock Star'
})

const getOrganizerLetter = computed(() => {
  return eventOrganizer.value.charAt(0)
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

// Find current event details
const currentEvent = computed(() => {
  return events.find(e => e.id === props.eventId) || events[0]
})

const isPastEvent = computed(() => {
  return currentEvent.value.date < BENCHMARK_DATE
})

// Lineup Carousel Data
const lineup = ref([
  { name: 'SILENT REVOLT', image: noiseImg },
  { name: 'BLACK SECTOR', image: southSideImg },
  { name: 'LAST TOMORROW', image: undercityImg },
  { name: 'AFTER HOURS', image: noiseImg }
])

// Rundown Timeline Data
const rundown = ref([
  { time: '18:00 WIB', activity: 'Doors Open' },
  { time: '19:00 WIB', activity: 'After Hours' },
  { time: '20:00 WIB', activity: 'Last Tomorrow' },
  { time: '21:15 WIB', activity: 'Black Sector' },
  { time: '22:30 WIB', activity: 'Silent Revolt' },
  { time: '23:00 WIB', activity: 'Event End' }
])

// Rules Data
const rules = ref([
  { icon: 'cross', text: 'Tiket yang sudah dibeli tidak dapat dikembalikan (non-refundable).' },
  { icon: 'info', text: 'Tiket hanya berlaku untuk satu kali masuk sesuai tanggal yang tertera.' },
  { icon: 'warning', text: 'Dilarang membawa senjata tajam, narkoba, minuman keras, dan benda berbahaya lainnya.' },
  { icon: 'warning', text: 'Dilarang melakukan perekaman audio & video tanpa izin dari penyelenggara.' },
  { icon: 'check', text: 'Dengan membeli tiket, kamu setuju untuk mengikuti semua peraturan yang berlaku.' }
])

// Ticket Tier selection counters
const ticketTiers = ref([
  { id: 'normal', name: 'GELOMBANG AWAL OTW NORMAL', price: 0, qty: 0, status: 'aktif' },
  { id: 'ramean', name: 'GELOMBANG RAMEAN (BUNDLING 4 ORANG)', price: 0, qty: 0, status: 'habis' },
  { id: 'vip', name: 'VIP ACCESS EXPERIENCE', price: 0, originalPrice: 0, discountLabel: '', qty: 0, status: 'aktif' }
])

const formatShortDate = (dateStr) => {
  if (!dateStr) return ''
  const dateObj = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`
}

// Reset ticket counters and adjust prices dynamically when active event changes
const initializeTickets = () => {
  const basePrice = currentEvent.value.price
  ticketTiers.value = [
    { id: 'normal', name: 'GELOMBANG AWAL OTW NORMAL', price: basePrice, qty: 0, status: 'aktif' },
    { id: 'ramean', name: 'GELOMBANG RAMEAN (BUNDLING 4 ORANG)', price: Math.round(basePrice * 0.75), qty: 0, status: 'habis' },
    { id: 'vip', name: 'VIP ACCESS EXPERIENCE', price: Math.round(basePrice * 1.2), originalPrice: Math.round(basePrice * 1.5), discountLabel: 'PROMO RILIS', qty: 0, status: 'aktif' }
  ]
}

watch(() => props.eventId, () => {
  initializeTickets()
  startCountdown()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}, { immediate: true })

const incrementQty = (tier) => {
  if (isPastEvent.value || tier.status === 'habis') return
  tier.qty++
}

const decrementQty = (tier) => {
  if (isPastEvent.value || tier.status === 'habis') return
  if (tier.qty > 0) tier.qty--
}

// Subtotal & Quantity calculation
const totalQty = computed(() => {
  return ticketTiers.value.reduce((acc, curr) => acc + curr.qty, 0)
})

const totalPrice = computed(() => {
  return ticketTiers.value.reduce((acc, curr) => acc + (curr.qty * curr.price), 0)
})

const formatPrice = (price) => {
  return price.toLocaleString('id-ID')
}

// Lineup carousel scroll logic
const lineupScrollRef = ref(null)
const scrollLineup = (direction) => {
  if (!lineupScrollRef.value) return
  const scrollAmt = 260
  lineupScrollRef.value.scrollBy({
    left: direction === 'left' ? -scrollAmt : scrollAmt,
    behavior: 'smooth'
  })
}

// Recommended Events logic (Shows 4 other events, excluding current one)
const recommendedEvents = computed(() => {
  return events.filter(e => e.id !== props.eventId).slice(0, 4)
})

const recommendedScrollRef = ref(null)
const scrollRecommended = (direction) => {
  if (!recommendedScrollRef.value) return
  const scrollAmt = 340
  recommendedScrollRef.value.scrollBy({
    left: direction === 'left' ? -scrollAmt : scrollAmt,
    behavior: 'smooth'
  })
}

// Bottom Sheet state for Mobile
const isBottomSheetOpen = ref(false)
const toggleBottomSheet = () => {
  if (isPastEvent.value) return
  isBottomSheetOpen.value = !isBottomSheetOpen.value
}

// Simpan Event / Save event toggle
const isSaved = ref(false)
const toggleSave = () => {
  isSaved.value = !isSaved.value
}

// Action button triggers
const handleOrderNow = () => {
  if (totalQty.value === 0) {
    alert('Silakan pilih minimal 1 tiket terlebih dahulu!')
    return
  }
  alert(`Checkout Simulasi Berhasil!\nTotal Pembelian: ${totalQty.value} Tiket\nTotal Harga: Rp ${formatPrice(totalPrice.value)}\n\nTerima kasih telah mendukung pergerakan musik! 🤘`)
  // Reset counters after order
  initializeTickets()
  isBottomSheetOpen.value = false
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  alert('Link detail event berhasil disalin ke clipboard!')
}

// Active tab state: 'deskripsi', 'tiket', or 'syarat'
const activeTab = ref('deskripsi')

// Minimum price starting from (PRESALE price, which is 75% of base price)
const startingPrice = computed(() => {
  return Math.round(currentEvent.value.price * 0.75)
})

// Scroll/Navigate to tickets tab
const scrollToTickets = () => {
  activeTab.value = 'tiket'
  setTimeout(() => {
    const tabsElement = document.querySelector('.event-detail-tabs-nav')
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 50)
}

// Chat simulator handler
const handleChatPenyelenggara = () => {
  alert(`Membuka Chat dengan Penyelenggara: ${eventOrganizer.value}\n\nFitur ini adalah simulasi chat untuk bertanya seputar event. 💬`)
}

// Sidebar accordion expansion states
const isSidebarInfoExpanded = ref(true)
const isSidebarVenueExpanded = ref(true)
const isSidebarShareExpanded = ref(true)

// Ticket card accordion expansion states
const expandedTicketTiers = ref({
  normal: true,
  ramean: false,
  vip: false
})

const toggleTicketTier = (tier) => {
  if (tier.status === 'habis' || isPastEvent.value) return
  expandedTicketTiers.value[tier.id] = !expandedTicketTiers.value[tier.id]
}
</script>

<template>
  <div class="event-detail-page">
    <div class="container">
      
      <!-- Breadcrumb Bar -->
      <!-- <nav class="breadcrumb-nav">
        <a href="#home">HOME</a>
        <span class="separator">&gt;</span>
        <a href="#events-page">EVENTS</a>
        <span class="separator">&gt;</span>
        <span class="active-crumb">{{ currentEvent.title }}</span>
      </nav> -->

      <!-- Hero Header Banner Section -->
      <header class="event-detail-hero" :style="{ backgroundImage: `url(${currentEvent.image})` }">
        <div class="hero-bg-overlay"></div>
        

        <div class="hero-content-inner">
          <!-- Top Row: Title on Left, Countdown on Right -->
          <div class="hero-top-row">
            <h1 class="hero-title-left">{{ currentEvent.title }}</h1>
            
            <!-- Countdown Timer -->
            <div class="countdown-widget">
              <span class="countdown-title">EVENT DIMULAI DALAM</span>
              <div class="countdown-timer">
                <div class="time-block">
                  <div class="time-number">{{ countdown.days }}</div>
                  <span class="time-label">HARI</span>
                </div>
                <span class="time-colon">:</span>
                <div class="time-block">
                  <div class="time-number">{{ countdown.hours }}</div>
                  <span class="time-label">JAM</span>
                </div>
                <span class="time-colon">:</span>
                <div class="time-block">
                  <div class="time-number">{{ countdown.minutes }}</div>
                  <span class="time-label">MENIT</span>
                </div>
                <span class="time-colon">:</span>
                <div class="time-block">
                  <div class="time-number">{{ countdown.seconds }}</div>
                  <span class="time-label">DETIK</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Content Split Layout -->
          <div class="hero-main-split">
            <!-- Left Side: Poster Image -->
            <div class="hero-poster-col">
              <div class="hero-poster-wrapper">
                <img :src="currentEvent.image" :alt="currentEvent.title" class="hero-poster-img" />
              </div>
            </div>
            
            <!-- Right Side: Info -->
            <div class="hero-info-col">
              <!-- Metadata List -->
              <div class="hero-meta-list">
                <!-- Date -->
                <div class="meta-item">
                  <svg class="meta-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div class="meta-content-block">
                    <span class="meta-title-bold">{{ formatEventDayAndDate(currentEvent.date) }}</span>
                    <span class="meta-subtitle-grey">{{ cleanTimeRange }}</span>
                  </div>
                </div>

                <!-- Venue Location -->
                <div class="meta-item">
                  <svg class="meta-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div class="meta-content-block">
                    <span class="meta-title-bold">{{ currentEvent.venue }}</span>
                    <span class="meta-subtitle-grey">{{ currentEvent.address }}</span>
                  </div>
                </div>

                <!-- Tags / Genre -->
                <div class="meta-item">
                  <svg class="meta-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.783-.57-.38-1.81.588-1.81h4.906a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <div class="meta-content-block">
                    <span class="meta-title-bold">{{ currentEvent.category }} • Musik</span>
                  </div>
                </div>
              </div>

              <!-- Organizer Profile Block -->
              <div class="organizer-profile-block">
                <div class="organizer-avatar-circle">
                  <span class="organizer-letter">{{ getOrganizerLetter }}</span>
                </div>
                <div class="organizer-text-info">
                  <span class="organizer-label">PENYELENGGARA</span>
                  <span class="organizer-name">{{ eventOrganizer }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Event Details Tabs Navigation -->
      <div class="event-detail-tabs-nav">
        <button 
          class="tab-nav-btn" 
          :class="{ active: activeTab === 'deskripsi' }" 
          @click="activeTab = 'deskripsi'"
        >
          DESKRIPSI
        </button>
        <button 
          class="tab-nav-btn" 
          :class="{ active: activeTab === 'tiket' }" 
          @click="activeTab = 'tiket'"
        >
          TIKET
        </button>
        <button 
          class="tab-nav-btn" 
          :class="{ active: activeTab === 'syarat' }" 
          @click="activeTab = 'syarat'"
        >
          <span class="desktop-tab-label">SYARAT & KETENTUAN</span>
          <span class="mobile-tab-label">S&K</span>
        </button>
      </div>

      <!-- Main Split Layout Columns -->
      <div class="detail-split-layout">
        
        <!-- Left Content Column (65%) -->
        <main class="detail-main-content">
          
          <!-- Tab Content: Deskripsi -->
          <div v-if="activeTab === 'deskripsi'" class="tab-content-pane">
            <!-- Tentang Event Section -->
            <section class="content-section">
              <h2 class="section-heading">TENTANG EVENT</h2>
              <p class="event-description-text">{{ currentEvent.desc }}</p>
            </section>

            <!-- Lineup Carousel Section -->
            <section class="content-section">
              <div class="section-header-row">
                <h2 class="section-heading">LINEUP</h2>
                <div class="carousel-nav-arrows">
                  <button class="nav-arrow" @click="scrollLineup('left')">&lt;</button>
                  <button class="nav-arrow" @click="scrollLineup('right')">&gt;</button>
                </div>
              </div>

              <div class="lineup-carousel-wrapper" ref="lineupScrollRef">
                <div v-for="artist in lineup" :key="artist.name" class="lineup-card">
                  <div class="artist-image-box">
                    <img :src="artist.image" :alt="artist.name" class="artist-img" />
                    <div class="artist-overlay"></div>
                  </div>
                  <span class="artist-name">{{ artist.name }}</span>
                </div>
              </div>
            </section>

            <!-- Jadwal Event (Rundown) Section -->
            <section class="content-section">
              <h2 class="section-heading">JADWAL EVENT</h2>
              
              <div class="rundown-timeline">
                <div v-for="(item, idx) in rundown" :key="idx" class="timeline-node">
                  <!-- Line indicator -->
                  <div class="node-line-indicator">
                    <div class="node-bullet"></div>
                    <div v-if="idx < rundown.length - 1" class="node-connecting-line"></div>
                  </div>
                  
                  <div class="node-content">
                    <span class="node-time">{{ item.time }}</span>
                    <span class="node-activity">{{ item.activity }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Tab Content: Tiket -->
          <div v-else-if="activeTab === 'tiket'" class="tab-content-pane">
            <section class="content-section main-ticket-selector">
              <h2 class="section-heading">PILIH TIKET</h2>
              
              <div class="ticket-list-stub-wrapper">
                <div 
                  v-for="tier in ticketTiers" 
                  :key="tier.id" 
                  class="ticket-card-mockup" 
                  :class="{ 
                    'is-expanded': expandedTicketTiers[tier.id], 
                    'is-sold-out': tier.status === 'habis' || isPastEvent 
                  }"
                >
                  
                  <!-- Card Header -->
                  <div 
                    class="ticket-card-header" 
                    :class="{ 'is-disabled': tier.status === 'habis' || isPastEvent }"
                    @click="toggleTicketTier(tier)"
                  >
                    <div class="header-left-col">
                      <h3 class="tier-title-mockup">{{ tier.name }}</h3>
                      <span class="tier-status-badge" :class="{ 'sold-out': tier.status === 'habis' || isPastEvent }">
                        {{ (tier.status === 'habis' || isPastEvent) ? '• TIKET HABIS' : '• PENJUALAN BERLANGSUNG' }}
                      </span>
                    </div>
                    
                    <div class="header-mid-divider"></div>
                    
                    <div class="header-right-col">
                      <div class="header-price-info">
                        <span class="price-lbl">Harga</span>
                        <div class="price-details-stack">
                          <div v-if="tier.originalPrice" class="discount-meta-row">
                            <span class="original-price">Rp {{ formatPrice(tier.originalPrice) }}</span>
                            <span class="discount-tag">{{ tier.discountLabel }}</span>
                          </div>
                          <span class="price-val">Rp {{ formatPrice(tier.price) }}</span>
                        </div>
                      </div>
                      <svg class="chevron-expand-icon" :class="{ rotated: expandedTicketTiers[tier.id] }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <!-- Collapsible Content -->
                  <transition name="accordion-slide">
                    <div v-show="expandedTicketTiers[tier.id]" class="ticket-card-body">
                      <!-- TANGGAL EVENT -->
                      <div class="body-info-section">
                        <span class="info-section-title">TANGGAL EVENT</span>
                        <div class="info-date-row">
                          <!-- Calendar Icon -->
                          <div class="calendar-icon-block">
                            <span class="cal-month">{{ currentEvent.month }}</span>
                            <span class="cal-day">{{ currentEvent.day }}</span>
                          </div>
                          <span class="cal-desc-text">Masa berlaku: {{ formatShortDate(currentEvent.date) }}</span>
                        </div>
                      </div>

                      <!-- INFORMASI TIKET -->
                      <div class="body-info-section">
                        <span class="info-section-title">INFORMASI TIKET</span>
                        <div class="info-bullets-row">
                          <div class="bullet-item">
                            <svg class="bullet-icon cross" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Tidak Bisa Refund</span>
                          </div>
                          <div class="bullet-item">
                            <svg class="bullet-icon check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Konfirmasi Instan</span>
                          </div>
                          <div class="bullet-item">
                            <svg class="bullet-icon tax" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Termasuk Pajak 10%</span>
                          </div>
                        </div>
                      </div>

                      <!-- DESKRIPSI TIKET -->
                      <div class="body-info-section">
                        <span class="info-section-title">DESKRIPSI TIKET</span>
                        <p class="ticket-description-para">
                          Tiket reguler untuk akses {{ currentEvent.title }} kategori {{ tier.name }}. Nikmati pertunjukan audio-visual spektakuler dan dukung pergerakan musik independen lokal!
                        </p>
                      </div>

                      <!-- BENEFIT -->
                      <div class="body-info-section">
                        <span class="info-section-title">BENEFIT</span>
                        <div class="benefits-list">
                          <div class="benefit-bullet">
                            <svg class="benefit-check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Akses masuk konser</span>
                          </div>
                          <div class="benefit-bullet">
                            <svg class="benefit-check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Area festival (standing)</span>
                          </div>
                          <div class="benefit-bullet">
                            <svg class="benefit-check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Akses ke booth merchandise resmi</span>
                          </div>
                          <div class="benefit-bullet">
                            <svg class="benefit-check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Tidak termasuk meet & greet artis</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>

                  <!-- Card Footer -->
                  <div class="ticket-card-footer">
                    <!-- Date info (grid-area: date) -->
                    <div class="footer-left-col">
                      <span class="footer-label">BERAKHIR PADA</span>
                      <span class="footer-time">{{ formatShortDate(currentEvent.date) }}, 22:00 WIB</span>
                    </div>
                    
                    <!-- Action Button/Stepper (grid-area: action) -->
                    <button 
                      v-if="tier.qty === 0 && tier.status !== 'habis' && !isPastEvent"
                      class="btn-add-ticket"
                      @click="incrementQty(tier)"
                    >
                      + Tambah
                    </button>
                    <button 
                      v-else-if="tier.status === 'habis' || isPastEvent"
                      class="btn-sold-out-ticket"
                      disabled
                    >
                      Habis
                    </button>
                    <div v-else class="tier-stepper-mockup">
                      <button class="step-btn-mock minus" @click="decrementQty(tier)">-</button>
                      <span class="step-qty-mock">{{ tier.qty }}</span>
                      <button class="step-btn-mock plus" @click="incrementQty(tier)">+</button>
                    </div>
                    
                    <!-- Total price details (grid-area: total) -->
                    <div class="footer-total-price-box">
                      <span class="total-pax-lbl">Total ({{ tier.qty }} pax)</span>
                      <span class="total-amount-lbl">Rp {{ formatPrice(tier.qty * tier.price) }}</span>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </div>

          <!-- Tab Content: Syarat & Ketentuan -->
          <div v-else-if="activeTab === 'syarat'" class="tab-content-pane">
            <section class="content-section">
              <h2 class="section-heading">SYARAT & KETENTUAN</h2>
              
              <ul class="event-rules-list">
                <li v-for="(rule, idx) in rules" :key="idx" class="rule-item">
                  <div class="rule-icon-box" :class="rule.icon">
                    <!-- Check Icon -->
                    <svg v-if="rule.icon === 'check'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="rule-svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <!-- Cross Icon -->
                    <svg v-else-if="rule.icon === 'cross'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="rule-svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <!-- Warning/Info Icon -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="rule-svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <span class="rule-text">{{ rule.text }}</span>
                </li>
              </ul>
            </section>
          </div>
        </main>

        <!-- Right Sidebar Actions Column (35%) -->
        <aside class="detail-sidebar-actions">
          
          <!-- Module Info Harga & Navigasi Tiket Container -->
          <div class="sidebar-block ticket-price-info-module" :class="{ 'hide-on-mobile-tiket': activeTab === 'tiket' }">
            <h3 class="sidebar-block-title collapsible-header" @click="isSidebarInfoExpanded = !isSidebarInfoExpanded">
              <span>{{ activeTab === 'tiket' ? 'RINGKASAN PESANAN' : 'INFO EVENT' }}</span>
              <svg class="chevron-icon" :class="{ rotated: !isSidebarInfoExpanded }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </h3>
            
            <transition name="accordion-slide">
              <div v-show="isSidebarInfoExpanded" class="sidebar-block-content">
                
                <!-- Condition: TIKET TAB (Order Summary) -->
                <div v-if="activeTab === 'tiket'" class="order-summary-box">
                  <!-- Selected Items List -->
                  <div class="summary-items-list">
                    <template v-if="totalQty > 0">
                      <div v-for="tier in ticketTiers" :key="tier.id">
                        <div v-if="tier.qty > 0" class="summary-item-row">
                          <div class="item-name-qty">
                            <span class="item-name">{{ tier.name }}</span>
                            <span class="item-qty">x{{ tier.qty }}</span>
                          </div>
                          <span class="item-subtotal">Rp {{ formatPrice(tier.qty * tier.price) }}</span>
                        </div>
                      </div>
                    </template>
                    <div v-else class="summary-empty-state">
                      Belum ada tiket yang dipilih. Silakan pilih tiket di samping.
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="summary-divider"></div>

                  <!-- Total Price -->
                  <div class="summary-total-row">
                    <div class="total-lbl-stack">
                      <span class="total-main-lbl">TOTAL PEMBAYARAN</span>
                      <span class="total-sub-lbl">({{ totalQty }} Tiket)</span>
                    </div>
                    <span class="total-price-val">Rp {{ formatPrice(totalPrice) }}</span>
                  </div>

                  
                </div>

                <!-- Condition: DESKRIPSI or SYARAT TAB (Info Event starting price & Lihat Tiket) -->
                <div v-else class="info-event-original-box">
                  <div class="starting-price-box">
                    <span class="price-label">HARGA MULAI DARI</span>
                    <span class="price-amount">Rp {{ formatPrice(startingPrice) }}</span>
                  </div>

                  <!-- Call to Actions -->
                  <div class="sidebar-buttons-group">
                    <transition name="fade-slide">
                      <button 
                        class="btn-primary-checkout" 
                        @click="scrollToTickets"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="btn-icon">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span>LIHAT TIKET</span>
                      </button>
                    </transition>

                    <div class="secondary-actions-row">
                      <button class="btn-secondary-chat" @click="handleChatPenyelenggara">
                        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>CHAT</span>
                      </button>
                      
                      <button class="btn-secondary-save-half" @click="toggleSave">
                        <svg class="btn-icon" :class="{ 'is-saved': isSaved }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span>{{ isSaved ? 'TERSIMPAN' : 'SIMPAN' }}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </transition>
          </div>

          <!-- Module Informasi Venue Container -->
          <div class="sidebar-block venue-info-module" v-if="activeTab !== 'tiket'">
            <h3 class="sidebar-block-title collapsible-header" @click="isSidebarVenueExpanded = !isSidebarVenueExpanded">
              <span>INFORMASI VENUE</span>
              <svg class="chevron-icon" :class="{ rotated: !isSidebarVenueExpanded }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </h3>
            
            <transition name="accordion-slide">
              <div v-show="isSidebarVenueExpanded" class="sidebar-block-content">
                <div class="venue-detail-box">
                  <div class="venue-meta">
                    <svg class="venue-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="venue-address-block">
                      <span class="venue-title">{{ currentEvent.venue }}</span>
                      <p class="venue-description">{{ currentEvent.address }}</p>
                    </div>
                  </div>
                  
                  <a href="https://maps.google.com" target="_blank" class="btn-view-map">LIHAT PETA</a>
                </div>
              </div>
            </transition>
          </div>

          <!-- Module Bagikan Event Container -->
          <div class="sidebar-block share-event-module">
            <h3 class="sidebar-block-title collapsible-header" @click="isSidebarShareExpanded = !isSidebarShareExpanded">
              <span>BAGIKAN EVENT</span>
              <svg class="chevron-icon" :class="{ rotated: !isSidebarShareExpanded }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </h3>
            
            <transition name="accordion-slide">
              <div v-show="isSidebarShareExpanded" class="sidebar-block-content">
                <div class="social-share-buttons">
                  <!-- WhatsApp -->
                  <a href="https://api.whatsapp.com" target="_blank" class="share-circle-btn" aria-label="Share on WhatsApp">
                    <svg class="share-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.963 3.41 1.472 5.358 1.473 5.485.002 9.948-4.468 9.95-9.96.001-2.66-1.037-5.163-2.92-7.05-1.884-1.889-4.387-2.93-7.054-2.932-5.489 0-9.956 4.462-9.959 9.95-.001 1.83.479 3.619 1.39 5.215L2.392 21.66l6.255-1.642zm9.961-6.732c-.324-.162-1.92-.949-2.217-1.058-.297-.108-.513-.162-.73.162-.216.324-.838 1.058-1.027 1.274-.19.216-.378.243-.702.081-.324-.162-1.37-.505-2.61-1.611-.963-.859-1.613-1.921-1.802-2.246-.19-.324-.02-.5-.181-.661-.146-.146-.324-.378-.486-.568-.162-.19-.216-.324-.324-.541-.108-.216-.055-.405-.027-.567.027-.162.216-.513.324-.676.108-.162.162-.27.243-.459.081-.189.041-.351-.014-.513-.054-.162-.513-1.243-.703-1.702-.186-.445-.373-.385-.513-.392-.132-.007-.284-.008-.436-.008-.152 0-.401.057-.611.286-.21.23-.8.784-.8 1.91 0 1.126.82 2.215.933 2.368.113.152 1.612 2.463 3.908 3.45.546.235.973.376 1.306.481.549.174 1.049.15 1.444.09.44-.067 1.92-.784 2.19-1.541.27-.756.27-1.405.189-1.541-.081-.136-.297-.216-.622-.378z"/>
                  </svg>
                  </a>
                  
                  <!-- Twitter -->
                  <a href="https://twitter.com" target="_blank" class="share-circle-btn" aria-label="Share on Twitter">
                    <svg class="share-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  
                  <!-- Facebook -->
                  <a href="https://facebook.com" target="_blank" class="share-circle-btn" aria-label="Share on Facebook">
                    <svg class="share-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  <!-- Copy Link -->
                  <button class="share-circle-btn" @click="copyLink" aria-label="Salin tautan event">
                    <svg class="share-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </transition>
          </div>

        </aside>
      </div>

      <!-- Recommendation section at bottom -->
      <section class="recommended-events-section content-section">
        <div class="section-header-row">
          <h2 class="section-heading">EVENT LAINNYA</h2>
          <div class="carousel-nav-arrows">
            <button class="nav-arrow" @click="scrollRecommended('left')">&lt;</button>
            <button class="nav-arrow" @click="scrollRecommended('right')">&gt;</button>
          </div>
        </div>

        <div class="recommended-slider-container" ref="recommendedScrollRef">
          <a v-for="rec in recommendedEvents" :key="rec.id" :href="'#event-detail-' + rec.id" class="rec-event-card">
            <div class="rec-card-image-box">
              <img :src="rec.image" :alt="rec.title" class="rec-card-img" />
              <div class="rec-badge-overlay">
                <span class="rec-badge">{{ rec.category }}</span>
              </div>
            </div>
            
            <div class="rec-card-details">
              <span class="rec-location">{{ rec.location }}</span>
              <h4 class="rec-title">{{ rec.title }}</h4>
              <div class="rec-meta">
                <svg class="rec-meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ rec.day }} {{ rec.month }} {{ rec.year }}</span>
              </div>
              <div class="rec-price">Rp {{ formatPrice(rec.price) }}</div>
            </div>
          </a>
        </div>
      </section>

    </div>

    <!-- Bottom Sheet Drawer backdrop -->
    <transition name="fade">
      <div v-if="isBottomSheetOpen" class="bottom-sheet-backdrop" @click="isBottomSheetOpen = false"></div>
    </transition>

    <!-- Bottom Sheet Drawer panel -->
    <transition name="slide-up">
      <div v-if="isBottomSheetOpen" class="bottom-sheet-drawer">
        <div class="drawer-header">
          <h4 class="drawer-title">RINGKASAN PESANAN</h4>
          <button class="drawer-close-btn" @click="isBottomSheetOpen = false">&times;</button>
        </div>
        
        <div class="drawer-body">
          <div class="order-summary-box">
            <!-- Selected Items List -->
            <div class="summary-items-list">
              <template v-if="totalQty > 0">
                <div v-for="tier in ticketTiers" :key="tier.id">
                  <div v-if="tier.qty > 0" class="summary-item-row">
                    <div class="item-name-qty">
                      <span class="item-name">{{ tier.name }}</span>
                      <span class="item-qty">x{{ tier.qty }}</span>
                    </div>
                    <span class="item-subtotal">Rp {{ formatPrice(tier.qty * tier.price) }}</span>
                  </div>
                </div>
              </template>
              <div v-else class="summary-empty-state">
                Belum ada tiket yang dipilih.
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Universal Sticky Bottom Bar -->
    <div class="event-detail-bottom-bar" v-if="!isPastEvent">
      <div class="container bottom-bar-container">
        
        <!-- Desktop Layout -->
        <div class="bottom-bar-desktop-only">
          <div class="bottom-bar-left">
            <span class="bottom-bar-price-label">
              {{ activeTab === 'tiket' ? `HARGA (${totalQty}) TIKET` : 'HARGA MULAI DARI' }}
            </span>
            <span class="bottom-bar-price-amount">
              Rp {{ formatPrice(activeTab === 'tiket' ? totalPrice : startingPrice) }}
            </span>
          </div>
          <div class="bottom-bar-right">
            <button 
              v-if="activeTab === 'deskripsi' || activeTab === 'syarat'"
              class="btn-bottom-action btn-lihat-tiket" 
              @click="scrollToTickets"
            >
              LIHAT TIKET
            </button>
            <button 
              v-else-if="activeTab === 'tiket'"
              class="btn-bottom-action btn-beli-tiket" 
              @click="handleOrderNow"
            >
              BELI TIKET
            </button>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="bottom-bar-mobile-only">
          <!-- Simple info bottom bar if not ticket tab -->
          <div v-if="activeTab !== 'tiket'" class="mobile-simple-bar">
            <div class="bottom-bar-left">
              <span class="bottom-bar-price-label">HARGA MULAI DARI</span>
              <span class="bottom-bar-price-amount">Rp {{ formatPrice(startingPrice) }}</span>
            </div>
            <button class="btn-bottom-action btn-lihat-tiket" @click="scrollToTickets">
              LIHAT TIKET
            </button>
          </div>

          <!-- Ticket selection bottom bar with two rows -->
          <div v-else class="mobile-checkout-bar">
            <div class="checkout-bar-row-top">
              <div class="bar-price-stack">
                <span class="bar-price-lbl">TOTAL HARGA</span>
                <span class="bar-price-val">Rp {{ formatPrice(totalPrice) }}</span>
              </div>
              <button class="btn-detail-toggle" @click="toggleBottomSheet">
                <span>({{ totalQty }}) Detail</span>
                <span class="caret-icon">{{ isBottomSheetOpen ? '▼' : '▲' }}</span>
              </button>
            </div>
            <div class="checkout-bar-row-bottom">
              <button class="btn-beli-sekarang" @click="handleOrderNow" :disabled="totalQty === 0">
                Beli Tiket Sekarang
              </button>
              <button class="btn-chat-mobile" @click="handleChatPenyelenggara">
                <svg class="chat-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.event-detail-page {
  background-color: #0B0B0B;
  color: #FFFFFF;
  padding: 8rem 0 10rem 0; /* Add bottom padding to prevent bottom bar from overlapping content */
  min-height: 100vh;
  text-align: left;
}

/* ========================================== */
/* BREADCRUMB BAR                             */
/* ========================================== */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #999999;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
}

.breadcrumb-nav a {
  color: #999999;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-nav a:hover {
  color: #FFFFFF;
}

.separator {
  color: #444444;
  user-select: none;
}

.active-crumb {
  color: #FFFFFF;
}

/* ========================================== */
/* HERO BANNER SECTION                        */
/* ========================================== */
.event-detail-hero {
  position: relative;
  width: 100vw;
  left: 50%;
  transform: translateX(-50%);
  margin-top: -8rem; /* offset parent padding-top */
  background-size: cover;
  background-position: center;
  border-radius: 0;
  overflow: hidden;
  padding: 6rem 10% 5rem 10%;
  margin-bottom: 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  text-align: left;
}

.hero-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  z-index: 1;
}

.hero-content-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.hero-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  gap: 2rem;
}

.hero-fav-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.25s ease;
}

.hero-fav-btn:hover {
  transform: scale(1.08);
  background-color: #FFFFFF;
  color: #000000;
}

.hero-fav-btn:hover .heart-icon {
  stroke: #000000;
}

.heart-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: transparent;
  transition: fill 0.25s ease, stroke 0.25s ease;
}

.heart-icon.is-saved {
  fill: #FF3B30 !important;
  stroke: #FF3B30 !important;
}

.hero-title-left {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 900;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.2;
}

.hero-main-split {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.hero-poster-col {
  flex: 2.0; /* make image banner wider */
  display: flex;
}

.hero-poster-wrapper {
  width: 100%;
  aspect-ratio: 2.9 / 1; /* make poster slightly taller at the bottom */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #0B0B0B;
}

.hero-poster-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.hero-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* COUNTDOWN WIDGET */
.countdown-widget {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 0.2rem;
  transform: translateY(6px);
}

.countdown-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #8E8E8E;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
}

.countdown-timer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 44px;
}

.time-number {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 800;
  width: 44px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.time-colon {
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 12px;
}

.time-label {
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #8E8E8E;
  margin-top: 0.35rem;
  text-transform: uppercase;
}

/* METADATA ITEMS LIST */
.hero-meta-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  font-size: 0.95rem;
  color: #999999;
}

.meta-icon-svg {
  width: 20px;
  height: 20px;
  color: #FFFFFF;
  flex-shrink: 0;
  margin-top: 2px;
}

.meta-content-block {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.meta-title-bold {
  color: #FFFFFF;
  font-weight: 700;
  font-size: 0.95rem;
}

.meta-subtitle-grey {
  font-size: 0.8rem;
  color: #999999;
  margin-top: 2px;
}

.organizer-profile-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 0;
}

.organizer-avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #2b1d1d;
  border: 1px solid #c5a880;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.organizer-letter {
  color: #c5a880;
  font-family: Georgia, serif;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
  text-transform: uppercase;
}

.organizer-text-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.organizer-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #8E8E8E;
  text-transform: uppercase;
}

.organizer-name {
  font-size: 0.9rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-top: 2px;
}

/* ========================================== */
/* SPLIT LAYOUT                               */
/* ========================================== */
.detail-split-layout {
  display: flex;
  gap: 3.5rem;
  align-items: flex-start;
  margin-bottom: 5rem;
}

.detail-main-content {
  width: 63%;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

.detail-sidebar-actions {
  width: 37%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: sticky;
  top: 110px; /* offset navbar height */
}

/* ========================================== */
/* SECTION COMMON STYLES                      */
/* ========================================== */
.content-section {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.section-heading {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #FFFFFF;
  margin: 0 0 1.5rem 0;
  position: relative;
  padding-bottom: 0.6rem;
}

.section-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: #FFFFFF;
}

.event-description-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #999999;
  margin: 0;
}

/* ========================================== */
/* LINEUP CAROUSEL                            */
/* ========================================== */
.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.carousel-nav-arrows {
  display: flex;
  gap: 0.5rem;
}

.nav-arrow {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.nav-arrow:hover {
  border-color: #FFFFFF;
  background-color: #FFFFFF;
  color: #000000;
}

.lineup-carousel-wrapper {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.lineup-carousel-wrapper::-webkit-scrollbar {
  height: 4px;
}

.lineup-carousel-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}

.lineup-card {
  flex-shrink: 0;
  width: 170px;
  background-color: #141414;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.25s ease;
}

.lineup-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.1);
}

.artist-image-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #0B0B0B;
  overflow: hidden;
}

.artist-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.1) brightness(0.75);
}

.artist-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(11, 11, 11, 0) 50%, #141414 100%);
}

.artist-name {
  display: block;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #FFFFFF;
  text-align: center;
  padding: 0.85rem 0.5rem;
}

/* ========================================== */
/* VERTICAL TIMELINE                          */
/* ========================================== */
.rundown-timeline {
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
}

.timeline-node {
  display: flex;
  gap: 1.5rem;
}

.node-line-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 16px;
}

.node-bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #FFFFFF;
  border: 2px solid #0B0B0B;
  box-shadow: 0 0 0 2px #FFFFFF;
  z-index: 2;
}

.node-connecting-line {
  width: 2px;
  background-color: rgba(255, 255, 255, 0.15);
  flex-grow: 1;
  margin: 4px 0;
}

.node-content {
  display: flex;
  gap: 1.5rem;
  padding-bottom: 2rem;
  font-size: 0.9rem;
}

.node-time {
  font-family: var(--font-body);
  font-weight: 700;
  color: #FFFFFF;
  width: 80px;
  flex-shrink: 0;
}

.node-activity {
  color: #999999;
  font-weight: 500;
}

.timeline-node:last-child .node-content {
  padding-bottom: 0.5rem;
}

/* ========================================== */
/* ATURAN EVENT                               */
/* ========================================== */
.event-rules-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background-color: #141414;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.rule-icon-box {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rule-icon-box.check {
  background-color: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
}

.rule-icon-box.cross {
  background-color: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

.rule-icon-box.warning {
  background-color: rgba(241, 196, 15, 0.15);
  color: #f1c40f;
}

.rule-icon-box.info {
  background-color: rgba(52, 152, 219, 0.15);
  color: #3498db;
}

.rule-svg {
  width: 14px;
  height: 14px;
}

.rule-text {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #999999;
}

/* ========================================== */
/* SIDEBAR BLOCKS                             */
/* ========================================== */
.sidebar-block {
  background-color: #141414;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.03);
  text-align: left;
}

.sidebar-block-title {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #FFFFFF;
  margin: 0 0 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
}

/* ========================================== */
/* PILIH TIKET MODULE                         */
/* ========================================== */
.ticket-tiers-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.ticket-tier-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  transition: all 0.2s ease;
}

.ticket-tier-item:hover {
  border-color: rgba(255, 255, 255, 0.08);
  background-color: rgba(255, 255, 255, 0.03);
}

.tier-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tier-name {
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #999999;
}

.tier-price {
  font-size: 1.05rem;
  font-weight: 800;
  color: #FFFFFF;
}

.tier-label {
  font-size: 0.65rem;
  color: #e74c3c;
  font-weight: 700;
}

.tier-stepper {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background-color: #0c0c0c;
  overflow: hidden;
}

.step-btn {
  background: none;
  border: none;
  color: #FFFFFF;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.step-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.08);
}

.step-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.step-qty {
  width: 32px;
  text-align: center;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.85rem;
  color: #FFFFFF;
  user-select: none;
}

.ticket-summary-panel {
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  padding: 1.25rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.85rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: #999999;
}

.total-price-row {
  color: #FFFFFF;
  font-weight: 800;
  font-size: 1rem;
}

.sidebar-buttons-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary-checkout {
  width: 100%;
  background-color: #FFFFFF;
  color: #000000;
  border: none;
  padding: 1rem;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.25s ease;
}

.btn-primary-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.25);
}

.btn-primary-checkout:disabled {
  background-color: #222222;
  color: #555555;
  cursor: not-allowed;
}

.btn-secondary-save {
  width: 100%;
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1rem;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.25s ease;
}

.btn-secondary-save:hover {
  border-color: #FFFFFF;
  background-color: rgba(255, 255, 255, 0.02);
}

/* ========================================== */
/* TABS NAVIGATION STYLES                     */
/* ========================================== */
.event-detail-tabs-nav {
  position: sticky;
  top: 90px;
  z-index: 99;
  background-color: #0B0B0B;
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 2.5rem;
  padding-bottom: 0.2rem;
}

.tab-nav-btn {
  background: none;
  border: none;
  color: #8E8E8E;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
  padding: 1rem 0;
  position: relative;
  transition: color 0.25s ease;
}

.mobile-tab-label {
  display: none;
}

.desktop-tab-label {
  display: inline;
}

.tab-nav-btn:hover {
  color: #FFFFFF;
}

.tab-nav-btn.active {
  color: #FFFFFF;
}

.tab-nav-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #FFFFFF;
}

/* ========================================== */
/* SIDEBAR PRICE BANNER & ACTIONS             */
/* ========================================== */
.starting-price-box {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 1.25rem;
  text-align: left;
}

.price-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #8E8E8E;
}

.price-amount {
  font-size: 1.6rem;
  font-weight: 900;
  color: #FFFFFF;
  font-family: var(--font-body);
}

.secondary-actions-row {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.btn-secondary-chat {
  flex: 1;
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1rem;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.25s ease;
}

.btn-secondary-chat:hover {
  border-color: #FFFFFF;
  background-color: rgba(255, 255, 255, 0.02);
}

.btn-secondary-save-half {
  flex: 1;
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1rem;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.25s ease;
}

.btn-secondary-save-half:hover {
  border-color: #FFFFFF;
  background-color: rgba(255, 255, 255, 0.02);
}

.checkout-actions-main {
  margin-top: 1.5rem;
}

.main-ticket-selector {
  background-color: #141414;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-icon.is-saved {
  fill: #FF3B30 !important;
  stroke: #FF3B30 !important;
}

/* ========================================== */
/* VENUE INFO MODULE                          */
/* ========================================== */
.venue-detail-box {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.venue-icon {
  width: 18px;
  height: 18px;
  color: #8E8E8E;
  margin-top: 3px;
  flex-shrink: 0;
}

.venue-address-block {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.venue-title {
  font-weight: 800;
  font-size: 0.9rem;
  color: #FFFFFF;
}

.venue-description {
  font-size: 0.8rem;
  color: #999999;
  margin-top: 0.25rem;
  line-height: 1.5;
  margin-bottom: 0;
}

.btn-view-map {
  display: block;
  width: 100%;
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.85rem;
  font-weight: 700;
  font-size: 0.75rem;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-view-map:hover {
  border-color: #FFFFFF;
  background-color: rgba(255, 255, 255, 0.02);
}

/* ========================================== */
/* SHARE EVENT MODULE                         */
/* ========================================== */
.social-share-buttons {
  display: flex;
  gap: 0.75rem;
}

.share-circle-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
}

.share-circle-btn:hover {
  border-color: #FFFFFF;
  color: #FFFFFF;
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.share-icon-svg {
  width: 16px;
  height: 16px;
}

/* ========================================== */
/* EVENT LAINNYA RECOMMENDATIONS              */
/* ========================================== */
.recommended-events-section {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 4rem;
  margin-top: 2rem;
}

.recommended-slider-container {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 1rem;
  -webkit-overflow-scrolling: touch;
}

.recommended-slider-container::-webkit-scrollbar {
  height: 6px;
}

.recommended-slider-container::-webkit-scrollbar-track {
  background: #0B0B0B;
}

.recommended-slider-container::-webkit-scrollbar-thumb {
  background: #222;
  border-radius: 3px;
}

.rec-event-card {
  flex-shrink: 0;
  width: 320px;
  background-color: #141414;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.03);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.rec-event-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8);
}

.rec-card-image-box {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: #0B0B0B;
}

.rec-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.1) brightness(0.8);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.rec-event-card:hover .rec-card-img {
  transform: scale(1.05);
}

.rec-badge-overlay {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
}

.rec-badge {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 3px 6px;
  border: 1px solid #FFFFFF;
  color: #FFFFFF;
  background: rgba(11, 11, 11, 0.85);
}

.rec-card-details {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.rec-location {
  font-size: 0.7rem;
  font-weight: 700;
  color: #8E8E8E;
  text-transform: uppercase;
}

.rec-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 900;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.3;
  text-transform: uppercase;
}

.rec-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #8E8E8E;
}

.rec-meta-icon {
  width: 14px;
  height: 14px;
  color: #8E8E8E;
}

.rec-price {
  font-size: 0.95rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-top: 0.25rem;
}

/* ========================================== */
/* UNIVERSAL STICKY BOTTOM BAR STYLES        */
/* ========================================== */
.event-detail-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.85rem 0;
  z-index: 999;
}

.bottom-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom-bar-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.bottom-bar-price-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #8E8E8E;
}

.bottom-bar-price-amount {
  font-size: 1.25rem;
  font-weight: 900;
  color: #FFFFFF;
  font-family: var(--font-body);
  margin-top: 2px;
}

.btn-bottom-action {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-lihat-tiket {
  background-color: transparent;
  color: #FFFFFF;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
}

.btn-lihat-tiket:hover {
  background-color: #FFFFFF;
  color: #000000;
  border-color: #FFFFFF;
  transform: translateY(-2px);
}

.btn-beli-tiket {
  background-color: #FFFFFF;
  color: #000000;
  border: none;
  font-weight: 900;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);
}

.btn-beli-tiket:hover:not(:disabled) {
  background-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.25);
}

.btn-beli-tiket:disabled {
  background-color: #222222;
  color: #555555;
  cursor: not-allowed;
  box-shadow: none;
}

/* ========================================== */
/* TICKET CARD STUB STYLES                    */
/* ========================================== */
.ticket-list-stub-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.ticket-card-mockup {
  position: relative;
  background-color: #1E1E1E;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: visible;
  color: #FFFFFF;
}

.ticket-card-mockup:hover:not(.is-sold-out) {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.15);
}

.ticket-card-mockup.is-sold-out {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.04);
  cursor: not-allowed;
}

/* Header */
.ticket-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.25rem;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.ticket-card-header.is-disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.header-left-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  text-align: left;
  flex: 1;
  min-width: 0;
}

.header-mid-divider {
  display: none;
}

.tier-title-mockup {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.tier-status-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: #00A389;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background-color: #E6F8F5;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 0.25rem;
}

.tier-status-badge.sold-out {
  color: #D32F2F;
  background-color: #FDF2F2;
}

.header-right-col {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding-left: 1.5rem;
}

.header-price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.price-lbl {
  font-size: 0.65rem;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.price-details-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.discount-meta-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 2px;
}

.original-price {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: line-through;
  font-weight: 500;
}

.discount-tag {
  font-size: 0.6rem;
  font-weight: 800;
  color: #D32F2F;
  background-color: #FDF2F2;
  padding: 1px 4px;
  border-radius: 3px;
  text-transform: uppercase;
}

.price-val {
  font-size: 1.5rem;
  font-weight: 900;
  color: #FFFFFF;
  margin-top: 1px;
  font-family: var(--font-body);
}

.chevron-expand-icon {
  width: 18px;
  height: 18px;
  color: #9CA3AF;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chevron-expand-icon.rotated {
  transform: rotate(-180deg);
}

/* Collapsible Body */
.ticket-card-body {
  padding: 0 2.25rem 1.75rem 2.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.75rem;
}

.body-info-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  text-align: left;
}

.body-info-section:last-of-type {
  margin-bottom: 0;
}

.info-section-title {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #9CA3AF;
  margin-bottom: 0.6rem;
  text-transform: uppercase;
}

/* Date Row */
.info-date-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Tear-off calendar icon */
.calendar-icon-block {
  display: flex;
  flex-direction: column;
  width: 44px;
  height: 48px;
  background-color: #1E1E1E;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.cal-month {
  background-color: rgba(255, 255, 255, 0.05);
  color: #9CA3AF;
  font-size: 0.6rem;
  font-weight: 800;
  text-align: center;
  padding: 2px 0;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cal-day {
  color: #FFFFFF;
  font-size: 1.15rem;
  font-weight: 900;
  text-align: center;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background-color: #1E1E1E;
}

.cal-desc-text {
  font-size: 0.9rem;
  color: #FFFFFF;
  font-weight: 700;
}

/* Bullet Items */
.info-bullets-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.bullet-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #9CA3AF;
  font-weight: 500;
}

.bullet-icon {
  width: 15px;
  height: 15px;
  color: #9CA3AF;
  flex-shrink: 0;
}

/* Description Para */
.ticket-description-para {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #9CA3AF;
  margin: 0;
}

/* Benefits list */
.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.benefit-bullet {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: #9CA3AF;
  font-weight: 500;
}

.benefit-check {
  width: 14px;
  height: 14px;
  color: #c5a880;
  flex-shrink: 0;
}

/* Card Footer - structured using CSS Grid */
.ticket-card-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: 
    "date action"
    "date total";
  align-items: center;
  gap: 0.5rem 2.25rem;
  padding: 1.5rem 2.25rem;
  background-color: #1E1E1E;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  position: relative;
}

/* Notches positioned exactly on the dashed separator line */
.ticket-card-footer::before {
  content: '';
  position: absolute;
  left: -13px;
  top: 0;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  background-color: #0B0B0B;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
  z-index: 5;
}

.ticket-card-footer::after {
  content: '';
  position: absolute;
  right: -13px;
  top: 0;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  background-color: #0B0B0B;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
  z-index: 5;
}

.footer-left-col {
  grid-area: date;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.footer-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #9CA3AF;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.footer-time {
  font-size: 0.9rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-top: 4px;
}

.btn-add-ticket, .btn-sold-out-ticket, .tier-stepper-mockup {
  grid-area: action;
  justify-self: end;
}

/* TAMBAH Button - matching dark brown accent */
.btn-add-ticket {
  background-color: #2E1A16;
  color: #FFFFFF;
  border: 1px solid #2E1A16;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.6rem 1.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-smooth);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.btn-add-ticket:hover {
  background-color: transparent;
  color: #FFFFFF;
  border-color: #FFFFFF;
}

/* Sold Out / Habis Button */
.btn-sold-out-ticket {
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  border: none;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.6rem 1.75rem;
  border-radius: 8px;
  cursor: not-allowed;
}

/* Mockup Stepper */
.tier-stepper-mockup {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background-color: #1E1E1E;
  overflow: hidden;
}

.step-btn-mock {
  background: none;
  border: none;
  color: #FFFFFF;
  width: 32px;
  height: 32px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.step-btn-mock:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.step-qty-mock {
  width: 32px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 800;
  color: #FFFFFF;
  user-select: none;
}

/* Total text in footer */
.footer-total-price-box {
  grid-area: total;
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  margin-top: 0.25rem;
}

.total-pax-lbl {
  font-size: 0.65rem;
  font-weight: 700;
  color: #9CA3AF;
}

.total-amount-lbl {
  font-size: 1.25rem;
  font-weight: 900;
  color: #FFFFFF;
  margin-top: 2px;
  font-family: var(--font-body);
}

/* ========================================== */
/* SIDEBAR ORDER SUMMARY STYLES               */
/* ========================================== */
.order-summary-box {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name-qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 70%;
}

.item-name {
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-qty {
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 800;
  flex-shrink: 0;
}

.item-subtotal {
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 800;
}

.summary-empty-state {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-style: italic;
  text-align: center;
  padding: 1.5rem 0.5rem;
  line-height: 1.5;
}

.summary-divider {
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
  width: 100%;
}

.summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.total-lbl-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.total-main-lbl {
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.total-sub-lbl {
  color: var(--text-muted);
  font-size: 0.65rem;
  font-weight: 700;
  margin-top: 2px;
}

.total-price-val {
  color: var(--text-primary);
  font-size: 1.35rem;
  font-weight: 900;
}



/* ========================================== */
/* COLLAPSIBLE SIDEBAR ACCORDION STYLES       */
/* ========================================== */
.collapsible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: color 0.25s ease;
}

.collapsible-header:hover {
  color: #A0A0A0;
}

.chevron-icon {
  width: 18px;
  height: 18px;
  color: #8E8E8E;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chevron-icon.rotated {
  transform: rotate(-180deg);
}

/* Accordion slide content wrapper */
.sidebar-block-content {
  margin-top: 1.5rem;
}

/* Animations and Transitions */
.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 500px;
  opacity: 1;
  overflow: hidden;
}

.accordion-slide-enter-from,
.accordion-slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 60px;
  opacity: 1;
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
  transform: translateY(-10px);
}

/* Tab contents gap spacing */
.tab-content-pane {
  display: flex;
  flex-direction: column;
  gap: 4.5rem; /* Wider spacing gap between sections in description tab */
}

/* ========================================== */
/* RESPONSIVE LAYOUTS                         */
/* ========================================== */

@media (max-width: 1023px) {
  .detail-split-layout {
    gap: 2rem;
  }
  
  .detail-main-content {
    width: 60%;
  }

  .detail-sidebar-actions {
    width: 40%;
  }
}

@media (max-width: 767px) {
  .event-detail-page {
    padding: 6rem 0 7rem 0; /* Add bottom padding to prevent bottom sheet blocking content */
  }

  .breadcrumb-nav {
    margin-bottom: 1.25rem;
  }

  .event-detail-tabs-nav {
    position: sticky !important;
    top: 65px !important;
    z-index: 99 !important;
    background-color: #0E0E0E !important;
    margin-bottom: 1.5rem !important;
    padding-bottom: 0 !important;
    gap: 1.5rem !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  
  .event-detail-tabs-nav .tab-nav-btn {
    font-size: 0.75rem !important;
    padding: 0.65rem 0 !important;
    letter-spacing: 0.05em !important;
    font-weight: 800 !important;
  }

  /* 1-column layout collapse */
  .detail-split-layout {
    flex-direction: column;
    gap: 2.5rem;
    margin-bottom: 3.5rem;
  }

  .detail-main-content {
    width: 100%;
    gap: 2.5rem;
  }

  .detail-sidebar-actions {
    width: 100%;
    gap: 2rem;
    position: static; /* Disable sticky sidebar on mobile */
  }

  /* Hero section modifications */
  .event-detail-hero {
    width: 100vw;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -6rem; /* offset mobile parent padding-top */
    border-radius: 0;
    padding: 4rem 1.5rem 3rem 1.5rem;
    margin-bottom: 2.5rem;
    background-size: cover;
    background-position: center;
  }

  .hero-content-inner {
    gap: 1.5rem;
  }

  .hero-top-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }

  .hero-title-left {
    font-size: 1.6rem;
  }

  .hero-main-split {
    flex-direction: column;
    gap: 1.5rem;
  }

  .hero-poster-col {
    width: 100%;
  }

  .hero-poster-wrapper {
    aspect-ratio: 2.2 / 1;
  }

  .hero-info-col {
    width: 100%;
    gap: 1.5rem;
  }

  .countdown-widget {
    align-items: flex-start;
  }

  .hero-fav-btn {
    top: 1rem;
    right: 1rem;
    width: 38px;
    height: 38px;
  }

  .hero-fav-btn .heart-icon {
    width: 16px;
    height: 16px;
  }

  /* Mobilize sections info */
  .lineup-carousel-wrapper {
    gap: 1rem;
  }

  .lineup-card {
    width: 140px;
  }

  /* Compact timeline node activity spacing */
  .node-content {
    padding-bottom: 1.5rem;
    font-size: 0.85rem;
    gap: 1rem;
  }

  .node-time {
    width: 70px;
  }

  /* Hide the order summary sidebar block on mobile when on the tiket tab */
  .hide-on-mobile-tiket {
    display: none !important;
  }

  /* Swap tab labels on mobile */
  .mobile-tab-label {
    display: inline !important;
  }
  .desktop-tab-label {
    display: none !important;
  }

  /* Universal bottom bar responsive styling */
  .bottom-bar-desktop-only {
    display: none !important;
  }
  
  .bottom-bar-mobile-only {
    display: block !important;
    width: 100%;
  }

  .bottom-bar-container {
    padding: 0 !important;
    max-width: 100% !important;
  }

  .event-detail-bottom-bar {
    background-color: #0E0E0E !important; /* Dark background matching website */
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    padding: 0.5rem 0 !important; /* Compact padding */
    z-index: 1000 !important;
  }

  .mobile-simple-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 1.5rem;
  }
  
  .mobile-simple-bar .bottom-bar-price-label {
    font-size: 0.55rem !important;
    color: #9CA3AF !important;
  }

  .mobile-simple-bar .bottom-bar-price-amount {
    font-size: 1.15rem !important;
    color: #FFFFFF !important;
    font-weight: 900 !important;
  }

  .mobile-simple-bar .btn-lihat-tiket {
    background-color: #FFFFFF !important;
    color: #000000 !important;
    border: 1px solid #FFFFFF !important;
    font-size: 0.75rem !important;
    padding: 0.65rem 1.25rem !important;
    border-radius: 10px !important;
  }

  .mobile-checkout-bar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Compact gap */
    width: 100%;
    padding: 0 1.5rem;
  }

  .checkout-bar-row-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
  }

  .bar-price-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .bar-price-lbl {
    font-size: 0.55rem !important;
    font-weight: 800 !important;
    color: #9CA3AF !important;
    letter-spacing: 0.05em !important;
  }

  .bar-price-val {
    font-size: 1.15rem !important;
    font-weight: 900 !important;
    color: #FFFFFF !important;
    margin-top: 1px !important;
    font-family: var(--font-body) !important;
  }

  .btn-detail-toggle {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 800;
    color: #FFFFFF;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 0;
  }

  .btn-detail-toggle .caret-icon {
    font-size: 0.6rem;
    transform: translateY(-1px);
  }

  .checkout-bar-row-bottom {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    align-items: center;
  }

  .btn-beli-sekarang {
    flex: 1;
    background-color: #FFFFFF !important; /* White background matching other website buttons */
    color: #000000 !important;
    border: none;
    font-size: 0.85rem;
    font-weight: 800;
    padding: 0.65rem; /* Compact padding */
    border-radius: 12px;
    cursor: pointer;
    text-align: center;
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  .btn-beli-sekarang:hover {
    background-color: #E5E7EB !important;
  }

  .btn-beli-sekarang:disabled {
    background-color: #222222 !important;
    color: #555555 !important;
    cursor: not-allowed;
    box-shadow: none;
  }

  .btn-chat-mobile {
    width: 38px; /* Compact size */
    height: 38px;
    background-color: transparent !important;
    color: #FFFFFF !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .btn-chat-mobile:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-color: #FFFFFF !important;
  }

  .chat-icon-svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2.5;
  }

  /* Backdrop filter drawer */
  .bottom-sheet-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 998;
  }

  /* Drawer panel */
  .bottom-sheet-drawer {
    position: fixed !important;
    bottom: 0 !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: 100% !important;
    max-width: 500px !important; /* Perfect centered mobile layout */
    background-color: #141414 !important;
    border-radius: 24px 24px 0 0 !important;
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    z-index: 999 !important;
    display: flex !important;
    flex-direction: column !important;
    padding: 1.5rem 1.5rem 6.5rem 1.5rem !important; /* Make room for bottom bar */
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.6) !important;
  }

  .drawer-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 1.25rem !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    padding-bottom: 0.75rem !important;
  }

  .drawer-title {
    font-family: var(--font-heading) !important;
    font-size: 0.95rem !important;
    font-weight: 900 !important;
    letter-spacing: 0.05em !important;
    color: #FFFFFF !important;
    margin: 0 !important;
  }

  .drawer-close-btn {
    background: none !important;
    border: none !important;
    color: #9CA3AF !important;
    font-size: 1.5rem !important;
    cursor: pointer !important;
    line-height: 1 !important;
  }

  .drawer-body {
    max-height: 220px !important;
    overflow-y: auto !important;
  }

  .drawer-body .order-summary-box {
    gap: 1rem !important;
  }

  .drawer-body .summary-items-list {
    gap: 0.6rem !important;
  }

  .drawer-body .item-name {
    font-size: 0.75rem !important;
  }

  .drawer-body .item-qty {
    font-size: 0.75rem !important;
  }

  .drawer-body .item-subtotal {
    font-size: 0.8rem !important;
  }

  /* Transition slide and fade for sheet */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease !important;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0 !important;
  }

  .slide-up-enter-active, .slide-up-leave-active {
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .slide-up-enter-from, .slide-up-leave-to {
    transform: translateX(-50%) translateY(100%) !important;
  }

  /* Responsive Ticket Cards styling for mobile */
  .main-ticket-selector {
    background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  .ticket-list-stub-wrapper {
    gap: 1rem;
  }
  .ticket-card-mockup {
    border-radius: 16px !important;
  }
  .ticket-card-header {
    flex-direction: column !important;
    align-items: stretch !important;
    padding: 1.25rem !important;
    gap: 0.5rem !important;
  }
  .header-left-col {
    width: 100% !important;
  }
  .tier-title-mockup {
    font-size: 1rem !important;
    line-height: 1.35 !important;
  }
  .tier-status-badge {
    font-size: 0.6rem !important;
    padding: 3px 6px !important;
    margin-top: 0.2rem !important;
    border-radius: 4px !important;
  }
  .header-mid-divider {
    display: block !important;
    width: 100% !important;
    height: 1px !important;
    background-color: rgba(255, 255, 255, 0.08) !important;
    margin: 0.4rem 0 !important;
  }
  .header-right-col {
    border-left: none !important;
    padding-left: 0 !important;
    width: 100% !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 0.5rem !important;
  }
  .header-price-info {
    align-items: flex-start !important;
    text-align: left !important;
  }
  .price-lbl {
    font-size: 0.65rem !important;
  }
  .price-val {
    font-size: 1.15rem !important;
    font-weight: 800 !important;
    color: #FFFFFF !important;
  }
  .original-price {
    font-size: 0.75rem !important;
  }
  .discount-tag {
    font-size: 0.55rem !important;
  }
  .chevron-expand-icon {
    width: 16px !important;
    height: 16px !important;
  }
  .ticket-card-body {
    padding: 0 1.25rem 1.25rem 1.25rem !important;
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    padding-top: 1.25rem !important;
  }
  .info-section-title {
    font-size: 0.6rem !important;
    margin-bottom: 0.35rem !important;
  }
  .cal-desc-text, .bullet-item, .ticket-description-para, .benefit-bullet {
    font-size: 0.75rem !important;
  }
  .info-date-row {
    gap: 0.75rem !important;
  }
  .calendar-icon-block {
    width: 36px !important;
    height: 40px !important;
    background-color: #1A1A1A !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }
  .cal-month {
    font-size: 0.5rem !important;
    padding: 1.5px 0 !important;
  }
  .cal-day {
    font-size: 0.95rem !important;
    background-color: #121212 !important;
  }
  .info-bullets-row {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.4rem !important;
  }
  .bullet-item {
    gap: 0.4rem !important;
  }
  .bullet-icon, .benefit-check {
    width: 12px !important;
    height: 12px !important;
  }
  .benefits-list {
    gap: 0.4rem !important;
  }
  .ticket-card-footer {
    display: grid !important;
    grid-template-columns: 1fr auto !important;
    grid-template-rows: auto auto !important;
    grid-template-areas: 
      ". action"
      "date total" !important;
    align-items: end !important;
    gap: 0.75rem 1rem !important;
    padding: 1.25rem !important;
    border-bottom-left-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
    border-top: 1px dashed rgba(255, 255, 255, 0.08) !important;
    background-color: #1E1E1E !important;
  }
  .ticket-card-footer::before {
    left: -13px !important;
    width: 26px !important;
    height: 26px !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  .ticket-card-footer::after {
    right: -13px !important;
    width: 26px !important;
    height: 26px !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  .footer-left-col {
    grid-area: date !important;
    align-self: end !important;
    justify-self: start !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  .footer-label {
    font-size: 0.55rem !important;
  }
  .footer-time {
    font-size: 0.7rem !important;
    margin-top: 2px !important;
    color: #FFFFFF !important;
  }
  .btn-add-ticket, .btn-sold-out-ticket, .tier-stepper-mockup {
    grid-area: action !important;
    justify-self: end !important;
  }
  .btn-add-ticket {
    background-color: #FFFFFF !important; /* White background matching checkout button */
    color: #000000 !important;
    border: 1px solid #FFFFFF !important;
    font-size: 0.75rem !important;
    padding: 0.5rem 1.25rem !important;
    border-radius: 8px !important;
  }
  .btn-add-ticket:hover {
    background-color: transparent !important;
    color: #FFFFFF !important;
    border-color: #FFFFFF !important;
  }
  .btn-sold-out-ticket {
    font-size: 0.75rem !important;
    padding: 0.5rem 1.25rem !important;
    border-radius: 8px !important;
  }
  .tier-stepper-mockup {
    border-radius: 8px !important;
  }
  .step-btn-mock {
    width: 28px !important;
    height: 28px !important;
    font-size: 1rem !important;
  }
  .step-qty-mock {
    width: 28px !important;
    font-size: 0.8rem !important;
  }
  .footer-total-price-box {
    grid-area: total !important;
    justify-self: end !important;
    margin-top: 0 !important;
    align-items: flex-end !important;
    text-align: right !important;
  }
  .total-pax-lbl {
    font-size: 0.55rem !important;
  }
  .total-amount-lbl {
    font-size: 1.15rem !important;
    margin-top: 2px !important;
    color: #FFFFFF !important;
  }
}
</style>
