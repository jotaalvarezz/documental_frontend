import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'vuefinder',
      component: () => import('../views/VueFinderView.vue'),
    },
    {
      path: '/file-manager',
      name: 'file-manager',
      component: () => import('../views/FileManagerView.vue'),
    },
  ],
})

export default router
