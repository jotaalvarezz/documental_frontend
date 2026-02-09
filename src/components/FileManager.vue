<template>
  <div class="file-manager">
    <el-container class="fm-container">
      <!-- Sidebar con árbol de carpetas -->
      <el-aside width="300px" class="fm-sidebar">
        <div class="sidebar-header">
          <h3>Carpetas</h3>
          <el-button
            type="primary"
            size="small"
            :icon="FolderAdd"
            @click="showCreateFolderDialog = true"
          >
            Nueva carpeta
          </el-button>
        </div>
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="treeProps"
          node-key="path"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          class="folder-tree"
        >
          <template #default="{ node, data }">
            <span class="tree-node">
              <el-icon class="tree-icon">
                <Folder v-if="data.type === 'dir'" />
                <Document v-else />
              </el-icon>
              <span>{{ data.basename }}</span>
            </span>
          </template>
        </el-tree>
      </el-aside>

      <!-- Contenido principal -->
      <el-main class="fm-main">
        <!-- Barra de herramientas -->
        <div class="toolbar">
          <div class="toolbar-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="(crumb, index) in breadcrumbs"
                :key="index"
                @click="navigateToPath(crumb.path)"
                :class="{ 'is-link': index < breadcrumbs.length - 1 }"
              >
                {{ crumb.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="toolbar-right">
            <el-upload
              ref="uploadRef"
              :action="uploadUrl"
              :data="uploadData"
              :headers="uploadHeaders"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :show-file-list="false"
              multiple
            >
              <template #trigger>
                <el-button type="primary" :icon="Upload">Subir archivos</el-button>
              </template>
            </el-upload>
            <el-button
              :icon="Refresh"
              @click="loadFiles"
              :loading="loading"
            >
              Actualizar
            </el-button>
          </div>
        </div>

        <!-- Lista de archivos -->
        <div class="files-grid" v-loading="loading">
          <div
            v-for="item in files"
            :key="item.path"
            class="file-item"
            @dblclick="handleItemDoubleClick(item)"
            @contextmenu.prevent="handleContextMenu($event, item)"
          >
            <div class="file-icon">
              <el-icon v-if="item.type === 'dir'" size="48" color="#409eff">
                <Folder />
              </el-icon>
              <el-icon v-else size="48" color="#909399">
                <Document />
              </el-icon>
            </div>
            <div class="file-name" :title="item.basename">
              {{ item.basename }}
            </div>
            <div class="file-size" v-if="item.type === 'file'">
              {{ formatFileSize(item.file_size) }}
            </div>
          </div>
          <div v-if="files.length === 0 && !loading" class="empty-state">
            <el-empty description="Esta carpeta está vacía" />
          </div>
        </div>
      </el-main>
    </el-container>

    <!-- Diálogo para crear carpeta -->
    <el-dialog
      v-model="showCreateFolderDialog"
      title="Nueva carpeta"
      width="400px"
    >
      <el-form @submit.prevent="createFolder">
        <el-form-item label="Nombre de la carpeta">
          <el-input
            v-model="newFolderName"
            placeholder="Ingrese el nombre"
            @keyup.enter="createFolder"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateFolderDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="createFolder">Crear</el-button>
      </template>
    </el-dialog>

    <!-- Menú contextual -->
    <el-dropdown
      ref="contextMenuRef"
      trigger="contextmenu"
      :visible="contextMenuVisible"
      @command="handleContextCommand"
    >
      <div
        v-show="false"
        :style="{ position: 'fixed', left: contextMenuX + 'px', top: contextMenuY + 'px' }"
      ></div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            command="rename"
            :disabled="selectedItem?.type === 'dir'"
          >
            Renombrar
          </el-dropdown-item>
          <el-dropdown-item command="delete" divided>
            Eliminar
          </el-dropdown-item>
          <el-dropdown-item
            command="download"
            :disabled="selectedItem?.type === 'dir'"
          >
            Descargar
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Folder,
  Document,
  Upload,
  Refresh,
  FolderAdd,
} from '@element-plus/icons-vue'

const treeRef = ref(null)
const uploadRef = ref(null)
const contextMenuRef = ref(null)

// Estado
const loading = ref(false)
const currentPath = ref('local://uploads')
const files = ref([])
const treeData = ref([])
const showCreateFolderDialog = ref(false)
const newFolderName = ref('')
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const selectedItem = ref(null)

// Props del árbol
const treeProps = {
  children: 'children',
  label: 'basename',
}

// Breadcrumbs calculados
const breadcrumbs = computed(() => {
  const parts = currentPath.value.replace('local://', '').split('/')
  const crumbs = [{ name: 'Inicio', path: 'local://uploads' }]
  let path = 'local://uploads'
  
  parts.forEach((part, index) => {
    if (part && part !== 'uploads') {
      path += '/' + part
      crumbs.push({ name: part, path })
    }
  })
  
  return crumbs
})

// URL de upload
const uploadUrl = computed(() => {
  return `/api/files/upload?path=${encodeURIComponent(currentPath.value)}`
})

const uploadData = computed(() => ({}))
const uploadHeaders = computed(() => ({
  'X-Requested-With': 'XMLHttpRequest',
}))

// Funciones
const loadFiles = async () => {
  loading.value = true
  try {
    const response = await fetch(
      `/api/files/?path=${encodeURIComponent(currentPath.value)}`
    )
    const data = await response.json()
    files.value = data.files || []
  } catch (error) {
    ElMessage.error('Error al cargar archivos: ' + error.message)
  } finally {
    loading.value = false
  }
}

const loadTree = async () => {
  try {
    const response = await fetch('/api/files/subfolders?path=local://uploads')
    const data = await response.json()
    treeData.value = buildTreeData(data.folders || [])
  } catch (error) {
    ElMessage.error('Error al cargar árbol de carpetas: ' + error.message)
  }
}

const buildTreeData = (folders, parentPath = 'local://uploads') => {
  return folders
    .filter((folder) => {
      const folderPath = folder.path.replace('local://uploads/', '')
      const parent = parentPath.replace('local://uploads/', '')
      return (
        !folderPath.includes('/') ||
        folderPath.startsWith(parent + '/') ||
        folderPath === parent
      )
    })
    .map((folder) => {
      const folderPath = folder.path.replace('local://uploads/', '')
      const children = folders.filter((f) => {
        const fPath = f.path.replace('local://uploads/', '')
        return fPath.startsWith(folderPath + '/') && fPath !== folderPath
      })
      return {
        ...folder,
        children: children.length > 0 ? buildTreeData(children, folder.path) : [],
      }
    })
}

const handleNodeClick = (data) => {
  if (data.type === 'dir') {
    currentPath.value = data.path
  }
}

const navigateToPath = (path) => {
  currentPath.value = path
}

const handleItemDoubleClick = (item) => {
  if (item.type === 'dir') {
    currentPath.value = item.path
  } else {
    window.open(`/api/files/preview?path=${encodeURIComponent(item.path)}`, '_blank')
  }
}

const handleContextMenu = (event, item) => {
  selectedItem.value = item
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  contextMenuVisible.value = true
}

const handleContextCommand = async (command) => {
  contextMenuVisible.value = false
  
  if (!selectedItem.value) return

  switch (command) {
    case 'delete':
      await deleteItem(selectedItem.value)
      break
    case 'rename':
      await renameItem(selectedItem.value)
      break
    case 'download':
      downloadItem(selectedItem.value)
      break
  }
}

const deleteItem = async (item) => {
  try {
    await ElMessageBox.confirm(
      `¿Está seguro de eliminar "${item.basename}"?`,
      'Confirmar eliminación',
      {
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      }
    )

    const response = await fetch('/api/files/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: currentPath.value,
        items: [item],
      }),
    })

    if (response.ok) {
      ElMessage.success('Archivo eliminado correctamente')
      loadFiles()
      loadTree()
    } else {
      throw new Error('Error al eliminar')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Error al eliminar: ' + error.message)
    }
  }
}

