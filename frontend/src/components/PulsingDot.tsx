import { Box } from '@mui/material';

interface PulsingDotProps {
  colour?: string; // optional, defaults to green
}

const PulsingDot = ({ colour = 'green' }: PulsingDotProps) => {
  // Extract RGB values if possible to create a matching rgba pulse
  const rgbMap: Record<string, string> = {
    red: '255, 0, 0',
    green: '0, 255, 0',
    yellow: '255, 255, 0',
    blue: '0, 128, 255',
    orange: '255, 165, 0',
    gray: '128, 128, 128',
  };

  const rgb = rgbMap[colour.toLowerCase()] || '0, 255, 0';

  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: colour,
        boxShadow: `0 0 0 0 rgba(${rgb}, 0.7)`,
        animation: 'pulse 1.5s infinite',
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(0.95)',
            boxShadow: `0 0 0 0 rgba(${rgb}, 0.7)`,
          },
          '70%': {
            transform: 'scale(1)',
            boxShadow: `0 0 0 10px rgba(${rgb}, 0)`,
          },
          '100%': {
            transform: 'scale(0.95)',
            boxShadow: `0 0 0 0 rgba(${rgb}, 0)`,
          },
        },
      }}
    />
  );
};

export default PulsingDot;
