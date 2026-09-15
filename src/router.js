export const pathToHash = {
  '/': '#home',
  '/merch': '#merch-page',
  '/live-report': '#live-report',
  '/login': '#login',
  '/transaction/merch': '#transaction-merch',
  '/transaction/event': '#transaction-event',
}

const hashToPath = Object.fromEntries(Object.entries(pathToHash).map(([k, v]) => [v, k]))

const toHash = (target) => {
  if (!target) return '#home'
  if (target.startsWith('#/')) return '#' + target.slice(2)
  if (target.startsWith('#')) return target
  if (target.startsWith('/')) return pathToHash[target] || '#home'
  return '#' + target
}

export function getRoute() {
  let hash = window.location.hash
  if (hash && hash !== '#') {
    if (hash.startsWith('#/')) hash = '#' + hash.slice(2)
    if (hash === '#live-report' || hashToPath[hash] || hash.startsWith('#event-detail-')) return hash
    return hash
  }
  return pathToHash[window.location.pathname] || '#home'
}

export function navigate(target) {
  const hash = toHash(target)
  window.location.hash = hash
  const path = hashToPath[hash] || window.location.pathname
  window.history.replaceState({}, '', path + window.location.search + hash)
}

export function listenCleanUrl() {
  const sync = () => {
    const hash = getRoute()
    const path = hashToPath[hash] || window.location.pathname
    const url = path + window.location.search + hash
    if (window.location.pathname !== path || window.location.hash !== hash) {
      window.history.replaceState({}, '', url)
    }
  }
  window.addEventListener('hashchange', sync)
  window.addEventListener('popstate', sync)
  sync()
}

export function resolveInitialRoute() {
  const path = window.location.pathname
  const hash = window.location.hash
  if (!hash && pathToHash[path]) {
    const h = pathToHash[path]
    window.location.hash = h
    window.history.replaceState({}, '', path + window.location.search + h)
    return true
  }
  return false
}
