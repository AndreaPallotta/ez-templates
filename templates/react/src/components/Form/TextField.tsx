import useBoolean from '@/hooks/useBoolean';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import React, { ReactNode } from 'react';

interface AdornmentConfig {
  icon: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  aria?: string;
}

type Adornment = string | AdornmentConfig;

interface CTextFieldProps {
  end?: Adornment;
  error?: boolean;
  focusFirst?: boolean;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  password?: boolean;
  readOnly?: boolean;
  required?: boolean;
  start?: Adornment;
  type?: string;
  value: string | number;
  [key: string]: any;
}

const CTextField = (props: CTextFieldProps) => {
  const {
    end,
    error,
    focusFirst,
    label,
    onChange,
    password,
    readOnly,
    required,
    start,
    type,
    value,
    ...other
  } = props;

  const [showPassword, toggleShowPassword] = useBoolean(true);

  const prevDefault = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const formatAdornment = (adornment: Adornment, position: 'start' | 'end') => (
    <InputAdornment position={position}>
      {typeof adornment === 'string' || !adornment.onClick ? (
        (adornment as any).icon ?? adornment
      ) : (
        <IconButton
          aria-label={adornment.aria}
          edge={position}
          onClick={adornment.onClick}
          onMouseDown={prevDefault as any}
        >
          {adornment.icon}
        </IconButton>
      )}
    </InputAdornment>
  );

  const passwordAdornment = () =>
    formatAdornment(
      {
        icon: showPassword ? <VisibilityOff /> : <Visibility />,
        onClick: () => {
          toggleShowPassword();
        },
        aria: 'toggle-password-field-visibility',
      },
      'end'
    );

  const isAdornmentValid = (adornment?: Adornment): adornment is Adornment => {
    if (!adornment) return false;
    if (typeof adornment === 'string') return adornment.trim().length > 0;
    return typeof adornment === 'object' && adornment.icon !== undefined;
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: '1.5rem' }}>
      <InputLabel htmlFor={`c-text-field-${label}}`}>{label}</InputLabel>
      <OutlinedInput
        autoFocus={focusFirst || false}
        error={error || false}
        id={`c-text-field-${label}}`}
        label={label}
        name={label.toLowerCase()}
        onChange={onChange}
        readOnly={readOnly || false}
        required={required ?? false}
        value={value}
        {...(type && { type })}
        {...(password && {
          type: showPassword ? 'text' : 'password',
        })}
        {...(isAdornmentValid(start) && {
          startAdornment: formatAdornment(start, 'start'),
        })}
        {...(isAdornmentValid(end) && {
          endAdornment: formatAdornment(end, 'end'),
        })}
        {...(password &&
          value && {
            endAdornment: passwordAdornment(),
          })}
        {...other}
      />
    </FormControl>
  );
};

export default CTextField;
