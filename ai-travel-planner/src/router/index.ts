import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Planner from '../pages/Planner.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/planner',
    name: 'Planner',
    component: Planner,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
