<script setup>
import { ref, computed, onMounted, createApp, nextTick } from 'vue'
import { isLoggedIn, currentUser } from '../store/auth.js'
import { t } from '../store/lang.js'
import ResiDocument, { buildResiData } from './ResiDocument.vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.kolektix.com'
const CREATOR_SLUG = 'ndoqidrhnp'

const first = (...vals) => vals.find((v) => v !== undefined && v !== null && v !== '') ?? ''
const toNum = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0 }
const normalizeStatus = (s) => {
  const v = String(s || '').toLowerCase()
  if (['paid', 'success', 'settlement', 'capture', 'completed', 'done'].includes(v)) return 'paid'
  if (['pending', 'unpaid', 'waiting', 'process', 'processing'].includes(v)) return 'pending'
  return 'expired'
}
const formatDate = (v) => {
  if (!v) return '-'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return String(v)
  return d.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
const mapItem = (it = {}) => {
  const qty = toNum(first(it.qty, it.quantity, it.total_qty, 1)) || 1
  const price = toNum(first(it.price, it.subtotal != null && qty ? it.subtotal / qty : undefined, it.grandtotal, 0))
  return {
    product_name: String(first(it.product_name, it.product?.product_name, it.product?.name, it.name, '-')),
    variant_name: String(first(it.variant_name, it.varian_name, it.variant?.varian_name, it.varian?.varian_name, it.size, '-')),
    qty,
    price
  }
}
const mapTransaction = (r = {}, idx = 0) => {
  const itemsRaw = r.items || r.order_details || r.order_items || r.products || r.details || r.product || []
  const items = (Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw]).map(mapItem)
  const total_qty = toNum(first(r.total_qty, r.total_quantity, items.reduce((s, i) => s + i.qty, 0)))
  const total_price = toNum(first(r.total_price, r.grandtotal, r.grand_total, r.total, r.amount, items.reduce((s, i) => s + i.qty * i.price, 0)))
  return {
    id: first(r.id, r.order_id, idx),
    invoice_no: String(first(r.invoice_no, r.invoice_merch, r.invoice_code, r.order_code, r.code, '-')),
    customer: {
      name: String(first(r.customer?.name, r.name_pemesan, r.buyer_name, r.user?.name, r.name, '-')),
      email: String(first(r.customer?.email, r.email_pemesan, r.buyer_email, r.user?.email, r.email, '-')),
      phone: String(first(r.customer?.phone, r.phone_pemesan, r.buyer_phone, r.user?.phone, r.phone, '-'))
    },
    items,
    total_qty,
    total_price,
    status: normalizeStatus(first(r.status, r.payment_status, r.order_status, r.transaction_status?.name)),
    created_at: formatDate(first(r.created_at, r.order_date, r.date)),
    raw: r
  }
}
const esc = (v) => String(v ?? '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const isExpiredTrx = (o) => {
  const t = o?.raw || o || {}
  const name = String(t.transaction_status?.name || o?.status || '').toLowerCase()
  return t.transaction_status_id === 4 || ['expired', 'cancelled', 'canceled', 'failed'].includes(name) || name.includes('gagal')
}

const loading = ref(true)
const loadError = ref('')
const apiSummary = ref(null)
const activeTab = ref('transactions')
const searchQuery = ref('')
const statusFilter = ref('')
const isDropdownOpen = ref(false)
const transactions = ref([])
const currentPage = ref(1)
const perPage = 4
const statusSort = ref('')
const productFilter = ref('')
const isProductDropdownOpen = ref(false)
const variantSearchQuery = ref('')

const STATUS_ORDER = { expired: 0, paid: 1, pending: 2 }

const toggleStatusSort = () => {
  statusSort.value = statusSort.value === '' ? 'asc' : statusSort.value === 'asc' ? 'desc' : ''
  currentPage.value = 1
}

const filteredTransactions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const list = transactions.value.filter((t) => {
    const matchStatus = !statusFilter.value || t.status === statusFilter.value
    const matchQuery = !q || t.invoice_no.toLowerCase().includes(q) || t.customer.name.toLowerCase().includes(q)
    return matchStatus && matchQuery
  })
  if (statusSort.value === 'asc') return [...list].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
  if (statusSort.value === 'desc') return [...list].sort((a, b) => STATUS_ORDER[b.status] - STATUS_ORDER[a.status])
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTransactions.value.length / perPage)))

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredTransactions.value.slice(start, start + perPage)
})

const goPage = (p) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

const variants = ref([])

