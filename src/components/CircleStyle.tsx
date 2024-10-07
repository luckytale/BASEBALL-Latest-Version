import React from 'react';
import { Box } from '@mui/material';

const CircleStyle: React.FC<{ color: string }> = ({ color }) => (
  <Box
    sx={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: color,
      border: '1px solid black',
    }}
  />
);

export default CircleStyle;
