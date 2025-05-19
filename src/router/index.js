import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'desk',
    },
    {
      path: '/desk',
      name: 'desk',
      component: () => import('../views/DeskView.vue'),
    },
  ],
})

export default router
