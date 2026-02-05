import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Registro global de VueFinder según la documentación oficial
import 'vuefinder/dist/style.css'
import VueFinder from 'vuefinder'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueFinder)

app.mount('#app')
