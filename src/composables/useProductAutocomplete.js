import { ref } from 'vue'

const BASE = import.meta.env.VITE_API_URL || 'https://api.kolektix.com'

export function mapItem(p = {}, idx = 0) {
  if (typeof p === 'string') return { id: `s-${idx}`, slug: '', name: p, price: '', image: '', category: 'Merch' }
  const varians = p.product_varian || p.productVarian || p.varians || []
  const priceNum = Number(p.price || varians[0]?.price || 0) || 0
  const img = p.image_url || p.image || p.thumbnail || p.product_image?.[0]?.image_url || ''
  return {
    id: p.id ?? p.product_id ?? p.slug ?? `p-${idx}`,
    slug: p.slug || p.slug_url || '',
    name: String(p.product_name || p.name || p.title || p.label || p.text || '-'),
    price: priceNum ? 'Rp ' + priceNum.toLocaleString('id-ID') : String(p.price_display || p.price || ''),
    image: img,
    category: String(p.category || p.creator?.name || p.has_creator?.name || 'Merch'),
  }
}

function normalizeList(json) {
  if (Array.isArray(json)) return json
  if (!json || typeof json !== 'object') return []
  const cand = json.data ?? json.results ?? json.suggestions ?? json.products ?? json.items ?? []
  if (Array.isArray(cand)) return cand
  if (cand && typeof cand === 'object' && Array.isArray(cand.data)) return cand.data
  return []
}

let cache = null

async function loadAll() {
  if (cache) return cache
  const r = await fetch(`${BASE}/api/product?creator_id=127`, { headers: { Accept: 'application/json' } })
  const j = await r.json().catch(() => ({}))
  cache = normalizeList(j).map(mapItem)
  return cache
}

// ponytail: endpoint /autocomplete mengembalikan 404, jadi kita filter client-side dari /api/product?creator_id=127.
// Ganti dengan query server-side (mis. /api/product/search?q=) saat backend sudah support.
export function useProductAutocomplete() {
  const results = ref([])
  const loading = ref(false)
  let timer = null

  const search = (q) => {
    clearTimeout(timer)
    if (!q || !String(q).trim()) { results.value = []; loading.value = false; return }
    timer = setTimeout(async () => {
      loading.value = true
      try {
        const all = await loadAll()
        const needle = String(q).toLowerCase().trim()
        results.value = all
          .filter((p) => p.name.toLowerCase().includes(needle) || String(p.slug || '').toLowerCase().includes(needle))
          .slice(0, 8)
      } catch {
        results.value = []
      } finally {
        loading.value = false
      }
    }, 200)
  }

  return { results, loading, search }
}