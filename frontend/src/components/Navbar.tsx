import React from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Brightness4, Brightness7 } from '@mui/icons-material';

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

interface NavbarProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const HideOnScrollAppBar: React.FC<NavbarProps> = ({ toggleTheme, mode }) => {
  return (
    <HideOnScroll>
      <AppBar position="fixed" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Side: Logo */}
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
            }}
          >
            SecSock
          </Typography>

          {/* Right Side: Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button color="inherit" component={Link} to="/learn">
              Learn
            </Button>

            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default HideOnScrollAppBar;
