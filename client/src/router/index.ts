import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import { HomeView,
   NotFoundView,
    RegisterView, LoginView, TasksView, ProjectsView, ProtectedProjectsView, ProtectedTasksView, ProtectedBidsView, ProtectedWorksView } from '@/views';

// Helper functions to check auth state (for use in router guards)
const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

const getStoredUser = (): { role: string } | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

const isAdmin = (): boolean => {
  const user = getStoredUser();
  return user?.role === 'ADMIN';
};

const isFreelancer = (): boolean => {
  const user = getStoredUser();
  return user?.role === 'FREELANCER';
};

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

// Route guard for admin-only routes
const requireAdmin = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!isAuthenticated()) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  if (isAdmin()) {
    next();
  } else {
    // Redirect to home or show error
    next({ name: 'home' });
  }
};

// Route guard for freelancer-only routes
const requireFreelancer = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!isAuthenticated()) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  if (isFreelancer()) {
    next();
  } else {
    // Redirect to home or show error
    next({ name: 'home' });
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
          beforeEnter: requireAdmin,
        },
        {
          path: 'tasks',
          component: ProtectedTasksView,
        },
        {
          path: 'bids',
          component: ProtectedBidsView,
        },
        {
          path: 'works',
          component: ProtectedWorksView,
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

