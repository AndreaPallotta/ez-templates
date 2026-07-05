import NotificationContext, { NotificationState } from '@/contexts/Notification.tsx';
import { useContext, useState } from 'react';
import { AlertColor } from '@mui/material/Alert';

const useNotification = (
  isDefault: boolean
): [
  (message?: string, severity?: AlertColor) => void,
  (event?: React.SyntheticEvent | Event, reason?: string) => void,
  NotificationState,
  (open: boolean, message: string, severity: AlertColor) => void
] => {
  const { notification, setNotification } = useContext(NotificationContext);
  const [state, setState] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleChange = (open: boolean, message: string, severity: AlertColor) => {
    if (isDefault) {
      setState({ open, message, severity });
    }
    setNotification(open, message, severity);
  };

  const open = (message: string = '', severity: AlertColor = 'info') => {
    handleChange(true, message, severity);
  };

  const close = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    handleChange(false, '', 'info');
  };

  return [
    open,
    close,
    isDefault ? state : notification,
    isDefault ? handleChange : () => {},
  ];
};

export default useNotification;
