'use client';

import { useEffect, useState } from 'react';

export default function NotificationCheck() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if the Notification API is supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);

      // If permission is not granted, prompt the user
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  return (
    <div className="p-4">
      {notificationPermission !== 'granted' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Notifications Disabled</p>
          <p>Please enable notifications in your browser to receive updates.</p>
          {notificationPermission === 'denied' && (
            <p className="mt-2">
              It looks like notifications are blocked. Please go to your browser settings to allow notifications for this site.
            </p>
          )}
          {notificationPermission === 'default' && (
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => Notification.requestPermission().then((permission) => setNotificationPermission(permission))}
            >
              Enable Notifications
            </button>
          )}
        </div>
      )}
      {notificationPermission === 'granted' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
          <p className="font-bold">Notifications Enabled</p>
          <p>You will receive notifications from this site.</p>
        </div>
      )}
    </div>
  );
}