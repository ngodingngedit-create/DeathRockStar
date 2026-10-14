const normalizePath = (p) => {
  if (!p) return '/'
  let path = String(p).trim() || '/'
  if (!path.startsWith('/')) path = '/' + path
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path
}

export function getRoute() {
  return normalizePath(window.location.pathname)
}

export function getEventSlug(route) {
  const path = normalizePath(route || getRoute())
  if (path.startsWith('/event/')) return decodeURIComponent(path.slice('/event/'.length))
  return ''
}

export function isEventDetailRoute(route) {
  return normalizePath(route || getRoute()).startsWith('/event/')
}

export function navigate(target, opts = {}) {
  const path = normalizePath(target)
  const url = path + window.location.search
  if (normalizePath(window.location.pathname) === path && !opts.force) {
    window.history.replaceState({}, '', url)
  } else if (opts.replace) {
    window.history.replaceState({}, '', url)
  } else {
    window.history.pushState({}, '', url)
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function listenRouteChange(cb) {
  const handler = () => cb(getRoute())
  window.addEventListener('popstate', handler)
  return () => window.removeEventListener('popstate', handler)
}

export function initRoute() {
  const url = normalizePath(window.location.pathname) + window.location.search
  window.history.replaceState({}, '', url)
  return normalizePath(window.location.pathname)
}
