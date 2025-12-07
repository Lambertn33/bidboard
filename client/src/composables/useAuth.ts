import { ref, computed, watch } from 'vue';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'ADMIN' | 'FREELANCER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  names: string;
}

interface JwtPayload {
  id?: string;
  sub?: string;
  email?: string;
  role?: UserRole;
  names?: string;
  iat?: number;
  exp?: number;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Decode JWT token to extract user info
const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded || typeof decoded !== 'object') return null;

    return {
      id: decoded.id || decoded.sub || '',
      email: decoded.email || '',
      role: decoded.role || 'FREELANCER',
      names: decoded.names || '',
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Load initial state from localStorage
const loadStoredAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const user = decodeToken(token);
  if (!user) {
    // Invalid token, clear it
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }

  return { token, user };
};

// Reactive state
const token = ref<string | null>(null);
const user = ref<User | null>(null);

// Initialize from localStorage
const stored = loadStoredAuth();
if (stored) {
  token.value = stored.token;
  user.value = stored.user;
}

// Watch for token changes and sync to localStorage
watch(token, (newToken) => {
  if (newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
    const decoded = decodeToken(newToken);
    if (decoded) {
      user.value = decoded;
      localStorage.setItem(USER_KEY, JSON.stringify(decoded));
    }
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    user.value = null;
  }
});

export const useAuth = () => {
  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const isFreelancer = computed(() => user.value?.role === 'FREELANCER');

  // Methods
  const login = (accessToken: string) => {
    token.value = accessToken;
    // user will be updated via watch
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  const setUser = (userData: User) => {
    user.value = userData;
  };

  return {
    // State
    token: computed(() => token.value),
    user: computed(() => user.value),
    
    // Computed
    isAuthenticated,
    isAdmin,
    isFreelancer,
    
    // Methods
    login,
    logout,
    setUser,
  };
};

