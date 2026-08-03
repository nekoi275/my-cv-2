import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SceneWrapper from '@/sections/SceneWrapper.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'garden',
    component: SceneWrapper
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/sections/TeapotSection.vue')
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/sections/Projects.vue')
  },
  {
    path: '/games',
    name: 'games',
    component: () => import('@/sections/Games.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/sections/Contact.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