const buildVariants = (list) => {
  const map = new Map()
  list.forEach((trx) => {
    trx.items.forEach((it) => {
      const key = `${it.product_name}|||${it.variant_name}`
      if (!map.has(key)) map.set(key, { varian_id: key, varian_name: it.variant_name, product_name: it.product_name, sku: '-', price: it.price, stock_awal: '-', total_terjual: 0, total_paid: 0, total_pending: 0, total_expired: 0, sisa_stock: '-' })
      const row = map.get(key)
      row.total_terjual += it.qty
      if (it.price && !row.price) row.price = it.price
      if (trx.status === 'paid') row.total_paid += it.qty
      else if (trx.status === 'pending') row.total_pending += it.qty
      else row.total_expired += it.qty
    })
  })
  variants.value = [...map.values()]
}

const statusCountFromApi = (name) => {
  const s = apiSummary.value?.status_summary
  if (!s) return null
  if (Array.isArray(s)) {
    const f = s.find((x) => String(x.status || x.name || '').toLowerCase() === name)
    return f != null ? toNum(first(f.count, f.total, f.value)) : null
  }
  return toNum(s[name] ?? s[`${name}_count`]) || null
}

const summary = computed(() => {
  const list = transactions.value
  const paid = list.filter((t) => t.status === 'paid')
  const api = apiSummary.value || {}
  return {
    total_revenue: toNum(first(api.total_revenue, paid.reduce((s, t) => s + t.total_price, 0))),
    paid_count: statusCountFromApi('paid') ?? paid.length,
    pending_count: statusCountFromApi('pending') ?? list.filter((t) => t.status === 'pending').length,
    expired_count: statusCountFromApi('expired') ?? statusCountFromApi('failed') ?? list.filter((t) => t.status === 'expired').length,
    total_transactions: toNum(first(api.total_transactions, list.length))
  }
})

const formatRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')
const statusLabel = (s) => ({ '': t('dashAllStatus'), paid: 'Paid', pending: 'Pending', expired: 'Expired' }[s] || t('dashAllStatus'))
const setStatus = (s) => { statusFilter.value = s; isDropdownOpen.value = false; currentPage.value = 1 }
const onSearch = () => { currentPage.value = 1 }
const productOptions = computed(() => [...new Set(variants.value.map((v) => v.product_name))])
const productLabel = (s) => s || t('dashAllProducts')
const setProductFilter = (s) => { productFilter.value = s; isProductDropdownOpen.value = false }
const switchTab = (tab) => { activeTab.value = tab; currentPage.value = 1 }

const printResi = async (o) => {
  try {
    const r = o?.raw || {}
    const inv = o.invoice_no
    if (inv && inv !== '-') {
      const res = await fetch(`${API_BASE}/api/order-product-invoice/${inv}`, { headers: { Accept: 'application/json' } })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json?.status && json?.data) {
        const d = json.data.order || json.data
        const courier = json.data.courier || {}
        const manifestArr = Array.isArray(json.data.manifest) ? json.data.manifest[0] : null
        o = { ...o, raw: { ...r, ...d, courier, latest_manifest: d.latest_manifest || r.latest_manifest || manifestArr } }
      }
    }
  } catch { /* ponytail: fallback ke data tabel jika detail invoice gagal */ }
  const resi = buildResiData(o)
  const holder = document.createElement('div')
  holder.style.cssText = 'position:fixed;left:-9999px;top:0;'
  document.body.appendChild(holder)
  const app = createApp(ResiDocument, { resi })
  app.mount(holder)
  await nextTick()
  await new Promise((r) => setTimeout(r, 50))
  try {
    const canvas = await html2canvas(holder.firstElementChild, { scale: 2, backgroundColor: '#ffffff' })
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ unit: 'mm', format: 'a6' })
    const pw = 105
    const ph = 148
    const ratio = Math.min(pw / canvas.width, ph / canvas.height)
    const w = canvas.width * ratio
    const h = canvas.height * ratio
    pdf.addImage(img, 'PNG', (pw - w) / 2, 5, w, h)
    pdf.save(`Resi-${resi.referenceNumber}.pdf`)
  } finally {
    app.unmount()
    holder.remove()
  }
}

const filteredVariants = computed(() => {
  const q = variantSearchQuery.value.toLowerCase().trim()
  let list = !productFilter.value ? variants.value : variants.value.filter((v) => v.product_name === productFilter.value)
  if (q) list = list.filter((v) => v.product_name.toLowerCase().includes(q) || v.varian_name.toLowerCase().includes(q) || String(v.sku || '').toLowerCase().includes(q))
  return list
})

