## Contrato de backend para VueFinder

Base URL: `/api/files` (proyecto Laravel **Documental**).

### Cómo probar frontend + backend

1. **Backend Laravel (Documental)**  
   En la carpeta del proyecto Laravel:
   - `php artisan serve` (puerto 8000) o usa Laragon con el virtual host que apunte a Documental.
   - `php artisan storage:link` (para que `storage/app/public` sea accesible si quieres servir archivos por URL).

2. **Frontend (documentProyect)**  
   En la carpeta del proyecto Vue:
   - `npm run dev`.  
   Vite hace proxy de `/api` a `http://127.0.0.1:8000`; si tu Laravel corre en otra URL, cambia `server.proxy` en `vite.config.js`.

3. En `App.vue`, `useLaravelBackend = true` para usar la API real.

### Endpoints principales

- `GET /api/files?path=local://uploads`
  - **Descripción**: Lista archivos y carpetas.
  - **Respuesta (200)**:
    ```json
    {
      "storages": ["local"],
      "dirname": "local://uploads",
      "read_only": false,
      "files": [
        {
          "dir": "local://uploads",
          "basename": "example.txt",
          "extension": "txt",
          "path": "local://uploads/example.txt",
          "storage": "local",
          "type": "file",
          "file_size": 1024,
          "last_modified": 1699123456,
          "mime_type": "text/plain",
          "visibility": "public"
        }
      ]
    }
    ```

- `POST /api/files/upload?path=local://uploads`
  - **Descripción**: Sube uno o varios archivos al directorio indicado.
  - **Body**: `multipart/form-data` con campo `file`.
  - **Respuesta (200)**:
    ```json
    {}
    ```

- `POST /api/files/delete?path=local://uploads`
  - **Descripción**: Elimina archivos o carpetas.
  - **Body**:
    ```json
    {
      "items": [{ "path": "local://uploads/file.txt", "type": "file" }]
    }
    ```
  - **Respuesta (200)**: Devuelve el mismo formato que `GET /api/files` (lista actualizada).

- `POST /api/files/rename`
  - **Descripción**: Renombra un archivo/carpeta.

- `POST /api/files/copy`
  - **Descripción**: Copia archivos/carpeta.

- `POST /api/files/move`
  - **Descripción**: Mueve archivos/carpeta.

- `POST /api/files/create-folder`
  - **Descripción**: Crea una nueva carpeta.

- `GET /api/files/preview`
  - **Descripción**: Devuelve contenido binario o URL de previsualización.

- `GET /api/files/download`
  - **Descripción**: Descarga un archivo.

- `GET /api/files/search`
  - **Descripción**: Busca archivos.

- `POST /api/files/save`
  - **Descripción**: Guarda contenido en un archivo (por ejemplo, editor de texto).
