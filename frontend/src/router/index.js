import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Computer from '../views/services/computer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: Home
    },
    {
      path: '/computer-services',
      component: Computer
    }
  ]
})

export default router
