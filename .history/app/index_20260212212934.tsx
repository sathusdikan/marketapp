import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

export default function Index() {
  const { isLoading, isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && userRole) {
        if (userRole === 'customer') {
          router.replace('/(customer)');
        } else if (userRole === 'shop') {
          router.replace('/(shop)');
        } else if (userRole === 'admin') {
          router.replace('/(admin)');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, userRole]);

  return <LoadingScreen />;
}
