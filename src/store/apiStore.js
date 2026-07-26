import { ref } from 'vue';
import axios from 'axios';

// Get base URL from environment config
export const API_URL = import.meta.env.VITE_API_URL || 'https://api.kolektix.my.id';

export const events = ref([]);
export const products = ref([]);
export const isEventsLoading = ref(false);
export const isProductsLoading = ref(false);
export const eventsError = ref(null);
export const productsError = ref(null);

// Mapper function for merchandise
export function mapAPIProductToLocal(item, creatorsList = []) {
  const name = item.product_name || item.name || 'Unnamed Product';

  let rawPrice = 0;
  const promoPriceNum = item.promo_price ? parseFloat(item.promo_price) : 0;
  const priceNum = item.price ? parseFloat(item.price) : 0;
  const itemVarians = item.varians || item.product_varian || item.productVarian || [];
  
  if (promoPriceNum > 0) {
    rawPrice = promoPriceNum;
  } else if (priceNum > 0) {
    rawPrice = priceNum;
  } else if (item.starting_price) {
    rawPrice = parseFloat(item.starting_price);
  } else if (itemVarians.length > 0) {
    const firstVarian = itemVarians[0];
    const varPromo = firstVarian.promo_price ? parseFloat(firstVarian.promo_price) : 0;
    const varPrice = firstVarian.price ? parseFloat(firstVarian.price) : 0;
    rawPrice = varPromo > 0 ? varPromo : varPrice;
  }
  
  const formattedPrice = 'Rp ' + new Intl.NumberFormat('id-ID').format(rawPrice || 100000);

  let image = '';
  const itemImages = item.images || item.product_image || item.productImage || [];
  if (itemImages.length > 0 && itemImages[0].image_url) {
    image = itemImages[0].image_url;
  } else {
    image = item.image_url || item.image || item.thumbnail_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2574&auto=format&fit=crop';
  }

  const allImages = itemImages.length > 0 ? itemImages.map(img => img.image_url) : [image];

  const descriptionHtml = item.description || 'No description available for this item.';
  const cleanDesc = descriptionHtml.replace(/<[^>]*>/g, '');
  const description = {
    id: cleanDesc,
    en: cleanDesc
  };

  let stock = 0;
  if (itemVarians.length > 0) {
    stock = itemVarians.reduce((sum, v) => sum + (parseInt(v.stock_qty ?? v.stock ?? v.qty ?? 0, 10) || 0), 0);
  } else if (item.stock_qty !== undefined && item.stock_qty !== null) {
    stock = parseInt(item.stock_qty, 10) || 0;
  } else if (item.qty !== undefined && item.qty !== null) {
    stock = parseInt(item.qty, 10) || 0;
  } else if (item.stock !== undefined && item.stock !== null) {
    stock = parseInt(item.stock, 10) || 0;
  }

  let label = '';
  if (stock === 0) {
    label = 'SOLD OUT';
  } else if (item.is_preorder === 1) {
    label = 'PRE-ORDER';
  } else if (item.is_promo === 1) {
    label = 'LIMITED';
  } else if (item.id % 2 === 0) {
    label = 'BEST SELLER';
  }

  let sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  let colors = [
    { name: 'Pure Black', hex: '#000000' },
    { name: 'Pure White', hex: '#ffffff' },
    { name: 'Dark Grey', hex: '#2C2C2C' }
  ];

  const varians = itemVarians.map(v => ({
    id: v.id,
    sku: v.sku,
    name: v.varian_name || v.name || v.size || '',
    size: v.size || v.varian_name || '',
    color: v.color || '',
    stock: parseInt(v.stock_qty ?? v.stock ?? v.qty ?? 0, 10) || 0
  }));

  if (itemVarians.length > 0) {
    const extractedSizes = [...new Set(itemVarians.map(v => v.size || v.varian_name).filter(Boolean))];
    const extractedColors = [...new Set(itemVarians.map(v => v.color).filter(Boolean))];
    if (extractedSizes.length > 0) sizes = extractedSizes;
    if (extractedColors.length > 0) {
      colors = extractedColors.map(c => {
        let hex = '#2C2C2C';
        if (c.toLowerCase().includes('black')) hex = '#000000';
        if (c.toLowerCase().includes('white')) hex = '#ffffff';
        if (c.toLowerCase().includes('blue')) hex = '#0d5ef4';
        if (c.toLowerCase().includes('red')) hex = '#ef4444';
        return { name: c, hex };
      });
    }
  }

  const rating = item.average_star || '4.8';
  const soldCount = item.total_sold ? `${item.total_sold}+` : '100+';

  const matchedCreator = (creatorsList || []).find(c => c.id === item.creator_id) || item.creator;
  const sellerName = matchedCreator?.name || 'moofeet';

  let sellerAvatar = 'https://api.kolektix.my.id/storage/uploads/creator/logo-k.png';
  if (matchedCreator && matchedCreator.image_url) {
    if (matchedCreator.image_url.endsWith('/creator') && matchedCreator.image) {
      sellerAvatar = `${matchedCreator.image_url}/${matchedCreator.image}`;
    } else if (matchedCreator.image_url.endsWith('/creator')) {
      sellerAvatar = `${matchedCreator.image_url}/logo-k.png`;
    } else {
      sellerAvatar = matchedCreator.image_url;
    }
  }
  const sellerType = matchedCreator?.creator_title || 'Official Store';

  let category = 'Pakaian';
  const lowerName = name.toLowerCase();
  if (lowerName.includes('tee') || lowerName.includes('shirt') || lowerName.includes('hoodie') || lowerName.includes('varian') || lowerName.includes('payload')) {
    category = 'Pakaian';
  } else if (lowerName.includes('bag') || lowerName.includes('cap') || lowerName.includes('beanie') || lowerName.includes('sticker') || lowerName.includes('socks')) {
    category = 'Aksesoris';
  } else if (lowerName.includes('mug') || lowerName.includes('coffee')) {
    category = 'Kebutuhan Harian';
  } else if (lowerName.includes('bundle') || lowerName.includes('pack')) {
    category = 'Bundling';
  }

  let sizeChartImage = 'https://api.kolektix.com/storage/uploads/products/product_6a21cabdaeaee.jpeg';
  if (item.size_chart_image) {
    sizeChartImage = item.size_chart_image.startsWith('http') ? item.size_chart_image : `${API_URL}/storage/uploads/products/${item.size_chart_image}`;
  } else if (item.size_chart_url) {
    sizeChartImage = item.size_chart_url;
  }

  return {
    id: item.id,
    name,
    price: formattedPrice,
    priceNum: rawPrice,
    image,
    category,
    description,
    stock,
    varians,
    label,
    sizes,
    colors,
    images: allImages,
    rating,
    soldCount,
    sellerName,
    sellerAvatar,
    sellerType,
    sizeChartImage
  };
}

