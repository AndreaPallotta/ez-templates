import { Chip, Divider, Typography } from '@mui/material';
import React from 'react';

interface CDividerProps {
  content: string;
  chip?: boolean;
  align?: 'left' | 'center' | 'right';
  orientation?: 'horizontal' | 'vertical';
  noFlex?: boolean;
  my?: string | number;
  sx?: object;
}

const CDivider = (props: CDividerProps) => {
  const { align, chip, content, my, noFlex, orientation, sx = {} } = props;

  return (
    <Divider
      textAlign={align || 'center'}
      orientation={orientation || 'horizontal'}
      flexItem={noFlex === true ? false : true}
      sx={{
        marginY: my ? `${my}rem` : '1rem',
        ...sx,
      }}
    >
      {chip ? <Chip label={content} /> : <Typography>{content}</Typography>}
    </Divider>
  );
};

export default CDivider;
