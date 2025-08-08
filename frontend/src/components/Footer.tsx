import { Box, Typography, Link } from '@mui/material';

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
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} SecSock &nbsp;|&nbsp;
        <Link href="https://github.com/unswsecsoc/SecSock" underline="hover" target="_blank" rel="noopener">
          GitHub
        </Link>
        &nbsp;|&nbsp;
        <Link href="/privacy" underline="hover">
          Privacy
        </Link>
      </Typography>
    </Box>
  );
}
