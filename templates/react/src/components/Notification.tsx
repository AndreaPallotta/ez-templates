import Alert from '@/components/AlertRef';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';
import { AlertColor } from '@mui/material/Alert';

interface NotificationProps {
  open: boolean;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  message: string;
  severity: AlertColor;
}

const Notification = (props: NotificationProps) => {
  const { open, onClose, message, severity } = props;

  return (
    <Snackbar
      key={new Date().getTime()}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
