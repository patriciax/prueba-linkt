import Dashboard from '@/views/Dashboard.vue'
import HomeView from '@/views/Home.vue'
import ProjectsView from '@/views/Projects.vue'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/projects',
          name: 'projects',
          component: ProjectsView
        }
      ]
    }
  ]
})

export default router
