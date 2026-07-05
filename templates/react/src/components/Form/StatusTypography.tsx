import Typography from '@mui/material/Typography';
import React from 'react';

interface StatusTypographyProps {
  content: string;
  isValid?: boolean;
  [key: string]: any;
}

const StatusTypography = ({ content, isValid = false, ...other }: StatusTypographyProps) => {
  return (
    <Typography
      variant="body2"
      color={isValid ? 'success.main' : 'error.main'}
      {...other}
    >
      {isValid ? `✅ ${content}` : `❌ ${content}`}
    </Typography>
  );
};

export default StatusTypography;
