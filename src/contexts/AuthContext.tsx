import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getStoredToken, initializeNotifications } from '@/services/firebase';
import { apiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  customer: any;
  loading: boolean;
  isAuthenticated: boolean;
  backendAuth: any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  customer: null,
  loading: true,
  isAuthenticated: false,
  backendAuth: null,
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [backendAuth, setBackendAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredToken());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Cross-tab synchronization
  useEffect(() => {
    const checkToken = () => {
      const token = getStoredToken();
      // Only update if we're not in the middle of logging out
      if (token === null) {
        setIsAuthenticated(false);
        setUser(null);
        setCustomer(null);
        setBackendAuth(null);
      }
    };
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  useEffect(() => {
    // Load stored auth data
    const storedAuth = apiService.getStoredAuthData();
    const storedCustomer = apiService.getStoredCustomer();

    if (storedAuth && storedCustomer) {
      setBackendAuth(storedAuth);
      setCustomer(storedCustomer);
    }

    // Firebase auth state listener
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      // Ignore auth state changes during logout
      if (isLoggingOut) {
        return;
      }

      setUser(firebaseUser);

      if (firebaseUser && firebaseUser.email) {
        try {
          const authResponse = await apiService.authorize(firebaseUser.email);
          apiService.storeAuthData(authResponse);
          setBackendAuth(authResponse);

          // Extract customer data
          const userDetails = (authResponse as any)?.userDetails || (authResponse as any)?.customer;
          if (userDetails) {
            setCustomer(userDetails);
            localStorage.setItem("userdetails", JSON.stringify(userDetails));
          }

          // Update authentication state
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Backend auth failed:', error);
          setBackendAuth(null);
          setCustomer(null);
          setIsAuthenticated(false);
        }
      } else {
        setBackendAuth(null);
        setCustomer(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Initialize notifications when authenticated
  useEffect(() => {
    if (isAuthenticated && customer) {
      initializeNotifications((payload) => {
        console.log('Notification received:', payload);
      }).catch(console.error);
    }
  }, [isAuthenticated, customer]);

  const logout = async () => {
    try {
      // Set logging out flag to prevent auth state listener interference
      setIsLoggingOut(true);

      // Sign out from Firebase first
      await import('@/services/firebase').then(async (mod) => {
        if (mod.logout) {
          await mod.logout();
        }
      });

      // Clear local state
      setUser(null);
      setCustomer(null);
      setBackendAuth(null);
      setIsAuthenticated(false);

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear API service data
      apiService.clearAuthData();

      // Use React Router navigation instead of window.location
      window.location.replace('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear everything even if logout fails
      setUser(null);
      setCustomer(null);
      setBackendAuth(null);
      setIsAuthenticated(false);
      localStorage.clear();
      sessionStorage.clear();
      apiService.clearAuthData();
      window.location.replace('/signin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const value = {
    user,
    customer,
    loading,
    isAuthenticated,
    backendAuth,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
