import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';

type HideOnScrollProps = {
  children: React.ReactElement;
};

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const HideOnScrollAppBar = () => {
  return (
    <HideOnScroll>
      <AppBar position="fixed" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Side: Logo */}
          <Typography variant="h4">SecSock</Typography>

          {/* Right Side: Buttons */}
          <Box sx={{ display: 'flex' }}>
            <Button color="inherit" onClick={() => alert('Docs clicked')}>
              Docs
            </Button>
            <Button color="inherit" onClick={() => alert('Login clicked')}>
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default HideOnScrollAppBar;
