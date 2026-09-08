const PRODUCT = /\/products\/([^/]+)/
const pages = new Map()
const lock = { pop: false, busy: false }
const pane = document.querySelector('.product-dialog')
const homeTitle = document.title
const isOpen = () => pane && !pane.hasAttribute('hidden')

const idOf = (href) => new URL(href, location.origin).pathname.match(PRODUCT)?.[1]
const cardImg = (id) => document.querySelector(`[data-product="${id}"] img`)
const trans = (fn) => document.startViewTransition?.(fn) ?? (fn(), null)
const after = (vt, fn) => vt?.finished.then(fn, fn) ?? fn()
const name = (el, id) => {
  if (!el || !id) return
  el.style.viewTransitionName = `product-${id}`
  el.style.viewTransitionClass = 'product'
}
const unname = (el) => {
  el?.style.removeProperty('view-transition-name')
  el?.style.removeProperty('view-transition-class')
}
const mute = (on) => {
  document.getElementById('main').inert = on
  document.querySelector('.site-footer')?.toggleAttribute('inert', on)
}

const html = (href) => {
  const hit = pages.get(href)
  if (hit) return hit
  const req = fetch(href).then((r) => r.text()).then((text) => {
    const doc = new DOMParser().parseFromString(text, 'text/html')
    const src = doc.querySelector('.product-page source')?.srcset
      || doc.querySelector('.product-page img')?.src
    if (src) new Image().src = src.split(/\s/)[0]
    return doc
  })
  pages.set(href, req)
  return req
}

const open = (href) => {
  if (lock.busy || isOpen()) return
  lock.busy = true
  const idle = () => { lock.busy = false }
  html(href).then((doc) => {
    const page = doc.querySelector('.product-page')
    if (!page) return location.assign(href)
    const id = idOf(href)
    const from = cardImg(id)
    if (!history.state?.overlay) history.pushState({ overlay: href }, '', href)
    name(from, id)
    const vt = trans(() => {
      pane.replaceChildren(page.cloneNode(true))
      unname(from)
      pane.removeAttribute('hidden')
      mute(true)
      document.title = doc.title
    })
    after(vt, () => pane.querySelector('.back')?.focus())
  }).then(idle, idle)
}

const close = (pop = false) => {
  if (!isOpen()) return
  const id = idOf(location.href)
  const to = cardImg(id)
  const go = !pop && history.state?.overlay
  const vt = trans(() => {
    unname(pane.querySelector('img'))
    pane.setAttribute('hidden', '')
    mute(false)
    document.title = homeTitle
    name(to, id)
  })
  after(vt, () => {
    unname(to)
    pane.replaceChildren()
    if (!go) return
    lock.pop = true
    history.back()
  })
}

if (pane) {
  document.addEventListener('pointerover', (event) => {
    const link = event.target.closest?.('.card-link')
    if (link && document.querySelector('.products')) html(link.href)
  })

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('.card-link')
    if (link && document.querySelector('.products')) {
      event.preventDefault()
      open(link.href)
      return
    }
    if (isOpen()) {
      if (event.target.closest('a.back')) event.preventDefault()
      if (event.target.closest('a.back') || !event.target.closest('a, button')) close()
      return
    }
    if (event.target.closest('a, button') || !event.target.closest('#main:has(.product-detail)')) return
    const href = document.querySelector('.back')?.href
    if (href) location.assign(href)
  })

  addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    if (isOpen()) {
      event.preventDefault()
      close()
      return
    }
    const href = document.querySelector('#main:has(.product-detail) .back')?.href
    if (href) location.assign(href)
  })

  addEventListener('popstate', () => {
    if (lock.pop) {
      lock.pop = false
      return
    }
    idOf(location.href) ? open(location.href) : close(true)
  })
}
