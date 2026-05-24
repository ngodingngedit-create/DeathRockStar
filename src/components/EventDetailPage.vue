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
  { id: 'presale', name: 'PRESALE', price: 0, qty: 0, label: 'Tiket terbatas' },
  { id: 'normal', name: 'NORMAL', price: 0, qty: 0, label: '' },
  { id: 'ots', name: 'ON THE SPOT', price: 0, qty: 0, label: '(jika masih tersedia)' }
])

// Reset ticket counters and adjust prices dynamically when active event changes
const initializeTickets = () => {
  const basePrice = currentEvent.value.price
  ticketTiers.value = [
    { id: 'presale', name: 'PRESALE', price: Math.round(basePrice * 0.75), qty: 0, label: 'Tiket terbatas' },
    { id: 'normal', name: 'NORMAL', price: basePrice, qty: 0, label: '' },
    { id: 'ots', name: 'ON THE SPOT', price: Math.round(basePrice * 1.25), qty: 0, label: '(jika masih tersedia)' }
  ]
}

watch(() => props.eventId, () => {
  initializeTickets()
  startCountdown()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}, { immediate: true })

const incrementQty = (tier) => {
  if (isPastEvent.value) return
  tier.qty++
}

const decrementQty = (tier) => {
  if (isPastEvent.value) return
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

      <!-- Main Split Layout Columns -->
      <div class="detail-split-layout">
        
        <!-- Left Content Column (65%) -->
        <main class="detail-main-content">
          
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

          <!-- Aturan Event Section -->
          <section class="content-section">
            <h2 class="section-heading">ATURAN EVENT</h2>
            
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

        </main>

        <!-- Right Sidebar Actions Column (35%) -->
        <aside class="detail-sidebar-actions">
          
          <!-- Module Pilih Tiket Container -->
          <div class="sidebar-block ticket-selector-module">
            <h3 class="sidebar-block-title">PILIH TIKET</h3>
            
            <div class="ticket-tiers-list">
              <div v-for="tier in ticketTiers" :key="tier.id" class="ticket-tier-item">
                <div class="tier-info">
                  <span class="tier-name">{{ tier.name }}</span>
                  <span class="tier-price">Rp {{ formatPrice(tier.price) }}</span>
                  <span v-if="tier.label" class="tier-label">{{ tier.label }}</span>
                </div>
                
                <!-- Stepper Counter -->
                <div class="tier-stepper">
                  <button class="step-btn minus" :disabled="isPastEvent || tier.qty === 0" @click="decrementQty(tier)">-</button>
                  <span class="step-qty">{{ tier.qty }}</span>
                  <button class="step-btn plus" :disabled="isPastEvent" @click="incrementQty(tier)">+</button>
                </div>
              </div>
            </div>

            <!-- Dynamic Checkout Summary -->
            <div class="ticket-summary-panel" v-if="totalQty > 0">
              <div class="summary-row">
                <span>Total Tiket:</span>
                <span>{{ totalQty }}</span>
              </div>
              <div class="summary-row total-price-row">
                <span>Subtotal:</span>
                <span>Rp {{ formatPrice(totalPrice) }}</span>
              </div>
            </div>

            <!-- Call to Actions -->
            <div class="sidebar-buttons-group">
              <button 
                class="btn-primary-checkout" 
                :disabled="isPastEvent"
                @click="handleOrderNow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="btn-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span>{{ isPastEvent ? 'TICKET SOLD OUT / SELESAI' : 'PILIH TIKET SEKARANG' }}</span>
              </button>

              <button class="btn-secondary-save" @click="toggleSave">
                <svg class="btn-icon" :class="{ 'is-saved': isSaved }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{{ isSaved ? 'EVENT TERSIMPAN' : 'SIMPAN EVENT' }}</span>
              </button>
            </div>
          </div>

          <!-- Module Informasi Venue Container -->
          <div class="sidebar-block venue-info-module">
            <h3 class="sidebar-block-title">INFORMASI VENUE</h3>
            
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

          <!-- Module Bagikan Event Container -->
          <div class="sidebar-block share-event-module">
            <h3 class="sidebar-block-title">BAGIKAN EVENT</h3>
            
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

    <!-- Mobile Sticky Checkout Bottom Bar & Bottom Sheet Drawer -->
    <div class="mobile-sticky-bottom-checkout" v-if="!isPastEvent">
      <div class="checkout-bar-contents">
        <div class="bar-summary">
          <span class="bar-qty">{{ totalQty }} Tiket</span>
          <span class="bar-price">Rp {{ formatPrice(totalPrice) }}</span>
        </div>
        <button class="btn-mobile-checkout" @click="toggleBottomSheet">
          <span>{{ isBottomSheetOpen ? 'TUTUP' : 'BELI TIKET' }}</span>
        </button>
      </div>

      <!-- Bottom Sheet Drawer backdrop -->
      <transition name="fade">
        <div v-if="isBottomSheetOpen" class="bottom-sheet-backdrop" @click="isBottomSheetOpen = false"></div>
      </transition>

      <!-- Bottom Sheet Drawer panel -->
      <transition name="slide-up">
        <div v-if="isBottomSheetOpen" class="bottom-sheet-drawer">
          <div class="drawer-header">
            <h4 class="drawer-title">PILIH TIKET</h4>
            <button class="drawer-close-btn" @click="isBottomSheetOpen = false">&times;</button>
          </div>
          
          <div class="drawer-body">
            <div class="ticket-tiers-list">
              <div v-for="tier in ticketTiers" :key="tier.id" class="ticket-tier-item">
                <div class="tier-info">
                  <span class="tier-name">{{ tier.name }}</span>
                  <span class="tier-price">Rp {{ formatPrice(tier.price) }}</span>
                  <span v-if="tier.label" class="tier-label">{{ tier.label }}</span>
                </div>
                
                <!-- Stepper Counter -->
                <div class="tier-stepper">
                  <button class="step-btn minus" :disabled="tier.qty === 0" @click="decrementQty(tier)">-</button>
                  <span class="step-qty">{{ tier.qty }}</span>
                  <button class="step-btn plus" @click="incrementQty(tier)">+</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="drawer-footer">
            <div class="drawer-total-row">
              <span>Total Biaya:</span>
              <span class="drawer-total-price">Rp {{ formatPrice(totalPrice) }}</span>
            </div>
            <button class="drawer-checkout-btn" :disabled="totalQty === 0" @click="handleOrderNow">
              PILIH TIKET SEKARANG
            </button>
          </div>
        </div>
      </transition>
    </div>

  </div>
</template>

<style scoped>
.event-detail-page {
  background-color: #0B0B0B;
  color: #FFFFFF;
  padding: 8rem 0 8rem 0;
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
/* MOBILE STICKY BOTTOM CHECKOUT              */
/* ========================================== */
.mobile-sticky-bottom-checkout {
  display: none;
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

  /* Mobile Ticket selection Module (Desktop sidebar version is hidden entirely) */
  .ticket-selector-module {
    display: none; /* Handled by sticky bottom sheet */
  }

  /* ========================================== */
  /* MOBILE STICKY BOTTOM CHECKOUT & DRAWER     */
  /* ========================================== */
  .mobile-sticky-bottom-checkout {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #141414;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 1000;
  }

  .checkout-bar-contents {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
  }

  .bar-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .bar-qty {
    font-size: 0.7rem;
    font-weight: 700;
    color: #999999;
    text-transform: uppercase;
  }

  .bar-price {
    font-size: 1.1rem;
    font-weight: 800;
    color: #FFFFFF;
    margin-top: 2px;
  }

  .btn-mobile-checkout {
    background-color: #FFFFFF;
    color: #000000;
    border: none;
    padding: 0.75rem 1.5rem;
    font-weight: 800;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    border-radius: 6px;
    cursor: pointer;
  }

  /* Backdrop filter drawer */
  .bottom-sheet-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 998;
  }

  /* Drawer panel */
  .bottom-sheet-drawer {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    background-color: #141414;
    border-radius: 16px 16px 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 999;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    box-shadow: 0 -10px 30px rgba(0,0,0,0.9);
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .drawer-title {
    font-family: var(--font-heading);
    font-size: 0.9rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    color: #FFFFFF;
    margin: 0;
  }

  .drawer-close-btn {
    background: none;
    border: none;
    color: #999999;
    font-size: 1.75rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.25rem;
  }

  .drawer-body {
    max-height: 250px;
    overflow-y: auto;
    margin-bottom: 1.5rem;
  }

  .drawer-footer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-top: 1px dashed rgba(255, 255, 255, 0.08);
    padding-top: 1.25rem;
  }

  .drawer-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .drawer-total-row span:first-child {
    font-size: 0.85rem;
    color: #999999;
  }

  .drawer-total-price {
    font-size: 1.15rem;
    font-weight: 800;
    color: #FFFFFF;
  }

  .drawer-checkout-btn {
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
  }

  .drawer-checkout-btn:disabled {
    background-color: #222222;
    color: #555555;
    cursor: not-allowed;
  }

  /* Transition slide and fade for sheet */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active, .slide-up-leave-active {
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .slide-up-enter-from, .slide-up-leave-to {
    transform: translateY(100%);
  }
}
</style>
