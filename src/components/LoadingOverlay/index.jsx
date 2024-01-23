import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(66, 66, 66, 0.7);',
        zIndex: 9999, // put the loader spinner front of other components
      }}
    >
      <CircularProgress size={80} thickness={4} color="primary"/>
    </Box>
  );
};

export default LoadingOverlay;
