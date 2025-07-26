import { Box } from '@mui/material';

const PulsingDot = () => {
  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: 'green',
        boxShadow: '0 0 0 0 rgba(0, 255, 0, 0.7)',
        animation: 'pulse 1.5s infinite',
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(0, 255, 0, 0.7)',
          },
          '70%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 10px rgba(0, 255, 0, 0)',
          },
          '100%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(0, 255, 0, 0)',
          },
        },
      }}
    />
  );
};

export default PulsingDot;
