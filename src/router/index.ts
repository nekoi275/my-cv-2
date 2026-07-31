import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SceneWrapper from '@/sections/SceneWrapper.vue';
import TeapotSection from '@/sections/TeapotSection.vue';
import Projects from '@/sections/Projects.vue';
import Games from '@/sections/Games.vue';
import Contact from '@/sections/Contact.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'garden',
    component: SceneWrapper
  },
  {
    path: '/about',
    name: 'about',
    component: TeapotSection
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects
  },
  {
    path: '/games',
    name: 'games',
    component: Games
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact
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
