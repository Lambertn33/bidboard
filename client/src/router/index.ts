import { createRouter, createWebHistory } from 'vue-router';
import { HomeView, NotFoundView, RegisterView, LoginView, TasksView } from '@/views';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;

