import { useState, useEffect } from 'react';

const sendNotification = async (to: string, title: string, body: string) => {
  // Placeholder for sending notifications via Supabase Edge Function
};

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    // Placeholder for notification registration
  }, []);

  return {
    expoPushToken,
    sendNotification,
  };
}