// Mapper function for events
export function mapAPIEventToLocal(item) {
  const dateStr = item.start_date || '2026-06-15';
  const dateObj = new Date(dateStr);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
  const month = monthNames[dateObj.getMonth()] || 'JUN';
  const year = String(dateObj.getFullYear());

  let image = '';
  if (item.image) {
    if (item.image.startsWith('http')) {
      image = item.image;
    } else {
      image = `${API_URL}/uploads/${item.image}`;
    }
  } else {
    image = 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2570&auto=format&fit=crop';
  }

  let price = 150000;
  const tickets = item.has_event_ticket || item.tickets || [];
  if (tickets.length > 0) {
    const prices = tickets.map(t => parseFloat(t.price || 0)).filter(p => p > 0);
    if (prices.length > 0) {
      price = Math.min(...prices);
    }
  }

  const time = `${item.start_time || '19:00'} - ${item.end_time || '23:00'} ${item.zone_time || 'WIB'}`;
  const desc = item.description ? item.description.replace(/<[^>]*>/g, '') : 'Malam penuh dentuman musik dan euforia tanpa henti. Bersiaplah untuk merasakan pengalaman live yang tak terlupakan bersama lineup terbaik pilihan Death Rock Star.';

  return {
    id: item.id,
    title: item.name || 'Unnamed Event',
    date: dateStr,
    day,
    month,
    year,
    location: item.location_city || 'Jakarta',
    venue: item.location_name || 'Live House, Jakarta',
    address: item.location_address || 'Jakarta',
    time,
    image,
    category: item.tag?.toUpperCase() || 'LIVE HOUSE',
    price,
    desc,
    isFavorite: false,
    ticketLink: '#events'
  };
}

export async function fetchEvents() {
  if (isEventsLoading.value) return;
  isEventsLoading.value = true;
  eventsError.value = null;
  try {
    const res = await axios.get(`${API_URL}/api/event`);
    if (res.data && Array.isArray(res.data.data)) {
      events.value = res.data.data.map(mapAPIEventToLocal);
    } else {
      throw new Error('Format respon API event tidak valid.');
    }
  } catch (err) {
    console.error('Gagal mengambil data event dari API:', err);
    eventsError.value = err;
  } finally {
    isEventsLoading.value = false;
  }
}

export async function fetchProducts() {
  if (isProductsLoading.value) return;
  isProductsLoading.value = true;
  productsError.value = null;
  try {
    const res = await axios.get(`${API_URL}/api/product?creator_id=146`);
    let rawProducts = [];
    let creatorsList = [];

    if (Array.isArray(res.data)) {
      rawProducts = res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      rawProducts = res.data.data;
      creatorsList = res.data.affiliate_creators || res.data.creators || [];
    } else if (res.data && res.data.products && Array.isArray(res.data.products.data)) {
      rawProducts = res.data.products.data;
      creatorsList = res.data.affiliate_creators || res.data.creators || [];
    } else if (res.data && Array.isArray(res.data.products)) {
      rawProducts = res.data.products;
      creatorsList = res.data.affiliate_creators || res.data.creators || [];
    } else {
      throw new Error('Format respon API produk tidak valid.');
    }

    products.value = rawProducts.map(item => mapAPIProductToLocal(item, creatorsList));
  } catch (err) {
    console.error('Gagal mengambil data produk dari API:', err);
    productsError.value = err;
  } finally {
    isProductsLoading.value = false;
  }
}