const renameItem = async (item) => {
  try {
    const { value: newName } = await ElMessageBox.prompt(
      'Ingrese el nuevo nombre',
      'Renombrar',
      {
        confirmButtonText: 'Renombrar',
        cancelButtonText: 'Cancelar',
        inputValue: item.basename,
      }
    )

    const response = await fetch(
      `/api/files/rename?path=${encodeURIComponent(currentPath.value)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: item.path,
          newName,
        }),
      }
    )

    if (response.ok) {
      ElMessage.success('Archivo renombrado correctamente')
      loadFiles()
      loadTree()
    } else {
      throw new Error('Error al renombrar')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Error al renombrar: ' + error.message)
    }
  }
}

const downloadItem = (item) => {
  window.open(`/api/files/download?path=${encodeURIComponent(item.path)}`, '_blank')
}

const createFolder = async () => {
  if (!newFolderName.value.trim()) {
    ElMessage.warning('Ingrese un nombre para la carpeta')
    return
  }

  try {
    const response = await fetch('/api/files/create-folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: currentPath.value,
        name: newFolderName.value,
      }),
    })

    if (response.ok) {
      ElMessage.success('Carpeta creada correctamente')
      showCreateFolderDialog.value = false
      newFolderName.value = ''
      loadFiles()
      loadTree()
    } else {
      throw new Error('Error al crear carpeta')
    }
  } catch (error) {
    ElMessage.error('Error al crear carpeta: ' + error.message)
  }
}

const handleUploadSuccess = () => {
  ElMessage.success('Archivos subidos correctamente')
  loadFiles()
  loadTree()
}

const handleUploadError = () => {
  ElMessage.error('Error al subir archivos')
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Watchers
watch(currentPath, () => {
  loadFiles()
})

// Lifecycle
onMounted(() => {
  loadFiles()
  loadTree()
})
</script>

<style scoped>
.file-manager {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.fm-container {
  height: 100%;
}

.fm-sidebar {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-right: 1px solid #e2e8f0;
  padding: 20px;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.folder-tree {
  background: transparent;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.tree-icon {
  margin-right: 4px;
}

.fm-main {
  padding: 24px;
  overflow-y: auto;
  background: white;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  padding: 8px;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.file-item:hover {
  border-color: #4f46e5;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.15);
  transform: translateY(-2px);
}

.file-icon {
  margin-bottom: 8px;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1e293b;
}

.file-size {
  font-size: 11px;
  color: #64748b;
  margin-top: 6px;
  font-weight: 500;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.is-link {
  cursor: pointer;
  color: #409eff;
}

.is-link:hover {
  text-decoration: underline;
}
</style>
