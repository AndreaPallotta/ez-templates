import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import React, { ReactNode } from 'react';

interface CButtonProps {
  disabled?: boolean;
  end?: ReactNode;
  icon?: ReactNode;
  iconOnly?: boolean;
  label: string;
  loading?: boolean;
  my?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'medium' | 'large';
  start?: ReactNode;
  style?: object;
  tooltip?: string;
  variant?: 'text' | 'contained' | 'outlined';
  [key: string]: any;
}

const CButton = (props: CButtonProps) => {
  const {
    disabled,
    end,
    icon,
    iconOnly,
    label,
    loading,
    my,
    onClick = () => {},
    size,
    start,
    style = {},
    tooltip,
    variant,
    ...other
  } = props;

  if (iconOnly) {
    return (
      <IconButton aria-label={label} onClick={onClick} size={size || 'large'}>
        {icon}
      </IconButton>
    );
  }

  const buttonProps = {
    disabled: disabled || false,
    onClick,
    size: size || 'large',
    sx: { marginY: my ? `${my}rem` : 0, ...style },
    variant: variant || 'contained' as const,
    ...(start && { startIcon: start }),
    ...(end && loading !== true && { endIcon: end }),
    ...(loading === true && {
      endIcon: <CircularProgress size={20} color="inherit" />,
    }),
    ...other
  };

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      <Button {...buttonProps}>
        {label}
      </Button>
    </Tooltip>
  ) : (
    <Button {...buttonProps}>
      {label}
    </Button>
  );
};

export default CButton;
