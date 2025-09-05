import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const EULA = ({ onAccept }: { onAccept: () => void }) => {
  return (
    <>
      <Box sx={{ mx: 5 }}>
        <Typography variant="h1">Welcome to SecSock</Typography>

        <Typography variant="h6" mb={3}>
          DISCLAIMER: this tool is intended for educational purposes. Performing
          hacking attempts on computers that you do not own (without permission)
          is illegal! Do not attempt to gain access to a device or service that
          you do not own.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            fontSize: '1.1rem',
            px: 3,
            py: 1.5,
            mb: 2,
          }}
          color="secondary"
          component={Link}
          to="/"
          onClick={onAccept}
        >
          I Accept
        </Button>
      </Box>
    </>
  );
};

export default EULA;
