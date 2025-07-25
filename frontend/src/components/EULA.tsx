import { Typography, Button } from '@mui/material';

const EULA = ({ onAccept }: { onAccept: () => void }) => {
  return (
    <>
      <Typography variant="h1">Welcome to SecSock</Typography>

      <Typography variant="h6" mb={3}>
        DISCLAIMER: this tools is intended for educational purposes. Performing
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
        onClick={onAccept}
      >
        I Accept
      </Button>
    </>
  );
};

export default EULA;
