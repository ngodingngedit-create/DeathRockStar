import { ref, computed } from 'vue'

export const cartItems = ref([])
export const isCartOpen = ref(false)

// Find product in cart
const findItem = (id) => cartItems.value.find(item => item.id === id)

// Get quantity of a product in cart (defaults to 0), summing up all variants for a base product ID
export const getItemQuantity = (id) => {
  const baseId = String(id).split('-')[0]
  return cartItems.value
    .filter(item => String(item.id).split('-')[0] === baseId)
    .reduce((total, item) => total + item.quantity, 0)
}

// Get quantity of a specific variant in the cart
export const getVariantQuantity = (productId, size = '', color = '') => {
  const itemId = size && color ? `${productId}-${size}-${color}` : productId
  const existing = findItem(itemId)
  return existing ? existing.quantity : 0
}

// Set a specific variant's quantity directly (or remove if 0)
export const setCartItemQuantity = (product, size = '', color = '', quantity = 0) => {
  const itemId = size && color ? `${product.id}-${size}-${color}` : product.id
  const itemName = size && color ? `${product.name} (${size} / ${color})` : product.name

  const existing = findItem(itemId)
  if (quantity <= 0) {
    if (existing) {
      removeItem(itemId)
    }
  } else {
    if (existing) {
      existing.quantity = quantity
    } else {
      cartItems.value.push({
        id: itemId,
        name: itemName,
        price: product.price,
        priceNum: parseInt(product.price.replace(/[^\d]/g, '')),
        image: product.image,
        category: product.category,
        quantity: quantity
      })
    }
  }
}

// Add item or increment quantity, supporting size/color variants and custom quantities
export const addItem = (product, size = '', color = '', quantity = 1) => {
  const itemId = size && color ? `${product.id}-${size}-${color}` : product.id
  const itemName = size && color ? `${product.name} (${size} / ${color})` : product.name

  const existing = findItem(itemId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cartItems.value.push({
      id: itemId,
      name: itemName,
      price: product.price,
      priceNum: parseInt(product.price.replace(/[^\d]/g, '')),
      image: product.image,
      category: product.category,
      quantity: quantity
    })
  }
}

// Decrement quantity or remove if 0
export const decrementItem = (id) => {
  const existing = findItem(id)
  if (!existing) return

  if (existing.quantity > 1) {
    existing.quantity--
  } else {
    removeItem(id)
  }
}

// Remove item completely
export const removeItem = (id) => {
  const idx = cartItems.value.findIndex(item => item.id === id)
  if (idx !== -1) {
    cartItems.value.splice(idx, 1)
  }
}

// Computed helper for total items count
export const totalItemsCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// Computed helper for total cart price
export const totalCartPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.priceNum * item.quantity), 0)
})

// Format price helper (e.g. Rp 149.000)
export const formatPrice = (price) => {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(price)
}

// Formatted total cart price string
export const formattedTotalCartPrice = computed(() => {
  return formatPrice(totalCartPrice.value)
})
