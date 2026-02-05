/**
 * Driver que conecta VueFinder con el backend Laravel (API /api/files).
 * Usa fetch para no depender del export RemoteDriver de vuefinder.
 * Con Vite proxy o CORS, las peticiones van a tu servidor Laravel.
 */

const BASE = '/api/files'

async function api(method, path, query = {}, body = null) {
  const url = new URL(BASE + path, window.location.origin)
  Object.entries(query).forEach(([k, v]) => {
    if (v != null && v !== '') url.searchParams.set(k, v)
  })
  const opts = { method, headers: {} }
  if (body !== null) {
    if (body instanceof FormData) {
      opts.body = body
    } else {
      opts.headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(body)
    }
  }
  const res = await fetch(url.toString(), opts)
  if (!res.ok) {
    const text = await res.text()
    let msg = text
    try {
      const j = JSON.parse(text)
      msg = j.message || j.error || j.detail || j.title || text
    } catch (_) {}
    throw new Error(msg)
  }
  const contentType = res.headers.get('Content-Type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.blob()
}

export function createLaravelDriver() {
  return {
    async list(params = {}) {
      return api('GET', '/', { path: params.path || 'local://uploads' })
    },

    async upload(params) {
      const path = params.path || 'local://uploads'
      const form = new FormData()
      const files = params.files != null ? (Array.isArray(params.files) ? params.files : [params.files]) : []
      for (const file of files) {
        if (file) form.append('file', file)
      }
      if (files.length === 0 && params.file) form.append('file', params.file)
      await api('POST', '/upload', { path }, form)
      return {}
    },

    async delete(params) {
      const path = params.path || 'local://uploads'
      return api('POST', '/delete', { path }, { items: params.items || [] })
    },

    async createFolder(params) {
      const path = params.path || 'local://uploads'
      return api('POST', '/create-folder', {}, { path, name: params.name || 'nueva-carpeta' })
    },

    async rename(params) {
      const path = params.path || 'local://uploads'
      return api('POST', '/rename', { path }, {
        path: params.path,
        newName: params.newName,
      })
    },

    async copy(params) {
      const path = params.path || 'local://uploads'
      return api('POST', '/copy', { path }, {
        items: params.items || [],
        destination: params.destination,
      })
    },

    async move(params) {
      const path = params.path || 'local://uploads'
      return api('POST', '/move', { path }, {
        items: params.items || [],
        destination: params.destination,
      })
    },

    async createFile(params) {
      const path = params.path || 'local://uploads'
      return api('POST', '/create-file', {}, { path, name: params.name || 'nuevo-archivo.txt' })
    },

    async save(params) {
      const path = params.path || ''
      return api('POST', '/save', { path }, { content: params.content ?? '' })
    },

    async search(params) {
      return api('GET', '/search', {
        path: params.path || 'local://uploads',
        filter: params.filter,
        deep: params.deep,
      })
    },
  }
}
