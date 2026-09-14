const pathToHash = {
  '/': '#home',
  '/merch': '#merch-page',
  '/live-report': '#live-report',
  '/login': '#login',
  '/transaction/merch': '#transaction-merch',
  '/transaction/event': '#transaction-event',
}

const hashToPath = Object.fromEntries(Object.entries(pathToHash).map(([k, v]) => [v, k]))

export function navigate(hash) {
  if (!hash) hash = '#home'
  window.location.hash = hash
  const path = hashToPath[hash] || '/'
  window.history.replaceState({}, '', path)
}

export function listenCleanUrl() {
  const sync = () => {
    const hash = window.location.hash || '#home'
    const path = hashToPath[hash] || '/'
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', path)
    }
  }
  window.addEventListener('hashchange', sync)
  sync()
}

export function resolveInitialRoute() {
  const path = window.location.pathname
  const hash = window.location.hash
  if (!hash && pathToHash[path]) {
    window.history.replaceState({}, '', path)
    window.location.hash = pathToHash[path]
    return true
  }
  return false
}
