import { createContext } from 'react';
import { AlertColor } from '@mui/material/Alert';

export interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface NotificationContextProps {
  notification: NotificationState;
  setNotification: (open: boolean, message: string, severity: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  notification: { open: false, message: '', severity: 'info' },
  setNotification: () => {},
});

export default NotificationContext;
