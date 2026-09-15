<script setup>
import { ref, computed } from 'vue'
import { currentUser, authToken } from '../store/auth.js'
import { currentLang, setLang, t } from '../store/lang.js'
import { navigate } from '../router.js'

// ponytail: bypass sementara, Lanjutkan langsung masuk dashboard tanpa OTP;
// upgrade path: kembalikan step OTP + handleVerify memanggil POST /api/login-auth.
const email = ref('admin@deathrockstar.com')
const emailError = ref('')
const loading = ref(false)

const handleContinue = () => {
  emailError.value = ''
  if (!email.value.trim()) {
    emailError.value = t('loginErrEmailEmpty')
    return
  }
  if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
    emailError.value = t('loginErrEmailInvalid')
    return
  }
  loading.value = true
  const mockUser = { name: 'Admin', email: email.value.trim(), role: 'admin' }
  currentUser.value = mockUser
  authToken.value = 'dev-token'
  localStorage.setItem('user', JSON.stringify(mockUser))
  localStorage.setItem('token', 'dev-token')
  navigate('/live-report')
  loading.value = false
}

const toggleLang = () => setLang(currentLang.value === 'id' ? 'en' : 'id')
const flagLabel = computed(() => (currentLang.value === 'id' ? 'ID' : 'EN'))
</script>

<template>
  <div class="login-page">
    <div class="login-shell">
      <section class="login-brand">
       
        <div class="brand-logo">
          <img src="/logo/logo.png" alt="Death Rock Star" />
          <span class="brand-word">DEATHROCKSTAR</span>
        </div>
      </section>

      <section class="login-panel">
        <button class="lang-fab" @click="toggleLang" :aria-label="flagLabel">
          <svg v-if="currentLang === 'id'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" width="20" height="13"><rect width="24" height="8" fill="#E22026"/><rect y="8" width="24" height="8" fill="#fff"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="20" height="13"><rect width="50" height="30" fill="#012169"/><path d="M0 0 L50 30 M50 0 L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0 L50 30 M50 0 L0 30" stroke="#C8102E" stroke-width="4"/><path d="M25 0 V30 M0 15 H50" stroke="#fff" stroke-width="10"/><path d="M25 0 V30 M0 15 H50" stroke="#C8102E" stroke-width="6"/></svg>
        </button>

        <div class="panel-inner">
          <h1 class="panel-title">{{ t('loginTitle') }}</h1>
          <form @submit.prevent="handleContinue" class="login-form" novalidate>
            <label class="field">
              <span class="field-label">{{ t('loginEmail') }}</span>
              <span class="field-box" :class="{ invalid: emailError }">
                <input type="email" v-model="email" placeholder="name@example.com" @input="emailError = ''" />
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </span>
              <span v-if="emailError" class="field-error">{{ emailError }}</span>
            </label>
            <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? t('loginProcessing') : t('loginContinue') }}</button>
          </form>
          <a href="/" class="back-link" @click.prevent="navigate('/')">← {{ t('loginBack') }}</a>
        </div>

        <p class="hub-mark">{{ t('loginHub') }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.login-page { min-height: 100vh; background: #000; color: #fff; display: flex; font-family: var(--font-body); }
.login-shell { display: grid; grid-template-columns: 1.15fr 1fr; width: 100%; min-height: 100vh; }
.login-brand { background: linear-gradient(160deg, #171717 0%, #050505 70%); border-right: 1px solid rgba(255,255,255,.08); border-radius: 0 16px 16px 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 18px; padding: 48px; text-align: center; position: relative; overflow: hidden; }
.login-brand::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.08), transparent 45%); pointer-events: none; }
.brand-logo { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.brand-logo img { width: 150px; height: auto; filter: brightness(0) invert(1); }
.brand-word { font-family: var(--font-heading); font-weight: 800; letter-spacing: .18em; font-size: 1.1rem; }
.brand-desc { color: #9a9a9a; max-width: 340px; margin: 0; font-size: .95rem; }
.login-panel { position: relative; background: #0b0b0b; display: flex; flex-direction: column; justify-content: center; padding: 90px 72px 40px; }
.lang-fab { position: absolute; top: 28px; right: 28px; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.04); display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; }
.lang-fab svg { border-radius: 3px; display: block; }
.panel-inner { max-width: 430px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; }
.panel-title { font-family: var(--font-heading); font-size: 2rem; font-weight: 800; margin: 0 0 8px; text-transform: none; letter-spacing: 0; }
.login-form { display: flex; flex-direction: column; gap: 22px; margin-top: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; text-align: left; }
.field-label { font-size: .85rem; font-weight: 700; color: #d5d5d5; }
.field-box { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,.22); padding: 8px 2px 10px; transition: border-color .2s; }
.field-box:focus-within { border-color: #fff; }
.field-box.invalid { border-color: #e74c3c; }
.field-box input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: .98rem; min-width: 0; }
.field-box input::placeholder { color: #5f5f5f; }
.field-icon { color: #fff; flex-shrink: 0; }
.field-box.invalid .field-icon { color: #e74c3c; }
.field-error { font-size: .78rem; color: #ff8a7a; font-weight: 600; }
.btn-primary { background: #fff; color: #000; border: none; border-radius: 12px; padding: 15px; font-size: .95rem; font-weight: 800; cursor: pointer; transition: opacity .2s, transform .2s; }
.btn-primary:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: .55; cursor: not-allowed; }
.back-link { margin-top: 18px; text-align: center; color: #666; font-size: .82rem; }
.back-link:hover { color: #fff; }
.hub-mark { position: absolute; bottom: 22px; right: 28px; font-size: .68rem; letter-spacing: .16em; font-weight: 800; color: #cfcfcf; margin: 0; }
@media (max-width: 992px) {
  .lang-fab { display: none; }
  .hub-mark { display: none; }
  .login-shell { grid-template-columns: 1fr; }
  .login-brand { border-radius: 0 0 26px 26px; border-right: none; border-bottom: 1px solid rgba(255,255,255,.08); padding: 48px 22px 56px; min-height: 30vh; }
  .brand-logo { margin-top: 14px; }
  .brand-logo img { width: 104px; }
  .brand-word { font-size: .95rem; }
  .brand-desc { font-size: .85rem; }
  .login-panel { border-radius: 26px 26px 0 0; margin-top: -36px; padding: 36px 22px 72px; }
  .panel-title { font-size: 1.65rem; }
  .hub-mark { left: 0; right: 0; text-align: center; bottom: 18px; }
}
@media (max-width: 480px) {
  .login-brand { padding: 42px 18px 52px; }
  
  .panel-title { font-size: 1.45rem; }
  .btn-primary { padding: 14px; border-radius: 11px; }
}
</style>
