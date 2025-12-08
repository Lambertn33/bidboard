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

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      return true;
    }
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    return currentTime >= expirationTime - 60000;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true;
  }
};

// Decode JWT token to extract user info
const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded || typeof decoded !== 'object') return null;

    if (isTokenExpired(token)) {
      return null;
    }

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

const loadStoredAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const user = decodeToken(token);
  if (!user) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }

  return { token, user };
};

const token = ref<string | null>(null);
const user = ref<User | null>(null);

const stored = loadStoredAuth();
if (stored) {
  token.value = stored.token;
  user.value = stored.user;
}

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
  const checkTokenExpiration = () => {
    if (token.value && isTokenExpired(token.value)) {
      logout();
      return true;
    }
    return false;
  };

  const isAuthenticated = computed(() => {
    if (token.value && isTokenExpired(token.value)) {
      logout();
      return false;
    }
    return !!token.value && !!user.value;
  });
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const isFreelancer = computed(() => user.value?.role === 'FREELANCER');

  const login = (accessToken: string) => {
    token.value = accessToken;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  const setUser = (userData: User) => {
    user.value = userData;
  };

  return {
    token: computed(() => token.value),
    user: computed(() => user.value),
    
    isAuthenticated,
    isAdmin,
    isFreelancer,
    
    login,
    logout,
    setUser,
    checkTokenExpiration,
  };
};

