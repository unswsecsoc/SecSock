import { useState, useRef, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import type { WebhookRequest } from './types';
import { Bounce, ToastContainer, toast } from 'react-toastify';

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

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
      theme: 'light',
      transition: Bounce,
    });
  };

  // Used to format a request
  const formatRequest = (req: WebhookRequest) => {
    const timestamp = new Date(req.timestamp * 1000).toLocaleTimeString();
    return `${timestamp}
        ${req.method} Request
          Query Parameters: ${JSON.stringify(req.query_params || {}, null, 2)}
          Headers: ${JSON.stringify(req.headers, null, 2)}
          Body: ${req.body}`;
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

    const ws = new WebSocket(`ws://localhost:8000/ws/${data.token}`);
    ws.onmessage = (event) => {
      const req: WebhookRequest = JSON.parse(event.data);
      const text = formatRequest(req);

      setLogs((prevLogs) => [text, ...prevLogs]);
    };

    wsRef.current = ws;
  };

  const fetchLogs = useCallback(async (token: string) => {
    try {
      const res = await fetch(`http://localhost:8000/requests/${token}`);
      const data = await res.json();
      const formatted = data.map((req: WebhookRequest) => formatRequest(req));
      setLogs(formatted.reverse());
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
    }
  }, [fetchLogs]);

  const replaceOld = async () => {
    setLogs([]);
    await createNew();
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>SecSock</h1>

      {!token && <button onClick={createNew}>Generate New Webhook</button>}

      {token && (
        <>
          <button onClick={replaceOld} style={{ marginLeft: 10 }}>
            Reset URL
          </button>
          <p>
            Your Webhook URL:{' '}
            <button onClick={copyToClipboard}>
              http://localhost:8000/hook/{token}
            </button>
            <ToastContainer/>
          </p>
        </>
      )}
      <div>
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f4f4f4',
              padding: '10px',
              border: '1px solid #ccc',
              marginTop: '10px',
            }}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
