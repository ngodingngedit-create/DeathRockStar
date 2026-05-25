import { ref, computed } from 'vue'

export const currentLang = ref(localStorage.getItem('lang') || 'id')

export const setLang = (lang) => {
  currentLang.value = lang
  localStorage.setItem('lang', lang)
}

// Global translation helper
export const t = (key) => {
  const dictionary = {
    // Navbar & Layout
    home: { id: 'BERANDA', en: 'HOME' },
    merch: { id: 'TOKO', en: 'STORE' },
    events: { id: 'EVENT', en: 'EVENTS' },
    search: { id: 'CARI', en: 'SEARCH' },
    collection: { id: 'KOLEKSI', en: 'COLLECTION' },
    cart: { id: 'KERANJANG', en: 'CART' },
    menu: { id: 'MENU', en: 'MENU' },
   
    yourCart: { id: 'KERANJANG ANDA', en: 'YOUR CART' },
    cartEmpty: { id: 'Keranjang Anda kosong.', en: 'Your cart is empty.' },
    startShopping: { id: 'MULAI BELANJA', en: 'START SHOPPING' },
    subtotal: { id: 'SUBTOTAL', en: 'SUBTOTAL' },
    checkout: { id: 'LANJUT KE PEMBAYARAN', en: 'PROCEED TO CHECKOUT' },
    shippingNote: { id: 'Pajak dan biaya pengiriman dihitung saat pembayaran.', en: 'Taxes and shipping calculated at checkout.' },
    searchPlaceholder: { id: 'Cari event atau produk...', en: 'Search events or products...' },

    // Hero Section
    heroSubtitle: { id: 'Hidup untuk Scene.', en: 'Live for the Scene.' },
    featuresTitle1: { id: 'TICKETING INSTAN', en: 'INSTANT TICKETING' },
    featuresDesc1: { id: 'Dapatkan tiket gigs and konser terpanas tanpa repot secara digital.', en: 'Get tickets for the hottest gigs and concerts hassle-free digitally.' },
    featuresTitle2: { id: 'MERCH EXCLUSIVE', en: 'EXCLUSIVE MERCH' },
    featuresDesc2: { id: 'Koleksi merchandise band and scene lokal terlengkap and resmi.', en: 'The most complete and official local band and scene merch collection.' },
    featuresTitle3: { id: 'KONEKSI KOMUNITAS', en: 'COMMUNITY CONNECTION' },
    featuresDesc3: { id: 'Mendukung gerakan musik mandiri and scene gig lokal Anda.', en: 'Support the independent music movement and your local gig scene.' },
    secCountTitle: { id: 'TIKET HABIS DALAM', en: 'TICKETS SOLD OUT IN' },
    
    // Additional Hero Section keys
    heroKicker1: { id: 'DIBUAT UNTUK SCENE', en: 'BUILT FOR THE SCENE' },
    heroTitle1: { id: 'MOMEN LIVE.<br>BUAT KENANGAN.', en: 'LIVE MOMENTS.<br>MAKE MEMORIES.' },
    heroDesc1: { id: 'Kami adalah kolektif kreatif yang memadukan musik, merchandise, dan pengalaman live. Terinspirasi oleh khalayak.', en: 'We’re a creative collective blending music, merchandise, and live experiences. Inspired by the people.' },
    heroKicker2: { id: 'MERCHANDISE EKSKLUSIF', en: 'EXCLUSIVE MERCHANDISE' },
    heroTitle2: { id: 'GAYA INDEPENDEN.<br>PAKAILAH KEBISINGAN.', en: 'STYLE INDEPENDENT.<br>WEAR THE NOISE.' },
    heroDesc2: { id: 'Rilis terbatas, koleksi pilihan, dan pakaian khusus yang dibuat untuk kultur. Representasikan underground.', en: 'Limited drops, curated collections, and custom apparel made for the culture. Represent the underground.' },
    heroKicker3: { id: 'KOMUNITAS KREATIF', en: 'CREATIVE COMMUNITY' },
    heroTitle3: { id: 'GUNCANG KOLEKTIF.<br>GABUNG KELUARGA.', en: 'ROCK THE COLLECTIVE.<br>JOIN THE FAMILY.' },
    heroDesc3: { id: 'Lebih dari sekadar musik. Sebuah platform di mana seniman, pencipta, dan penggemar bersatu untuk membentuk masa depan rock.', en: 'More than just music. A platform where artists, creators, and fans unite to shape the future of rock.' },
    exploreEvents: { id: 'JELAJAHI EVENT', en: 'EXPLORE EVENTS' },
    shopMerch: { id: 'BELANJA MERCH', en: 'SHOP MERCH' },
    heroFeatureTitle1: { id: 'PENGALAMAN LIVE', en: 'LIVE EXPERIENCES' },
    heroFeatureDesc1: { id: 'Konser & festival yang tidak ingin Anda lewatkan', en: 'Concerts & festivals you don\'t want to miss' },
    heroFeatureTitle2: { id: 'MERCH EKSKLUSIF', en: 'EXCLUSIVE MERCH' },
    heroFeatureDesc2: { id: 'Rilis terbatas untuk pendukung sejati', en: 'Limited drops for true supporters' },
    heroFeatureTitle3: { id: 'KOMUNITAS UTAMA', en: 'COMMUNITY FIRST' },
    heroFeatureDesc3: { id: 'Dibangun bersama oleh keluarga musik', en: 'Built together by the music family' },
    heroFeatureTitle4: { id: 'MOMEN NYATA', en: 'REAL MOMENTS' },
    heroFeatureDesc4: { id: 'Menciptakan kenangan yang bertahan selamanya', en: 'Creating memories that last forever' },

    // Merch Section / Page
    merchTitle: { id: 'DIBUAT UNTUK SCENE.', en: 'MADE FOR THE SCENE.' },
    viewAllMerch: { id: 'LIHAT SEMUA MERCH', en: 'VIEW ALL MERCH' },
    partnerStore: { id: 'Partner Store', en: 'Partner Store' },
    quickAdd: { id: 'TAMBAH CEPAT', en: 'QUICK ADD' },
    soldOut: { id: 'HABIS', en: 'SOLD OUT' },
    preOrder: { id: 'PRE-ORDER', en: 'PRE-ORDER' },
    limited: { id: 'TERBATAS', en: 'LIMITED' },
    bestSeller: { id: 'BEST SELLER', en: 'BEST SELLER' },
    availableStock: { id: 'Stok tersedia', en: 'Stock available' },
    outOfStock: { id: 'Stok habis', en: 'Out of stock' },
    size: { id: 'UKURAN', en: 'SIZE' },
    color: { id: 'WARNA', en: 'COLOR' },
    quantity: { id: 'JUMLAH', en: 'QUANTITY' },
    addToCart: { id: 'TAMBAH KE KERANJANG', en: 'ADD TO CART' },
    chat: { id: 'HUBUNGI', en: 'CHAT' },
    all: { id: 'Semua', en: 'All' },
    clothing: { id: 'Pakaian', en: 'Clothing' },
    accessories: { id: 'Aksesoris', en: 'Accessories' },
    dailyNeeds: { id: 'Kebutuhan Harian', en: 'Daily Needs' },
    bundling: { id: 'Bundling', en: 'Bundling' },
    noProducts: { id: 'Produk tidak ditemukan di kategori ini.', en: 'No products found in this category.' },
    sizeGuide: { id: 'Panduan Ukuran', en: 'Size Guide' },
    tshirt: { id: 'Kaos', en: 'T-Shirt' },
    merchCatalogTitle: { id: 'KATALOG MERCHANDISE DRS', en: 'DRS MERCHANDISE CATALOG' },
    merchCatalogSubtitle: { id: 'Kaos resmi, aksesoris, dan paket bundling eksklusif Deathrockstar.', en: 'Official tees, accessories, and exclusive bundling packs from Deathrockstar.' },

    // Events Section / Page
    eventsTitle: { id: 'PENGALAMAN LIVE YANG TIDAK BOLEH DILEWATKAN.', en: 'LIVE EXPERIENCES YOU DON\'T WANT TO MISS.' },
    viewAllEvents: { id: 'LIHAT SEMUA EVENT', en: 'VIEW ALL EVENTS' },
    pilihTiket: { id: 'PILIH TIKET', en: 'SELECT TICKET' },
    mulaiDari: { id: 'Mulai dari', en: 'Starting from' },
    upcoming: { id: 'AKAN DATANG', en: 'UPCOMING' },
    pastEvents: { id: 'EVENT LALU', en: 'PAST EVENTS' },
    searchLocation: { id: 'Cari lokasi (e.g. Jakarta, Bandung...)', en: 'Search location (e.g. Jakarta, Bandung...)' },
    allEvents: { id: 'SEMUA EVENT', en: 'ALL EVENTS' },
    noEvents: { id: 'Tidak ada event yang ditemukan dalam kategori ini.', en: 'No events found in this category.' },
    lihatTiket: { id: 'LIHAT TIKET', en: 'VIEW TICKET' },
    lihatLebihBanyak: { id: 'LIHAT LEBIH BANYAK', en: 'LOAD MORE' },

    // Event Detail Page
    detailDesk: { id: 'DESKRIPSI', en: 'DESCRIPTION' },
    detailTiket: { id: 'TIKET', en: 'TICKETS' },
    detailLokasi: { id: 'LOKASI & VENUE', en: 'LOCATION & VENUE' },
    detailSyarat: { id: 'SYARAT & KETENTUAN', en: 'TERMS & CONDITIONS' },
    organizer: { id: 'Penyelenggara', en: 'Organizer' },
    summary: { id: 'RINGKASAN PESANAN', en: 'ORDER SUMMARY' },
    venueInfo: { id: 'INFORMASI VENUE', en: 'VENUE INFORMATION' },
    buyTicket: { id: 'BELI TIKET', en: 'BUY TICKETS' },
    ticketTotal: { id: 'HARGA TIKET', en: 'TICKET PRICE' },
    checkoutAlert: { id: 'Simulasi pembelian berhasil! Sampai jumpa di moshpit! 🤘', en: 'Order simulation completed! See you in the moshpit! 🤘' },
    eventDate: { id: 'TANGGAL EVENT', en: 'EVENT DATE' },
    validity: { id: 'Masa berlaku', en: 'Validity' },
    ticketInfo: { id: 'INFORMASI TIKET', en: 'TICKET INFORMATION' },
    nonRefundable: { id: 'Tidak Bisa Refund', en: 'Non-Refundable' },
    instantConfirmation: { id: 'Konfirmasi Instan', en: 'Instant Confirmation' },
    taxIncluded: { id: 'Termasuk Pajak 10%', en: '10% Tax Included' },
    benefit: { id: 'BENEFIT', en: 'BENEFIT' },
    benefit1: { id: 'Akses masuk konser', en: 'Concert entry access' },
    benefit2: { id: 'Area festival (standing)', en: 'Festival area (standing)' },
    benefit3: { id: 'Akses ke booth merchandise resmi', en: 'Access to official merchandise booth' },
    benefit4: { id: 'Tidak termasuk meet & greet artis', en: 'Excludes artist meet & greet' },
    endsOn: { id: 'BERAKHIR PADA', en: 'ENDS ON' },
    add: { id: 'Tambah', en: 'Add' },
    infoEvent: { id: 'INFO EVENT', en: 'EVENT INFO' },
    done: { id: 'Selesai', en: 'Done' },
    edit: { id: 'Edit', en: 'Edit' },
    noTicketsSelected: { id: 'Belum ada tiket yang dipilih. Silakan pilih tiket di samping.', en: 'No tickets selected yet. Please select tickets on the left.' },
    noTicketsSelectedSimple: { id: 'Belum ada tiket yang dipilih.', en: 'No tickets selected.' },
    totalPayment: { id: 'TOTAL PEMBAYARAN', en: 'TOTAL PAYMENT' },
    startingFrom: { id: 'HARGA MULAI DARI', en: 'STARTING FROM' },
    viewMap: { id: 'LIHAT PETA', en: 'VIEW MAP' },
    shareEvent: { id: 'BAGIKAN EVENT', en: 'SHARE EVENT' },
    otherEvents: { id: 'EVENT LAINNYA', en: 'OTHER EVENTS' },
    saved: { id: 'Tersimpan', en: 'Saved' },
    save: { id: 'Simpan', en: 'Save' },
    totalPriceKey: { id: 'TOTAL HARGA', en: 'TOTAL PRICE' },
    detail: { id: 'Detail', en: 'Detail' },
    buyTicketNow: { id: 'Beli Tiket Sekarang', en: 'Buy Ticket Now' },

    // Footer
    footerDesc: { id: 'Sebuah kolektif kreatif yang memadukan musik, merchandise, dan pengalaman live. Dibuat untuk scene, terinspirasi oleh khalayak.', en: 'A creative collective blending music, merchandise, and live experiences. Built for the scene, inspired by the people.' },
    footerBuiltFor: { id: 'Dibuat untuk scene.', en: 'Built for the scene.' },
    allRightsReserved: { id: 'Hak cipta dilindungi undang-undang.', en: 'All rights reserved.' },
    menuAbout: { id: 'Tentang Kami', en: 'About' },
    menuContact: { id: 'Hubungi Kami', en: 'Contact' },
    shopTshirt: { id: 'Kaos', en: 'T-Shirt' },
    shopHoodie: { id: 'Hoodie', en: 'Hoodie' },
    shopSale: { id: 'Diskon', en: 'Sale' },
    infoShipping: { id: 'Pengiriman', en: 'Shipping' },
    infoReturns: { id: 'Pengembalian', en: 'Returns' },
    infoFAQ: { id: 'Tanya Jawab', en: 'FAQ' },
    infoTerms: { id: 'Syarat & Ketentuan', en: 'Terms & Conditions' },
    infoPrivacy: { id: 'Kebijakan Privasi', en: 'Privacy Policy' }
  }

  const lang = currentLang.value
  return dictionary[key] ? dictionary[key][lang] : key
}
