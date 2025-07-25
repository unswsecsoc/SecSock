import '@fontsource/jersey-15';
import { type ThemeOptions, createTheme } from '@mui/material';

const commonTypography = {
  fontFamily: '"Jersey 15", sans-serif',
};

const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  background: {
    default: '#1E1F2B', // Midnight Slate
    paper: '#2D2F3B', // Graphite Gray
  },
  primary: {
    main: '#0F90C4', // Terminal Blue
    contrastText: '#EDEDED',
  },
  secondary: {
    main: '#3AE1AD', // Accent Mint
  },
  text: {
    primary: '#EDEDED', // Soft White
    secondary: '#A0A0A0',
  },
  error: {
    main: '#FF4C4C', // Error Red
  },
  warning: {
    main: '#F5A623', // Warning Amber
  },
};

const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  background: {
    default: '#F9FAFB', // Soft light background
    paper: '#FFFFFF',
  },
  primary: {
    main: '#0F90C4',
  },
  secondary: {
    main: '#3AE1AD',
  },
  text: {
    primary: '#1E1F2B', // Midnight Slate for text
    secondary: '#4B4B4B',
  },
  error: {
    main: '#D32F2F',
  },
  warning: {
    main: '#ED6C02',
  },
};

export const lightTheme = createTheme({
  typography: commonTypography,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  typography: commonTypography,
  palette: darkPalette,
});
