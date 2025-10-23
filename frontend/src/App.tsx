import { useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import EULA from './components/EULA';
import Home from './components/Home';
import Learn from './components/Learn';
import ProtectedRoute from './components/ProtectedRoute';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
  
  const [termsAccepted, setAccepted] = useState(
    Cookies.get('termsaccepted') === 'true'
  );

  const handleAccept = () => {
    Cookies.set('termsaccepted', 'true', { expires: 30 });
    setAccepted(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isAllowed={termsAccepted}>
                <Home toggleTheme={toggleTheme} mode={mode} />
              </ProtectedRoute>
            }
          />
          <Route path="/eula" element={<EULA onAccept={handleAccept} />} />
          <Route path="/learn" element={<Learn toggleTheme={toggleTheme} mode={mode} />} />
          <Route path="*" element={<p>There's nothing here! 404</p>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
