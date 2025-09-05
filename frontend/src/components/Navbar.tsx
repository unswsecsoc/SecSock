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
import { Link } from 'react-router-dom';

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
          <Typography variant="h4" component={Link} to="/">
            SecSock
          </Typography>

          {/* Right Side: Buttons */}
          <Box sx={{ display: 'flex' }}>
            <Button color="inherit" component={Link} to="/learn">
              Learn
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default HideOnScrollAppBar;
