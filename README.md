# documentProyect

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Docker (junto con `documental_backend`)

Levanta primero el backend (esto crea la red Docker `documental`):

```sh
cd ../documental_backend
docker compose up -d --build
```

Luego levanta el frontend:

```sh
cd ../documental_frontend
docker compose up -d --build
```

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8000`

El frontend sirve el `dist` con Nginx y hace **proxy de `/api` hacia el contenedor `laravel_nginx`** por la red `documental`.
