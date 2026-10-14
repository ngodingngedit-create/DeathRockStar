<script>
const first = (...vals) => vals.find((v) => v !== undefined && v !== null && v !== '') ?? ''

export function buildResiData(o = {}) {
  const r = o.raw || o || {}
  const addr = r.shipping_address || {}
  const manifest = r.latest_manifest || {}
  const courier = r.courier || {}
  const items = Array.isArray(o.items) ? o.items : []
  return {
    courierName: String(first(r.shipping_method, manifest.courier_name, courier.main, courier.courier_company, 'JNE')).toUpperCase(),
    courierService: String(first(r.shipping_service, courier.courier_type, 'REG')).toUpperCase(),
    trackingNumber: String(first(manifest.waybill, r.tracking_number, r.awb, courier.tracking_number, 'KLTRX-' + String(o.invoice_no || '').replace(/[^A-Z0-9]/gi, '').substring(0, 10).toUpperCase())),
    deliveryPrice: Number(first(r.delivery_price, r.shipping_cost, r.shipping_price, 9000)) || 0,
    referenceNumber: String(o.invoice_no || '-'),
    receiverName: String(first(addr.nama_penerima, o.customer?.name, 'Guest')),
    receiverPhone: String(first(addr.phone, o.customer?.phone, '-')),
    receiverAddr: [addr.address_detail, addr.city_name || addr.city, addr.province_name || addr.province, addr.zipcode || addr.zip_code].filter(Boolean).filter((p) => p !== '-').join(', ') || '-',
    senderName: 'deelestari',
    senderPhone: '0811182844',
    senderAddr: 'Perumahan Diamond Valley blok A2 no 1, bedahan Sawangan, Jl. H. Sulaiman, Kec. Sawangan, Kota Depok, Jawa Barat, Sawangan, Depok, Jawa Barat',
    products: items.map((i) => `${i.qty}x ${i.product_name}${i.variant_name && i.variant_name !== '-' ? ` [${i.variant_name}]` : ''}`),
    qty: o.total_qty || 0,
    total: Number(o.total_price || 0),
    notes: String(first(r.order_notes, r.notes, r.note, 'mechanise deelestari')),
    status: String(o.status || '-'),
  }
}
</script>

<script setup>
defineProps({ resi: { type: Object, required: true } })
const rp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')
</script>

<template>
  <div style="width:560px;background:#fff;color:#000;font-family:Arial,sans-serif;font-size:13px;line-height:1.4;padding:16px;border:2px solid #000;">
    <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:8px;">
      <div style="font-size:30px;font-weight:bold;letter-spacing:2px;">{{ resi.courierName }}</div>
      <div style="font-size:12px;">EXPRESS ACROSS NATIONS</div>
    </div>
    <div style="text-align:center;font-size:12px;border-bottom:1px dashed #000;padding-bottom:8px;margin-bottom:8px;">kolektix.com</div>
    <div style="text-align:center;font-size:15px;font-weight:bold;border:2px solid #000;background:#f5f5f5;padding:8px;margin-bottom:8px;">Nomor Resi - {{ resi.trackingNumber }}</div>
    <div style="text-align:center;border:2px solid #000;padding:10px;margin-bottom:8px;">
      <div style="font-family:monospace;font-size:14px;font-weight:bold;">{{ resi.referenceNumber }}</div>
    </div>
    <div style="border-bottom:1px solid #000;padding:6px 0;margin-bottom:8px;font-size:12px;">
      <strong>Ongkos Kirim:</strong> {{ rp(resi.deliveryPrice) }} &nbsp; <strong>Layanan:</strong> {{ resi.courierService }}
    </div>
    <div style="border:2px solid #000;background:#f5f5f5;padding:8px;margin-bottom:8px;">
      <div style="font-weight:bold;margin-bottom:4px;">Reference Number</div>
      <div style="font-family:monospace;font-size:13px;">{{ resi.referenceNumber }}</div>
    </div>
    <div style="border:2px solid #000;margin-bottom:8px;">
      <div style="padding:8px;border-bottom:2px solid #000;">
        <div style="font-weight:bold;text-decoration:underline;margin-bottom:4px;">Alamat Penerima:</div>
        <div style="font-weight:bold;">{{ resi.receiverName }}</div>
        <div>{{ resi.receiverPhone }}</div>
        <div>{{ resi.receiverAddr }}</div>
      </div>
      <div style="padding:8px;">
        <div style="font-weight:bold;text-decoration:underline;margin-bottom:4px;">Alamat Pengirim:</div>
        <div style="font-weight:bold;">{{ resi.senderName }}</div>
        <div>{{ resi.senderPhone }}</div>
        <div>{{ resi.senderAddr }}</div>
      </div>
    </div>
    <div style="border:2px solid #000;background:#f5f5f5;padding:8px;margin-bottom:8px;">
      <div style="font-weight:bold;text-decoration:underline;margin-bottom:4px;">Jenis Barang:</div>
      <div v-for="(p, i) in resi.products" :key="i">{{ p }}</div>
      <div v-if="!resi.products.length">-</div>
      <div style="font-weight:bold;margin-top:4px;">Qty: {{ resi.qty }} &nbsp; Total: {{ rp(resi.total) }}</div>
    </div>
    <div style="border:2px solid #000;background:#f5f5f5;padding:8px;font-style:italic;margin-bottom:8px;">Catatan: {{ resi.notes }}</div>
    <div style="border-top:2px solid #000;padding-top:8px;text-align:center;font-size:11px;">Pengiriman dari Warehouse<br>kolektix.com</div>
  </div>
</template>
<!-- ponytail: QR code dilewati agar PDF tidak blank karena gambar eksternal butuh CORS, tambah <img crossorigin> + html2canvas useCORS saat dibutuhkan. -->
