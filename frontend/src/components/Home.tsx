import { useState, useRef } from 'react';

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
   const wsRef = useRef<WebSocket | null>(null);

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

    const ws = new WebSocket(`ws://localhost:8000/ws/${data.token}`);
    ws.onmessage = (event) => {
      const req = JSON.parse(event.data);
      const timestamp = new Date(req.timestamp * 1000).toLocaleTimeString();
      const text = `${timestamp}
${req.method} Request
Query Parameters: ${JSON.stringify(req.query_params || {}, null, 2)}
Headers: ${JSON.stringify(req.headers, null, 2)}
Body: ${req.body}`;
      setLogs((prevLogs) => [text, ...prevLogs]);
    };

    wsRef.current = ws;
  };

  const replaceOld = async () => {
    setLogs([]);
    await createNew();
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>SecSock</h1>
      <button onClick={createNew}>Generate New Webhook</button>
       {token && (
        <>
          <button onClick={replaceOld} style={{ marginLeft: 10 }}>
            Reset URL
          </button>
          <p>
            Your Webhook URL:{' '}
            <code>http://localhost:8000/hook/{token}</code>
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
