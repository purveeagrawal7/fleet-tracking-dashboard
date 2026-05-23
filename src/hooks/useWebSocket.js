import { useEffect, useRef, useState } from 'react';

const WS_URL = 'wss://case-study-26cf.onrender.com';
const RECONNECT_DELAY = 5000;

function useWebSocket(onUpdate) {
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const onUpdateRef = useRef(onUpdate);

  // Keep the callback ref up to date without re-running the effect
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        clearTimeout(reconnectTimerRef.current);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onUpdateRef.current) {
            onUpdateRef.current(data);
          }
        } catch (err) {
          // Ignore non-JSON frames
        }
      };

      ws.onerror = () => {
        setWsConnected(false);
      };

      ws.onclose = () => {
        setWsConnected(false);
        reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY);
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on unmount
        wsRef.current.close();
      }
    };
  }, []);

  return { wsConnected };
}

export default useWebSocket;
