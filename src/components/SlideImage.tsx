import React from 'react';
import { Box } from '@mui/material';

interface SlideImageProps {
  imgSrc: string;
  width: string;
}

const SlideImage: React.FC<SlideImageProps> = ({ imgSrc, width }) => (
  <Box
    sx={{
      backgroundColor: 'white',
      borderRadius: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      height: '90%',
      border: '10px solid #404040 ',
    }}
  >
    <img
      src={imgSrc}
      alt="SlideImage"
      style={{
        width: width,
        maxHeight: '100%',
        borderRadius: 8,
      }}
    />
  </Box>
);

export default SlideImage;
