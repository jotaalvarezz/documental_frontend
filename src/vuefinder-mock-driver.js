// Driver mock para desarrollar el frontend sin depender todavía del backend real.
// Mantiene un pequeño sistema de archivos en memoria.

const now = () => Math.floor(Date.now() / 1000)

const initialFiles = [
  {
    dir: 'local://uploads',
    basename: 'documento.txt',
    extension: 'txt',
    path: 'local://uploads/documento.txt',
    storage: 'local',
    type: 'file',
    file_size: 1024,
    last_modified: now(),
    mime_type: 'text/plain',
    visibility: 'public',
  },
  {
    dir: 'local://uploads',
    basename: 'imagenes',
    extension: '',
    path: 'local://uploads/imagenes',
    storage: 'local',
    type: 'dir',
    file_size: 0,
    last_modified: now(),
    mime_type: '',
    visibility: 'public',
  },
]

let state = {
  dirname: 'local://uploads',
  files: [...initialFiles],
}

export function createMockRemoteDriver() {
  return {
    async list(params = {}) {
      const dirname = params.path || state.dirname
      return {
        storages: ['local'],
        dirname,
        read_only: false,
        files: state.files.filter((f) => f.dir === dirname),
      }
    },

    // Métodos mínimos para que la UI funcione; aquí solo hacemos operaciones en memoria.
    async delete(params) {
      const items = params.items || []
      const pathsToDelete = items.map((i) => i.path)
      state.files = state.files.filter((f) => !pathsToDelete.includes(f.path))
      return this.list({ path: state.dirname })
    },

    async createFolder(params) {
      const name = params.name || 'nueva-carpeta'
      const dirname = params.path || state.dirname
      const newFolderPath = `${dirname}/${name}`
      state.files.push({
        dir: dirname,
        basename: name,
        extension: '',
        path: newFolderPath,
        storage: 'local',
        type: 'dir',
        file_size: 0,
        last_modified: now(),
        mime_type: '',
        visibility: 'public',
      })
      return this.list({ path: dirname })
    },
  }
}
