import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, isNotificationPermissionGranted, onMessageListener } from '@/lib/firebase';
import api from '@/lib/apiClient';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check permission status on mount
  useEffect(() => {
    const checkPermission = () => {
      const granted = isNotificationPermissionGranted();
      setPermissionGranted(granted);

      // Load saved token from localStorage
      if (granted) {
        const savedToken = localStorage.getItem('fcm-token');
        if (savedToken) {
          setFcmToken(savedToken);
        }
      }
    };

    checkPermission();
  }, []);

  // Listen for foreground messages
  useEffect(() => {
    if (!permissionGranted) return;

    const unsubscribe = onMessageListener()
      .then((payload: any) => {
        console.log('Foreground notification received:', payload);
        
        // Show toast notification
        const title = payload.notification?.title || 'New Notification';
        const body = payload.notification?.body || '';
        toast.success(`🔔 ${title}: ${body}`, { duration: 5000 });
      })
      .catch((err) => console.error('Failed to receive foreground message:', err));

    return () => {
      // Cleanup if needed
    };
  }, [permissionGranted]);

  // Request notification permission
  const enableNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      const token = await requestNotificationPermission();
      
      if (token) {
        setFcmToken(token);
        setPermissionGranted(true);
        
        // Save token to localStorage
        localStorage.setItem('fcm-token', token);
        
        // Save token to backend
        await saveFCMToken(token);
        
        return token;
      }
      
      return null;
    } catch (error) {
      console.error('Error enabling notifications:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save FCM token to backend
  const saveFCMToken = async (token: string) => {
    try {
      await api.post('/notifications/register-token', {
        token: token,
        platform: 'web',
        browser: navigator.userAgent,
        deviceId: navigator.userAgent,
      });
      console.log('FCM token saved to backend');
    } catch (error: any) {
      console.error('Error saving FCM token to backend:', error);
      // Don't throw error - token is still saved locally
    }
  };

  // Refresh token (call this when user logs in)
  const refreshToken = useCallback(async () => {
    if (permissionGranted && fcmToken) {
      await saveFCMToken(fcmToken);
    }
  }, [permissionGranted, fcmToken]);

  return {
    fcmToken,
    permissionGranted,
    loading,
    enableNotifications,
    refreshToken,
  };
};
