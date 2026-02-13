import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { UserRole, Customer, Shop } from '@/types';
import { mockCustomers, mockShops } from '@/mocks/data';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userId: string | null;
  userName: string | null;
}

const STORAGE_KEY = 'credit_market_auth';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    userRole: null,
    userId: null,
    userName: null,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          ...parsed,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.log('Error loading auth:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(async (role: UserRole, email: string, password: string) => {
    console.log('Login attempt:', { role, email });
    
    let userId = '';
    let userName = '';

    if (role === 'admin') {
      userId = 'admin-1';
      userName = 'System Admin';
    } else if (role === 'customer') {
      const customer = mockCustomers.find(c => c.email === email) || mockCustomers[0];
      userId = customer.id;
      userName = customer.name;
    } else if (role === 'shop') {
      const shop = mockShops.find(s => s.status === 'approved') || mockShops[0];
      userId = shop.id;
      userName = shop.shopName;
    }

    const authData = { userRole: role, userId, userName };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    
    setAuthState({
      isLoading: false,
      isAuthenticated: true,
      ...authData,
    });

    return true;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setAuthState({
      isLoading: false,
      isAuthenticated: false,
      userRole: null,
      userId: null,
      userName: null,
    });
  }, []);

  const getCurrentCustomer = useCallback((): Customer | null => {
    if (authState.userRole !== 'customer' || !authState.userId) return null;
    return mockCustomers.find(c => c.id === authState.userId) || mockCustomers[0];
  }, [authState.userRole, authState.userId]);

  const getCurrentShop = useCallback((): Shop | null => {
    if (authState.userRole !== 'shop' || !authState.userId) return null;
    return mockShops.find(s => s.id === authState.userId) || mockShops[0];
  }, [authState.userRole, authState.userId]);

  return {
    ...authState,
    login,
    logout,
    getCurrentCustomer,
    getCurrentShop,
  };
});
