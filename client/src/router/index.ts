import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import { HomeView,
  NotFoundView,
  RegisterView, 
  LoginView, 
  TasksView, 
  ProjectsView, 
  ProtectedProjectsView, 
  ProtectedTasksView, 
  ProtectedBidsView, 
  ProtectedWorksView,
  AdminProtectedDashboardView
 }
from '@/views';

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

// Helper function to redirect to login with return URL
// Uses the 'from' path (where user came from) instead of 'to' path (where they're trying to go)
// Stores redirect path in sessionStorage instead of query parameter to keep URL clean
const redirectToLogin = (
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // Use the previous route or default to home
  const redirectPath = from.fullPath || '/';
  // Store redirect path in sessionStorage (cleared after use)
  sessionStorage.setItem('authRedirect', redirectPath);
  // Redirect to login without query parameters
  next({ name: 'login' });
};

// Route guard for protected routes (requires authentication)
const requireAuth = (
  _to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (isAuthenticated()) {
    next();
  } else {
    // Redirect to login with return URL pointing to where user came from
    redirectToLogin(from, next);
  }
};

// Route guard for public routes (redirects if already authenticated)
const requireNotAuthenticated = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (isAuthenticated()) {
    // If already logged in, redirect to home
    next({ name: 'home' });
  } else {
    next();
  }
};

// Route guard for admin-only routes
const requireAdmin = (
  _to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!isAuthenticated()) {
    // Not authenticated - redirect to login with return URL pointing to where user came from
    redirectToLogin(from, next);
    return;
  }

  if (isAdmin()) {
    // User is authenticated and is admin - allow access
    next();
  } else {
    // User is authenticated but not admin - redirect back to where they came from
    const redirectPath = from.fullPath || '/';
    next(redirectPath);
  }
};

// Route guard for freelancer-only routes
// Note: Currently not used, but available for future freelancer-specific routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requireFreelancer = (
  _to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!isAuthenticated()) {
    // Not authenticated - redirect to login with return URL pointing to where user came from
    redirectToLogin(from, next);
    return;
  }

  if (isFreelancer()) {
    // User is authenticated and is freelancer - allow access
    next();
  } else {
    // User is authenticated but not freelancer - redirect back to where they came from
    const redirectPath = from.fullPath || '/';
    next(redirectPath);
  }
};

// Route guard to redirect admins away from home page
const redirectAdminFromHome = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (isAuthenticated() && isAdmin()) {
    // Admin is authenticated - redirect to dashboard
    next('/protected/dashboard');
  } else {
    // Not admin or not authenticated - allow access to home
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: redirectAdminFromHome,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: requireNotAuthenticated,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: requireNotAuthenticated,
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
        {
          path: 'dashboard',
          component: AdminProtectedDashboardView,
          beforeEnter: requireAdmin,
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

