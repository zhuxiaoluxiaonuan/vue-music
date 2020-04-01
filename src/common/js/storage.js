import storage from 'good-storage'
const PAGE_KEY = '__page__'
const TAB_KEY = '__tabIndex__'
export function savePage(key, val) {
  const page = storage.get(PAGE_KEY, {})
  page[key] = val
  storage.set(PAGE_KEY, page)
}
export function loadPage(key, def) {
  const page = storage.get(PAGE_KEY, {})
  if (!page[key]) {
    return def
  }
  return page[key] || def
}
export function saveTab(key, val) {
  const tab = storage.get(TAB_KEY, {})
  tab[key] = val
  storage.set(TAB_KEY, tab)
}
export function loadTab(key, def) {
  const tab = storage.get(TAB_KEY, {})
  if (!tab[key]) {
    return def
  }
  return tab[key] || def
}
