import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Planner from '../pages/Planner.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import AddTrip from '../pages/AddTrip.vue';

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
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/add-trip',
    name: 'AddTrip',
    component: AddTrip,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
