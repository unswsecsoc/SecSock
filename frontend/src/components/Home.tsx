import { useState, useRef, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import type { WebhookRequest } from './types';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Box, Button, Typography, useTheme } from '@mui/material';
import RequestAccordion from './RequestAccordion';

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<WebhookRequest[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const theme = useTheme();

  const copyToClipboard = () => {
    navigator.clipboard.writeText('http://localhost:8000/hook/' + token);
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
    });
  };

  const createNew = async () => {
    // Needed so replaceOld works
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Get new token
    const res = await fetch('http://localhost:8000/new');
    const data = await res.json();
    setToken(data.token);
    Cookies.set('token', data.token, { expires: 7 });

    setupWebSocket(data.token);
  };

  const fetchLogs = useCallback(async (token: string) => {
    try {
      const res = await fetch(`http://localhost:8000/requests/${token}`);
      const data = await res.json();
      // const formatted = data.map((req: WebhookRequest) => formatRequest(req));
      setLogs(data.reverse());
    } catch (err) {
      console.error('Failed to load saved logs:', err);
    }
  }, []);

  // Retrieve previous session if one existed.
  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      fetchLogs(storedToken);
      setupWebSocket(storedToken);
    }
  }, [fetchLogs]);

  const replaceOld = async () => {
    setLogs([]);
    await createNew();
  };

  const setupWebSocket = (token: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/${token}`);
    ws.onmessage = (event) => {
      console.log(JSON.parse(event.data));
      const req: WebhookRequest = JSON.parse(event.data);
      setLogs((prevLogs) => [req, ...prevLogs]);
    };
    wsRef.current = ws;
  };

  return (
    <Box sx={{ py: 4, width: '100vw' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ minHeight: '20vh', textAlign: 'center' }}
      >
        <Typography variant="h1" sx={{ mb: 1 }}>
          SecSock
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Made with ❤ by SecSoc Projects
        </Typography>
      </Box>

      <Box display={'flex'} width={'100%'} alignItems={'flex-start'} gap={5}>
        <Box
          sx={{
            flex: '0 0 30%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {!token ? (
            <Button
              onClick={createNew}
              variant="contained"
              size="large"
              sx={{ fontSize: '1.2rem', px: 4, py: 2 }}
              color="primary"
            >
              Generate New Webhook
            </Button>
          ) : (
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
                  http://localhost:8000/hook/{token}
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
          )}
        </Box>

        <Box
          bgcolor={'background.paper'}
          padding={2}
          borderRadius={2}
          sx={{
            flex: '1 1 70%',
            overflow: 'auto',
            mr: 10,
            minHeight: '50vh',
          }}
        >
          <RequestAccordion logs={logs} />
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default Home;
