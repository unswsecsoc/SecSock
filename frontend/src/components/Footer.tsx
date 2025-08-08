import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Typography variant="body1" color="text.secondary">
        © {new Date().getFullYear()} UNSW Security Society &nbsp;|&nbsp;
        Made with ❤ by SecSoc Projects
      </Typography>
    </Box>
  );
}
