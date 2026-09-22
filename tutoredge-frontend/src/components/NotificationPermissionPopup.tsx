import React, { useState, useEffect } from 'react';
import { Bell, X, BellOff } from 'lucide-react';
import { requestNotificationPermission, isNotificationPermissionGranted, isNotificationPermissionDenied } from '@/lib/firebase';
import api from '@/lib/apiClient';
import toast from 'react-hot-toast';

const NotificationPermissionPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we should show the popup
    const checkPermission = () => {
      // Don't show if already granted
      if (isNotificationPermissionGranted()) {
        return;
      }

      // Don't show if user denied
      if (isNotificationPermissionDenied()) {
        return;
      }

      // Check if user dismissed the popup before
      const dismissed = localStorage.getItem('notification-popup-dismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed);
        const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
        
        // Show again after 7 days
        if (daysSinceDismissed < 7) {
          return;
        }
      }

      // Show popup after 3 seconds delay
      setTimeout(() => {
        setShowPopup(true);
      }, 3000);
    };

    checkPermission();
  }, []);

  const handleAllow = async () => {
    try {
      setLoading(true);
      
      // Request permission and get FCM token
      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken) {
        // Save token to backend
        try {
          await api.post('/notifications/register-token', { 
            token: fcmToken,
            platform: 'web',
            browser: navigator.userAgent,
          });
          
          toast.success('🔔 Notifications enabled! You\'ll receive updates about your leads.');
          setShowPopup(false);
          
          // Clear dismissed flag
          localStorage.removeItem('notification-popup-dismissed');
        } catch (error: any) {
          console.error('Error saving FCM token:', error);
          // Still close popup even if backend save fails
          toast.success('Notifications enabled locally');
          setShowPopup(false);
        }
      } else {
        toast.error('Failed to enable notifications. Please check browser settings.');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    // Store dismiss timestamp
    localStorage.setItem('notification-popup-dismissed', Date.now().toString());
    setShowPopup(false);
  };

  const handleBlock = () => {
    // Permanently dismiss (until they clear browser data)
    localStorage.setItem('notification-popup-dismissed', Date.now().toString());
    setShowPopup(false);
    toast('You can enable notifications later from browser settings', {
      icon: '🔕',
    });
  };

  if (!showPopup) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-all"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Bell className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Enable Notifications</h3>
                <p className="text-indigo-100 text-sm">Stay updated with your leads</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              Get instant notifications when:
            </p>
            
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>A tutor shows interest in your request</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>Your lead request is approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>Important updates about your tutoring needs</span>
              </li>
            </ul>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="text-xs text-indigo-700">
                <span className="font-semibold">🔒 Privacy:</span> We only send important updates. 
                You can disable notifications anytime from settings.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAllow}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enabling...</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-5 w-5" />
                    <span>Allow Notifications</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBlock}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                <BellOff className="h-4 w-4" />
                <span>Not Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default NotificationPermissionPopup;
