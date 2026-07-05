import Notification from '@/components/Notification';
import NotificationContext from '@/contexts/Notification';
import useNotification from '@/hooks/useNotification';
import ChildPage from '@/pages/ChildPage';
import { app } from '@/utils/env';
import React, { useEffect } from 'react';

function App() {
  const [, close, notification, setNotification] = useNotification(true);

  useEffect(() => {
    document.title = app.name;
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      <div className='App'>
        <ChildPage />
        <Notification
          open={notification.open}
          onClose={close}
          message={notification.message}
          severity={notification.severity}
        />
      </div>
    </NotificationContext.Provider>
  );
}

export default App;