const exportCsv = () => {
  let csv = 'Date,Invoice,Customer,Email,Phone,Products,Total Qty,Grand Total,Status\n'
  filteredTransactions.value.forEach((t) => {
    const products = t.items.map((i) => `${i.product_name} [${i.variant_name}] (${i.qty})`).join(' | ').replace(/"/g, '""')
    csv += `"${t.created_at}","${t.invoice_no}","${t.customer.name}","${t.customer.email}","${t.customer.phone}","${products}",${t.total_qty},${t.total_price},"${t.status}"\n`
  })
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('download', 'report-deathrockstar.csv')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

onMounted(async () => {
  if (!isLoggedIn.value) {
    window.location.hash = '#login'
    return
  }
  try {
    const res = await fetch(`${API_BASE}/api/order-product/creator/${CREATOR_SLUG}/transactions?page=1&per_page=200`, { headers: { Accept: 'application/json' } })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`)
    const rows = json?.data?.transactions || json?.data || []
    const list = Array.isArray(rows) ? rows : []
    transactions.value = list.map(mapTransaction)
    apiSummary.value = json?.data?.summary || null
    buildVariants(transactions.value)
  } catch (e) {
    loadError.value = e?.message || 'Gagal memuat transaksi.'
    transactions.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="live-report-page">
    <main class="report-container">
      <div class="page-title-section">
        <h1>{{ t('dashTitle') }}</h1>
        <p class="subtitle">{{ t('dashSubtitle') }}{{ currentUser?.name ? ' — ' + currentUser.name : '' }}</p>
        <p v-if="loadError" class="load-error">{{ loadError }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon sales-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">{{ t('dashTotalSales') }}</span>
            <span class="stat-value">{{ formatRp(summary.total_revenue) }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">{{ t('dashSuccess') }}</span>
            <span class="stat-value">{{ summary.paid_count }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">{{ t('dashPending') }}</span>
            <span class="stat-value">{{ summary.pending_count }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon failed-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">{{ t('dashFailed') }}</span>
            <span class="stat-value">{{ summary.expired_count }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon transactions-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">{{ t('dashTotalTrx') }}</span>
            <span class="stat-value">{{ summary.total_transactions }}</span>
          </div>
        </div>
      </div>

      <div class="report-tabs">
        <button class="tab-btn" :class="{ active: activeTab === 'transactions' }" @click="switchTab('transactions')">{{ t('dashTabTrx') }}</button>
        <button class="tab-btn" :class="{ active: activeTab === 'variants' }" @click="switchTab('variants')">{{ t('dashTabStock') }}</button>
        <button class="tab-btn" :class="{ active: activeTab === 'resi' }" @click="switchTab('resi')">{{ t('navCetakResi') }}</button>
      </div>

      <div v-if="activeTab === 'transactions'" class="transactions-section">
        <div class="section-header">
          <div class="header-main trx-header-main">
            <h2>{{ t('dashTabTrx') }}</h2>
            <div class="badge-count">{{ filteredTransactions.length }} {{ t('dashTrxUnit') }}</div>
            <div class="total-info">
              <button class="export-btn" @click="exportCsv" :title="t('dashExport')" :aria-label="t('dashExport')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span class="export-label">{{ t('dashExport') }}</span>
              </button>
            </div>
          </div>
          <div class="header-filters">
            <div class="search-box">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" :placeholder="t('dashSearchPh')" v-model="searchQuery" @input="onSearch" class="search-input" />
            </div>
            <div class="custom-dropdown-container">
              <div class="custom-dropdown-header" :class="{ 'is-active': isDropdownOpen }" @click="isDropdownOpen = !isDropdownOpen" :title="statusLabel(statusFilter)" role="button" :aria-label="statusLabel(statusFilter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="filter-icon"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                <span class="selected-label">{{ statusLabel(statusFilter) }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="dropdown-arrow"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <transition name="fade">
                <div v-if="isDropdownOpen" class="custom-dropdown-options">
                  <div class="dropdown-option" :class="{ 'is-selected': statusFilter === '' }" @click="setStatus('')">{{ t('dashAllStatus') }}</div>
                  <div class="dropdown-option" :class="{ 'is-selected': statusFilter === 'paid' }" @click="setStatus('paid')">Paid</div>
                  <div class="dropdown-option" :class="{ 'is-selected': statusFilter === 'pending' }" @click="setStatus('pending')">Pending</div>
                  <div class="dropdown-option" :class="{ 'is-selected': statusFilter === 'expired' }" @click="setStatus('expired')">Expired</div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="premium-table">
            <thead>
              <tr><th>No</th><th>Invoice</th><th>{{ t('dashThCustomer') }}</th><th>{{ t('dashThProduct') }}</th><th class="th-sortable" @click="toggleStatusSort" :title="t('dashSortStatus')"><span class="th-label">{{ t('dashThStatus') }}</span><svg class="sort-icon" :class="{ active: statusSort !== '', desc: statusSort === 'desc' }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></th><th>Qty</th><th>{{ t('dashThTotal') }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="(trx, idx) in paginatedTransactions" :key="trx.id">
                <td>{{ (currentPage - 1) * perPage + idx + 1 }}</td>
                <td><span class="invoice-no">{{ trx.invoice_no }}</span></td>
                <td>
                  <div class="customer-info">
                    <span class="customer-name">{{ trx.customer.name }}</span>
                    <small class="customer-email">{{ trx.customer.email }}</small>
                    <small class="customer-phone">{{ trx.customer.phone }}</small>
                  </div>
                </td>
                <td>
                  <div v-for="(item, i) in trx.items" :key="i" class="product-item-row">
                    <div class="product-detail">
                      <div class="product-name-text">{{ item.product_name }}</div>
                      <div class="product-variant-info">{{ t('dashThVariant') }}: <span>{{ item.variant_name }}</span></div>
                      <span class="product-meta">({{ item.qty }} x {{ formatRp(item.price) }})</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    class="status-badge"
                    :style="{
                      backgroundColor: (trx.status === 'paid' ? '#2ecc71' : trx.status === 'pending' ? '#ffa726' : '#e74c3c') + '20',
                      color: trx.status === 'paid' ? '#2ecc71' : trx.status === 'pending' ? '#ffa726' : '#e74c3c',
                      border: `1px solid ${(trx.status === 'paid' ? '#2ecc71' : trx.status === 'pending' ? '#ffa726' : '#e74c3c')}40`
                    }"
                  >{{ trx.status }}</span>
                </td>
                <td>{{ trx.total_qty }}</td>
                <td><span class="price-val">{{ formatRp(trx.total_price) }}</span></td>
              </tr>
              <tr v-if="filteredTransactions.length === 0 && !loading">
                <td colspan="7" class="no-data-cell">{{ t('dashNoTrx') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="totalPages > 1" class="pagination-wrapper">
          <div class="pagination-info">{{ t('dashPage') }} <strong>{{ currentPage }}</strong> {{ t('dashOf') }} <strong>{{ totalPages }}</strong></div>
          <div class="pagination-controls">
            <button
              v-for="page in totalPages"
              :key="page"
              class="pag-btn pag-num"
              :class="{ active: page === currentPage }"
              @click="goPage(page)"
            >{{ page }}</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'variants'" class="transactions-section variants-report-section">
        <div class="section-header">
          <div class="header-main">
            <h2>{{ t('dashTabStock') }}</h2>
            <div class="total-info"><div class="badge-count">{{ filteredVariants.length }} {{ t('dashVariantUnit') }}</div></div>
          </div>
          <div class="header-filters">
            <div class="search-box">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" :placeholder="t('variantSearchPh')" v-model="variantSearchQuery" class="search-input" />
            </div>
            <div class="custom-dropdown-container">
              <div class="custom-dropdown-header" :class="{ 'is-active': isProductDropdownOpen }" @click="isProductDropdownOpen = !isProductDropdownOpen" :title="productLabel(productFilter)" role="button" :aria-label="productLabel(productFilter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="filter-icon"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                <span class="selected-label">{{ productLabel(productFilter) }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="dropdown-arrow"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <transition name="fade">
                <div v-if="isProductDropdownOpen" class="custom-dropdown-options">
                  <div class="dropdown-option" :class="{ 'is-selected': productFilter === '' }" @click="setProductFilter('')">{{ t('dashAllProducts') }}</div>
                  <div
                    v-for="name in productOptions"
                    :key="name"
                    class="dropdown-option"
                    :class="{ 'is-selected': productFilter === name }"
                    @click="setProductFilter(name)"
                  >{{ name }}</div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="premium-table">
            <thead>
              <tr><th>{{ t('dashThVariant') }}</th><th>SKU</th><th>{{ t('dashThPrice') }}</th><th>{{ t('dashThStockStart') }}</th><th>{{ t('dashThSold') }}</th><th>Paid</th><th>Pending</th><th>Expired</th><th>{{ t('dashThRemaining') }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="v in filteredVariants" :key="v.varian_id" :class="{ 'sold-out-row': v.sisa_stock <= 0 }">
                <td>
                  <div class="variant-name-cell">
                    <span class="v-name" :class="{ 'v-strikethrough': v.sisa_stock <= 0 }">{{ v.varian_name }}</span>
                    <small class="v-product">{{ v.product_name }}</small>
                    <span v-if="v.sisa_stock <= 0" class="sold-out-text">{{ t('soldOut') }}</span>
                  </div>
                </td>
                <td><code class="sku-code">{{ v.sku }}</code></td>
                <td><span class="price-val">{{ formatRp(v.price) }}</span></td>
                <td>{{ v.stock_awal }}</td>
                <td>{{ v.total_terjual }}</td>
                <td><span class="paid-val">{{ v.total_paid }}</span></td>
                <td><span class="pending-val">{{ v.total_pending }}</span></td>
                <td><span class="expired-val">{{ v.total_expired }}</span></td>
                <td><span class="stock-status" :class="v.sisa_stock <= 0 ? 'out-of-stock' : 'in-stock'">{{ v.sisa_stock }}</span></td>
              </tr>
              <tr v-if="filteredVariants.length === 0">
                <td colspan="9" class="no-data-cell">{{ t('dashNoStock') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'resi'" class="transactions-section">
        <div class="section-header">
          <div class="header-main">
            <h2>{{ t('navCetakResi') }}</h2>
            <div class="total-info"><div class="badge-count">{{ filteredTransactions.length }} {{ t('dashTrxUnit') }}</div></div>
          </div>
          <div class="header-filters">
            <div class="search-box">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" :placeholder="t('dashSearchPh')" v-model="searchQuery" @input="onSearch" class="search-input" />
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="premium-table resi-table">
            <thead>
              <tr><th>Invoice</th><th>{{ t('dashThCustomer') }}</th><th>{{ t('dashThProduct') }}</th><th>{{ t('dashThStatus') }}</th><th>Qty</th><th>{{ t('dashThTotal') }}</th><th>{{ t('resiThAction') }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="trx in paginatedTransactions" :key="trx.id">
                <td><span class="invoice-no">{{ trx.invoice_no }}</span></td>
                <td>
                  <div class="customer-info">
                    <span class="customer-name">{{ trx.customer.name }}</span>
                    <small class="customer-email">{{ trx.customer.email }}</small>
                    <small class="customer-phone">{{ trx.customer.phone }}</small>
                  </div>
                </td>
                <td>
                  <div v-for="(item, i) in trx.items" :key="i" class="product-item-row">
                    <div class="product-detail">
                      <div class="product-name-text">{{ item.product_name }}</div>
                      <div class="product-variant-info">{{ t('dashThVariant') }}: <span>{{ item.variant_name }}</span></div>
                      <span class="product-meta">({{ item.qty }} x {{ formatRp(item.price) }})</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    class="status-badge"
                    :style="{
                      backgroundColor: (trx.status === 'paid' ? '#2ecc71' : trx.status === 'pending' ? '#ffa726' : '#e74c3c') + '20',
                      color: trx.status === 'paid' ? '#2ecc71' : trx.status === 'pending' ? '#ffa726' : '#e74c3c',
                      border: `1px solid ${(trx.status === 'paid' ? '#2ecc71' : trx.status === 'pending' ? '#ffa726' : '#e74c3c')}40`
                    }"
                  >{{ trx.status }}</span>
                </td>
                <td>{{ trx.total_qty }}</td>
                <td><span class="price-val">{{ formatRp(trx.total_price) }}</span></td>
                <td>
                  <button class="print-btn" @click="printResi(trx)" :title="t('resiPrint')" :aria-label="t('resiPrint')">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                    <span class="print-label">{{ t('resiPrint') }}</span>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0 && !loading">
                <td colspan="7" class="no-data-cell">{{ t('resiNoData') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="totalPages > 1" class="pagination-wrapper">
          <div class="pagination-info">{{ t('dashPage') }} <strong>{{ currentPage }}</strong> {{ t('dashOf') }} <strong>{{ totalPages }}</strong></div>
          <div class="pagination-controls">
            <button
              v-for="page in totalPages"
              :key="page"
              class="pag-btn pag-num"
              :class="{ active: page === currentPage }"
              @click="goPage(page)"
            >{{ page }}</button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    </main>
  </div>
</template>

<style scoped>
.live-report-page { min-height: 100vh; background-color: #000; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; padding-top: 90px; }
.report-container { max-width: 1720px; margin: 0 auto; padding: 40px 2rem; }
.page-title-section { text-align: center; margin-bottom: 50px; }
.page-title-section h1 { font-size: 2.25rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 5px; }
.subtitle { color: #888; font-size: 1.1rem; margin-bottom: 0; }
.load-error { margin-top: 10px; color: #e74c3c; font-size: 0.9rem; }
.total-info { display: flex; align-items: center; gap: 10px; }
.export-btn { background: rgba(46, 204, 113, 0.08); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.3); padding: 6px 14px; border-radius: 50px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; font-size: 0.8rem; white-space: nowrap; }
.export-btn:hover { background: rgba(46, 204, 113, 0.18); border-color: #2ecc71; }
.print-btn { background: #fff; color: #000; border: none; padding: 9px 16px; border-radius: 999px; font-weight: 700; font-size: .78rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; transition: opacity .2s ease, transform .2s ease; }
.print-btn:hover { opacity: .85; transform: translateY(-1px); }
.print-btn:active { transform: translateY(0); }
.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 50px; }
.stat-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 12px; transition: all 0.3s; }
.stat-card:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.4); transform: translateY(-5px); }
.stat-icon { width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sales-icon { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
.transactions-icon { background: rgba(255, 255, 255, 0.1); color: #fff; }
.pending-icon { background: rgba(255, 166, 38, 0.1); color: #ffa726; }
.success-icon { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.failed-icon { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
.stat-content { display: flex; flex-direction: column; }
.stat-label { font-size: 0.8rem; font-weight: 500; color: #999; letter-spacing: 0.01em; }
.stat-value { font-size: 1.35rem; font-weight: 700; color: #fff; }
.report-tabs { display: flex; flex-wrap: nowrap; gap: 4px; margin-bottom: 0; background: rgba(255, 255, 255, 0.02); padding: 0 20px; border: 1px solid rgba(255, 255, 255, 0.08); border-bottom: none; border-radius: 14px 14px 0 0; width: 100%; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.report-tabs::-webkit-scrollbar { display: none; }
.tab-btn { position: relative; flex: 0 0 auto; padding: 14px 20px; border: none; background: transparent; color: #888; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: color 0.2s ease; white-space: nowrap; }
.tab-btn:hover { color: #fff; }
.tab-btn::after { content: ''; position: absolute; left: 16px; right: 16px; bottom: -1px; height: 2px; border-radius: 2px; background: transparent; transition: background 0.2s ease; }
.tab-btn.active { color: #fff; }
.tab-btn.active::after { background: #ffffff; }
.transactions-section { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 0 0 14px 14px; padding: 40px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; gap: 20px; flex-wrap: wrap; }
.section-header h2 { font-size: 1.5rem; font-weight: 800; white-space: nowrap; margin: 0; }
.header-main { display: flex; align-items: center; gap: 15px; }
.trx-header-main .badge-count { margin-left: 0; }
.trx-header-main .total-info { margin-left: auto; }
.header-filters { display: flex; gap: 15px; flex-grow: 1; justify-content: flex-end; }
.badge-count { background: rgba(255, 255, 255, 0.1); color: #ffffff; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.9rem; }
.search-box { position: relative; flex-grow: 1; max-width: 400px; }
.search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #555; }
.search-input { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 15px 12px 45px; border-radius: 12px; color: #fff; font-size: 0.9rem; outline: none; transition: all 0.3s; }
.search-input:focus { background: rgba(255, 255, 255, 0.08); border-color: #ffffff; box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
.custom-dropdown-container { position: relative; min-width: 180px; z-index: 10; }
.custom-dropdown-header { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 20px; border-radius: 12px; color: #fff; font-size: 0.9rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s; user-select: none; gap: 12px; }
.custom-dropdown-header:hover { background: rgba(255, 255, 255, 0.08); }
.custom-dropdown-header.is-active { border-color: #ffffff; box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
.dropdown-arrow { transition: transform 0.3s; color: #888; }
.filter-icon { display: none; }
.custom-dropdown-header.is-active .dropdown-arrow { transform: rotate(180deg); color: #ffffff; }
.custom-dropdown-options { position: absolute; top: calc(100% + 10px); left: 0; right: 0; background: #111; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
.dropdown-option { padding: 12px 20px; font-size: 0.9rem; color: #888; cursor: pointer; transition: all 0.2s; }
.dropdown-option:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.dropdown-option.is-selected { background: rgba(255, 255, 255, 0.2); color: #ffffff; font-weight: 700; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
.table-responsive { overflow-x: auto; scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.15) transparent; }
.table-responsive::-webkit-scrollbar { height: 4px; }
.table-responsive::-webkit-scrollbar-track { background: transparent; }
.table-responsive::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
.table-responsive::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
.premium-table { width: 100%; border-collapse: separate; border-spacing: 0 12px; }
.premium-table th { text-align: left; padding: 10px 20px; color: #888; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.02em; white-space: nowrap; }
.th-sortable { cursor: pointer; user-select: none; }
.th-sortable:hover .th-label { color: #fff; }
.th-label { display: inline-block; vertical-align: middle; }
.sort-icon { display: inline-block; vertical-align: middle; margin-left: 6px; color: #555; transition: transform 0.2s ease, color 0.2s ease; }
.th-sortable:hover .sort-icon { color: #fff; }
.sort-icon.active { color: #ffffff; }
.sort-icon.desc { transform: rotate(180deg); }
.premium-table td { padding: 18px 20px; background: rgba(255, 255, 255, 0.03); vertical-align: middle; font-size: 0.9rem; color: #d5d5d5; }
.premium-table tr td:first-child { border-radius: 15px 0 0 15px; }
.premium-table tr td:last-child { border-radius: 0 15px 15px 0; }
.invoice-no { color: #ffffff; font-weight: 600; }
.customer-info { display: flex; flex-direction: column; gap: 2px; }
.customer-name { font-weight: 600; font-size: 0.92rem; color: #fff; }
.customer-email, .customer-phone { font-size: 0.78rem; color: #888; }
.product-item-row { margin-bottom: 10px; }
.product-item-row:last-child { margin-bottom: 0; }
.product-detail { font-size: 0.88rem; color: #ccc; font-weight: 400; display: flex; flex-direction: column; gap: 2px; }
.product-name-text { color: #fff; font-weight: 600; }
.product-variant-info { font-size: 0.76rem; color: #888; font-weight: 400; }
.product-variant-info span { color: #fff; font-weight: 600; }
.product-meta { color: #777; font-weight: 400; margin-top: 2px; font-size: 0.8rem; }
.status-badge { padding: 5px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; white-space: nowrap; }
.price-val { font-weight: 700; font-size: 0.95rem; color: #fff; white-space: nowrap; }
.no-data-cell { text-align: center; color: #666; }
.pagination-wrapper { margin-top: 30px; display: flex; justify-content: space-between; align-items: center; }
.pagination-info { font-size: 0.9rem; color: #888; }
.pag-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 8px 20px; border-radius: 10px; cursor: pointer; margin-left: 10px; font-weight: 700; transition: all 0.2s; }
.pag-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.2); border-color: #ffffff; }
.pag-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.pag-num { min-width: 40px; padding: 8px 12px; text-align: center; margin-left: 8px; }
.pag-num.active { background: #fff; border-color: #fff; color: #000; }
.variant-name-cell { display: flex; flex-direction: column; gap: 2px; }
.v-name { font-weight: 600; color: #fff; font-size: 0.92rem; }
.v-product { font-size: 0.76rem; color: #888; }
.sku-code { background: none; padding: 0; border-radius: 0; font-size: 0.78rem; color: #fff; font-weight: 400; white-space: nowrap; }
.paid-val { color: #2ecc71; font-weight: 600; }
.pending-val { color: #ffa726; font-weight: 600; }
.expired-val { color: #e74c3c; font-weight: 600; }
.stock-status { padding: 4px 12px; border-radius: 50px; font-size: 0.85rem; font-weight: 800; }
.stock-status.in-stock { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
.stock-status.out-of-stock { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
.sold-out-row { background: rgba(231, 76, 60, 0.05) !important; }
.v-strikethrough { text-decoration: line-through; opacity: 0.6; }
.sold-out-text { font-size: 0.65rem; font-weight: 900; color: #e74c3c; background: rgba(231, 76, 60, 0.1); padding: 2px 6px; border-radius: 4px; width: fit-content; margin-top: 4px; }
.loading-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.spinner { width: 40px; height: 40px; border: 4px solid rgba(255, 255, 255, 0.1); border-top-color: #ffffff; border-radius: 50%; animation: spin-drs 1s linear infinite; }
@keyframes spin-drs { to { transform: rotate(360deg); } }
@media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; } }
@media (max-width: 1024px) {
  .report-container { padding: 32px 1.25rem; }
}
@media (max-width: 768px) {
  .live-report-page { padding-top: 65px; }
  .report-container { padding: 24px 1rem; }
  .page-title-section { text-align: left; margin-bottom: 28px; }
  .page-title-section h1 { font-size: 1.4rem; line-height: 1.2; }
  .subtitle { font-size: 0.88rem; }
  .stats-grid { display: flex; gap: 10px; overflow-x: auto; margin-bottom: 28px; padding-bottom: 8px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .stats-grid::-webkit-scrollbar { display: none; }
  .stats-grid .stat-card { flex: 0 0 210px; scroll-snap-align: start; }
  .stat-card { padding: 14px; gap: 12px; border-radius: 12px; }
  .stat-icon { width: 40px; height: 40px; }
  .stat-label { font-size: 0.74rem; }
  .stat-value { font-size: 1.1rem; word-break: break-word; }
  .section-header { flex-direction: column; align-items: stretch; gap: 15px; }
  .header-main { flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: space-between; gap: 10px; }
  .trx-header-main { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 8px; }
  .trx-header-main h2 { flex: 1 1 auto; font-size: 0.95rem; min-width: 0; }
  .trx-header-main .badge-count { margin-left: auto; }
  .trx-header-main .total-info { flex-basis: 100%; margin-left: 0; justify-content: stretch; }
  .trx-header-main .export-btn { flex: 1 1 auto; width: 100%; justify-content: center; padding: 12px 15px; font-size: 0.9rem; }
  .section-header h2 { font-size: 1.1rem; flex: 1 1 auto; min-width: 0; }
  .total-info { margin-left: auto; flex-shrink: 0; gap: 8px; }
  .badge-count { font-size: 0.68rem; padding: 4px 10px; white-space: nowrap; line-height: 1.2; }
  .header-filters { flex-direction: row; align-items: center; gap: 10px; }
  .search-box { flex: 1 1 auto; max-width: none; width: auto; min-width: 0; }
  .custom-dropdown-container { flex: 0 0 auto; width: auto; min-width: 0; }
  .custom-dropdown-container:only-child { margin-left: auto; }
  .custom-dropdown-header { width: 44px; height: 44px; padding: 0; justify-content: center; gap: 0; flex-shrink: 0; }
  .custom-dropdown-header .selected-label { display: none; }
  .custom-dropdown-header .dropdown-arrow { display: none; }
  .custom-dropdown-header .filter-icon { display: block; color: #fff; }
  .custom-dropdown-options { left: auto; right: 0; min-width: 180px; }
  .table-responsive { margin: 0 -12px; padding: 0 12px 8px 12px; -webkit-overflow-scrolling: touch; }
  .premium-table { min-width: 760px; border-spacing: 0 8px; }
  .premium-table tr td:first-child { border-radius: 8px 0 0 8px; }
  .premium-table tr td:last-child { border-radius: 0 8px 8px 0; }
  .premium-table th { padding: 8px 12px; font-size: 0.72rem; }
  .premium-table td { padding: 14px 12px; font-size: 0.82rem; }
  .customer-name { font-size: 0.85rem; }
  .customer-email, .customer-phone { font-size: 0.72rem; }
  .product-detail { font-size: 0.8rem; }
  .price-val { font-size: 0.88rem; }
  .pagination-wrapper { flex-direction: column; gap: 12px; align-items: flex-start; }
}
@media (min-width: 1024px) {
  .report-container { padding-left: 1.25rem; padding-right: 1.25rem; }
}
@media (max-width: 480px) {
  .report-container { padding: 20px .85rem; }
  .page-title-section { text-align: left; margin-bottom: 24px; }
  .page-title-section h1 { font-size: 1.2rem; }
  .subtitle { font-size: .82rem; }
  .stats-grid { gap: 10px; margin-bottom: 24px; }
  .stats-grid .stat-card { flex: 0 0 190px; }
  .stat-card { padding: 12px; gap: 10px; border-radius: 12px; }
  .stat-icon { width: 34px; height: 34px; border-radius: 8px; }
  .stat-label { font-size: .68rem; line-height: 1.3; }
  .stat-value { font-size: .98rem; }
  .transactions-section { padding: 20px 14px; border-radius: 0 0 10px 10px; }
  .section-header h2 { font-size: 1rem; }
  .trx-header-main h2 { font-size: 0.85rem; }
  .header-main { gap: 8px; }
  .badge-count { font-size: 0.62rem; padding: 3px 8px; }
  .report-tabs { padding: 0 12px; border-radius: 10px 10px 0 0; flex-wrap: nowrap; overflow-x: auto; }
  .tab-btn { flex: 0 0 auto; padding: 12px 14px; font-size: 0.82rem; }
  .export-btn { flex: 1 1 auto; width: 100%; justify-content: center; padding: 12px 15px; border-radius: 12px; font-size: 0.9rem; }
  .print-label { display: none; }
  .print-btn { padding: 9px; border-radius: 50%; }
  .resi-table { min-width: 960px; border-spacing: 0 8px; }
  .pag-num { min-width: 30px; padding: 5px 8px; font-size: 0.75rem; margin-left: 6px; border-radius: 8px; }
  .pagination-info { font-size: 0.8rem; }
}
</style>
