import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { WebhookRequest } from './types';

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Retrieve previous session if one existed.
  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      fetchLogs(storedToken);
    }
  }, []);

  // Used to format a request
  function formatRequest(req: WebhookRequest) {
    const timestamp = new Date(req.timestamp * 1000).toLocaleTimeString();
        return `${timestamp}
        ${req.method} Request
          Query Parameters: ${JSON.stringify(req.query_params || {}, null, 2)}
          Headers: ${JSON.stringify(req.headers, null, 2)}
          Body: ${req.body}`;
  }

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

  const fetchLogs = async (token: string) => {
    try {
      const res = await fetch(`http://localhost:8000/requests/${token}`);
      const data = await res.json();
      const formatted = data.map((req: WebhookRequest) => {
        return formatRequest(req);
      });
      setLogs(formatted.reverse()); // latest last → top
    } catch (err) {
      console.error('Failed to load saved logs:', err);
    }
  };

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
            Your Webhook URL: <code>http://localhost:8000/hook/{token}</code>
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
