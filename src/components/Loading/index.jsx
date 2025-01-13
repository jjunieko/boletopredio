import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Loading = ({ message = 'Carregando...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            position: 'absolute',
            color: 'primary.main'
          }}
        />
        <ReceiptIcon
          sx={{
            fontSize: 30,
            color: 'primary.main',
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(0.9)',
                opacity: 0.7,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        />
      </Box>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          animation: 'fadeInOut 1.5s infinite',
          '@keyframes fadeInOut': {
            '0%': {
              opacity: 0.5,
            },
            '50%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0.5,
            },
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loading; 