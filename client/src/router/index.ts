import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import { HomeView, NotFoundView, RegisterView, LoginView, TasksView, ProjectsView, ProtectedProjectsView } from '@/views';

// Auth guard function
const isAuthenticated = (): boolean => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  return !!token;
};

const requireIsAdmin = (): boolean => {
  return true;
}

const requireIsFreelancer = (): boolean => {
  return true;
}


// Route guard for protected routes
const requireAuth = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (isAuthenticated()) {
    next();
  } else {
    // Redirect to login with return URL
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  }
};

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
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    },

    // Protected Routes
    {
      path: '/protected',
      beforeEnter: requireAuth,
      children: [
        {
          path: 'projects',
          component: ProtectedProjectsView,
          beforeEnter: requireIsAdmin,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;

