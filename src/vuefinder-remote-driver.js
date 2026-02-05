// RemoteDriver oficial de VueFinder configurado para tu backend Laravel.
// Backend esperado: rutas bajo /api/files (definidas en routes/api.php).

import { RemoteDriver } from 'vuefinder'

export function createLaravelRemoteDriver() {
  return new RemoteDriver({
    baseURL: '/api/files',
    url: {
      list: '/', // GET    /api/files?path=local://uploads
      upload: '/upload', // POST   /api/files/upload
      delete: '/delete', // POST   /api/files/delete
      rename: '/rename',
      copy: '/copy',
      move: '/move',
      archive: '/archive',
      unarchive: '/unarchive',
      createFile: '/create-file',
      createFolder: '/create-folder',
      preview: '/preview',
      download: '/download',
      search: '/search',
      save: '/save',
    },
  })
}
