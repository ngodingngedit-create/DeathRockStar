import { ref, computed } from 'vue'

const BASE_URL = 'https://api.kolektix.com'

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
})()

export const currentUser = ref(storedUser)
export const authToken = ref(localStorage.getItem('token') || null)

export const isLoggedIn = computed(() => currentUser.value !== null && authToken.value !== null)

export const isAdmin = computed(() => {
  const u = currentUser.value
  if (!u) return false
  const role = String(u.role || u.role_name || u.level || '').toLowerCase()
  return role.includes('admin') || role === 'superadmin' || u.is_admin === 1 || u.is_admin === true
})

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/login-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Email atau password salah.')
  currentUser.value = data.data || null
  authToken.value = data.access_token || null
  localStorage.setItem('user', JSON.stringify(currentUser.value))
  if (authToken.value) localStorage.setItem('token', authToken.value)
  return currentUser.value
}

export const logout = () => {
  currentUser.value = null
  authToken.value = null
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}
