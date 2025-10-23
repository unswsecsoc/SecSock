import { useState, useRef, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import type { WebhookRequest } from './types';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RequestAccordion from './RequestAccordion';
import PulsingDot from './PulsingDot';
import Navbar from './Navbar';
import Footer from './Footer';
import notificationSound from '../assets/request_received_notification.mp3';

const backendURL = import.meta.env.VITE_BACKEND_URL;
const backendDomain = backendURL.split('//')[1];

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<WebhookRequest[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const theme = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => {
        console.warn('Audio play failed:', e);
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(backendURL + '/hook/' + token);
    toast('Copied to clipboard', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: theme.palette.mode,
      transition: Bounce,
      pauseOnFocusLoss: false,
    });
  };

  const createNew = async () => {
    // Needed so replaceOld works
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Get new token
    const res = await fetch(`${backendURL}/new`);
    const data = await res.json();
    setToken(data.token);
    Cookies.set('token', data.token, { expires: 7 });

    setupWebSocket(data.token);
  };

  const fetchLogs = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${backendURL}/requests/${token}`);
      const data = await res.json();
      setLogs(data.reverse());
    } catch (err) {
      console.error('Failed to load saved logs:', err);
    }
  }, []);

  const replaceOld = async () => {
    setLogs([]);
    await createNew();
  };

  const setupWebSocket = useCallback(
    (token: string) => {
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Need a way to make this wss automatically for prod, wss doesn't work in dev environment
      const websocketType = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const ws = new WebSocket(`${websocketType}://${backendDomain}/ws/${token}`);
      ws.onmessage = (event) => {
        toast('Received a request', {
          position: 'top-right',
          autoClose: 3000,
          theme: theme.palette.mode,
          transition: Bounce,
          pauseOnFocusLoss: false,
        });

        playSound();

        const req: WebhookRequest = JSON.parse(event.data);
        setLogs((prevLogs) => [req, ...prevLogs]);
      };
      wsRef.current = ws;
    },
    [theme.palette.mode]
  );

  // Retrieve previous session if one existed.
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.load();

    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      fetchLogs(storedToken);
      setupWebSocket(storedToken);
    }
  }, [fetchLogs, setupWebSocket]);

  return (
    <>
      <Navbar />
      <Box sx={{ py: 4, width: '100vw', minHeight: '94.6vh', mt: '10vh' }}>
        {/* If not token has been previously generated */}
        {!token && (
          <Box m={'11%'}>
            <Button
              onClick={createNew}
              variant="contained"
              size="large"
              sx={{ fontSize: '1.2rem', px: 4, py: 2 }}
              color="primary"
            >
              Generate New Webhook
            </Button>
          </Box>
        )}

        {/* If a token is already stored */}
        {token && (
          <Box
            display={'flex'}
            width={'100%'}
            alignItems={'flex-start'}
            gap={2}
          >
            <Box
              sx={{
                flex: '0 0 40%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Box
                textAlign="center"
                bgcolor={'background.paper'}
                borderRadius={2}
                padding={2}
              >
                <Typography variant="h5">
                  Your webhook link:{' '}
                  <Button
                    onClick={copyToClipboard}
                    variant="text"
                    sx={{ my: 1, fontSize: '1rem' }}
                  >
                    {backendURL}/hook/{token}
                  </Button>
                </Typography>
                <Button
                  onClick={replaceOld}
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: '1.1rem', px: 1, py: 0.5, mb: 2 }}
                  color="secondary"
                >
                  Reset URL
                </Button>
              </Box>
            </Box>

            {/* Accordion */}
            <Box
              sx={{
                flex: '1 1 60%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mr: 10,
              }}
            >
              <Box display="flex" alignItems="center" gap={2} ml={1}>
                <PulsingDot />
                <Typography variant="h5" fontWeight={600}>
                  Listening...
                </Typography>
              </Box>

              <Box
                bgcolor={'background.paper'}
                padding={2}
                borderRadius={2}
                sx={{
                  overflow: 'auto',
                  minHeight: '50vh',
                  flexGrow: 1,
                }}
              >
                <RequestAccordion logs={logs} token={token} setLogs={setLogs} />
              </Box>
            </Box>
          </Box>
        )}
        <ToastContainer />
      </Box>
      <Footer />
    </>
  );
}

export default Home;
