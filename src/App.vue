<script setup>
// VueFinder usa la prop "request" (no "driver") y envía peticiones con ?q=index&adapter=...&path=...
// Adaptamos ese formato a nuestra API Laravel con transformRequest.
const request = {
  baseUrl: '/api/files',
  // Si la respuesta es HTML (backend caído o proxy mal), mostramos error claro
  async fetchResponseInterceptor(response) {
    const contentType = response.headers.get('Content-Type') || ''
    if (contentType.includes('text/html')) {
      throw new Error(
        'El backend no ha devuelto JSON (respuesta HTML). Comprueba que los contenedores Docker estén corriendo: docker-compose up -d (en la carpeta Documental). El backend debe estar en http://127.0.0.1:8000.'
      )
    }
    return response
  },
  transformRequest({ url, method, params, body }) {
    const q = params?.q
    const path = params?.path ?? 'local://uploads'

    // IMPORTANTE: transformRequest reemplaza la URL completa, así que incluimos /api/files
    if (q === 'index') {
      return { url: '/api/files/', method: 'get', params: { path }, body }
    }
    if (q === 'subfolders') {
      return { url: '/api/files/subfolders', method: 'get', params: { path }, body }
    }
    if (q === 'newfolder') {
      return { url: '/api/files/create-folder', method: 'post', params: {}, body: { path, name: body?.name ?? 'nueva-carpeta' } }
    }
    if (q === 'upload') {
      return { url: '/api/files/upload', method: 'post', params: { path }, body }
    }
    if (q === 'delete') {
      return { url: '/api/files/delete', method: 'post', params: { path }, body }
    }
    if (q === 'rename') {
      return {
        url: '/api/files/rename',
        method: 'post',
        params: { path },
        body: { path: body?.item, newName: body?.name },
      }
    }
    if (q === 'move') {
      return {
        url: '/api/files/move',
        method: 'post',
        params: { path },
        body: { items: body?.items ?? [], destination: body?.item },
      }
    }
    if (q === 'preview') {
      return { url: '/api/files/preview', method: 'get', params: { path: params?.path }, body }
    }
    if (q === 'download') {
      return { url: '/api/files/download', method: 'get', params: { path: params?.path }, body }
    }
    if (q === 'save') {
      return { url: '/api/files/save', method: 'post', params: { path: params?.path }, body }
    }
    if (q === 'search') {
      return {
        url: '/api/files/search',
        method: 'get',
        params: { path, filter: params?.filter, deep: params?.deep },
        body,
      }
    }
    return { url, method, params, body }
  },
}
</script>

<template>
  <main style="height: 100vh; padding: 1rem; box-sizing: border-box">
    <vue-finder
      id="my_vuefinder"
      :request="request"
      path="local://uploads"
      locale="en"
      :config="{
        initialPath: 'local://uploads',
        persist: true,
      }"
    />
  </main>
</template>

<style scoped>
main {
  background-color: #0f172a;
}
</style>
