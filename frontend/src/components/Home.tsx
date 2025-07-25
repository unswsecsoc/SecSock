import { useState, useRef, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import type { WebhookRequest } from './types';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<WebhookRequest[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const theme = useTheme();

  const methodColorMap: Record<
    string,
    'info' | 'success' | 'warning' | 'error' | 'default'
  > = {
    GET: 'info',
    POST: 'success',
    PUT: 'warning',
    DELETE: 'error',
    PATCH: 'default',
  };

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

  // Used to format a request
  // const formatRequest = (req: WebhookRequest) => {
  //   const timestamp = new Date(req.timestamp * 1000).toLocaleTimeString();
  //   return `${timestamp}
  //       ${req.method} Request
  //         Query Parameters: ${JSON.stringify(req.query_params || {}, null, 2)}
  //         Headers: ${JSON.stringify(req.headers, null, 2)}
  //         Body: ${req.body}`;
  // };

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ minHeight: '30vh', textAlign: 'center' }}
      >
        <Typography variant="h1" sx={{ mb: 1 }}>
          SecSock
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Made with ❤ by SecSoc Projects
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mb={4}>
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
          <Box textAlign="center">
            <Button
              onClick={replaceOld}
              variant="contained"
              size="large"
              sx={{ fontSize: '1.1rem', px: 3, py: 1.5, mb: 2 }}
              color="secondary"
            >
              Reset URL
            </Button>

            <Typography variant="h6">
              Your Webhook URL:{' '}
              <Button onClick={copyToClipboard} variant="text">
                http://localhost:8000/hook/{token}
              </Button>
            </Typography>
          </Box>
        )}
      </Box>

      <Box>
        {logs.map((req, index) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ width: '100%' }}>
                <Box display="flex" justifyContent="space-between">
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <Chip
                      label={req.method}
                      color={methodColorMap[req.method] || 'default'}
                      size="small"
                    />
                    <Typography variant="body2">{req.ip}</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.2 }}
                  >
                    {new Date(req.timestamp * 1000).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 2, py: 1 }}>
              {/* Query section */}
              <Divider sx={{ mb: 1 }}>Query Parameters</Divider>
              {req.query_params && Object.keys(req.query_params).length > 0 ? (
                <Box component="dl" sx={{ ml: 1 }}>
                  {Object.entries(req.query_params).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', mb: 0.5}}>
                      <Typography sx={{ minWidth: 100, fontWeight: 'bold', textAlign: 'left', mr: '1' }}>
                        {key}:
                      </Typography>
                      <Typography sx={{ wordBreak: 'break-word' }}>
                        {String(value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ ml: 1, fontStyle: 'italic' }}>
                  {'{}'}
                </Typography>
              )}

              {/* Header section */}
              <Divider sx={{ my: 1 }}>Headers</Divider>
              {req.headers && Object.keys(req.headers).length > 0 ? (
                <Box component="dl" sx={{ ml: 1 }}>
                  {Object.entries(req.headers).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', mb: 0.5, textAlign: 'left', mr: '1'  }}>
                      <Typography sx={{ minWidth: 100, fontWeight: 'bold' }}>
                        {key}:
                      </Typography>
                      <Typography sx={{ wordBreak: 'break-word' }}>
                        {String(value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ ml: 1, fontStyle: 'italic' }}>
                  {'{}'}
                </Typography>
              )}

              {/* Body section */}
              <Divider sx={{ my: 1 }}>Body</Divider>
              {req.body && req.body !== '{}' ? (
                <Box component="dl" sx={{ ml: 1 }}>
                  {(() => {
                    try {
                      const bodyObj =
                        typeof req.body === 'string'
                          ? JSON.parse(req.body)
                          : req.body;
                      return Object.entries(bodyObj).map(([key, value]) => (
                        <Box key={key} sx={{ display: 'flex', mb: 0.5, textAlign: 'left', mr: '1'  }}>
                          <Typography
                            sx={{ minWidth: 100, fontWeight: 'bold' }}
                          >
                            {key}:
                          </Typography>
                          <Typography sx={{ wordBreak: 'break-word' }}>
                            {String(value)}
                          </Typography>
                        </Box>
                      ));
                    } catch {
                      return <Typography sx={{ ml: 1 }}>{req.body}</Typography>;
                    }
                  })()}
                </Box>
              ) : (
                <Typography sx={{ ml: 1, fontStyle: 'italic' }}>
                  {'{}'}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <ToastContainer />
    </Container>
  );
}

export default Home;
