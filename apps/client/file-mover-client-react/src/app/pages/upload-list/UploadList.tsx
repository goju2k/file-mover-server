import { useEffect, useRef, useState } from "react";
import { BaseLayout } from "../file-upload/components/BaseLayout";

interface RequestedInfo {
  message: string;
  filename: string;
  username: string;
  timestamp: number;
  seq: number;
}

export function UploadList(){

  const [uploads, setUploads] = useState<RequestedInfo[]>([]);

  const [socket, setSocket] = useState<WebSocket>();
  let reconnectInterval = 1000; // Start with 1s delay

  const wsInitialized = useRef(false);

  const connectWebSocket = () => {
    console.log("Connecting to WebSocket...");
    const ws = new WebSocket("ws://localhost:5001");

    wsInitialized.current = true;

    ws.onopen = () => {
        console.log("Connected to WebSocket server!");
        reconnectInterval = 1000; // Reset backoff timer on successful connection
    };

    ws.onmessage = (event) => {
        const uploadedFile = JSON.parse(event.data);
        setUploads((prevUploads) => [uploadedFile, ...prevUploads]); // Add new upload
    };

    ws.onclose = () => {
        console.log(`WebSocket disconnected! Retrying in ${reconnectInterval / 1000} seconds...`);
        setTimeout(connectWebSocket, reconnectInterval);
        reconnectInterval = Math.min(reconnectInterval * 2, 5000); // Exponential backoff, max 5s
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close(); // Ensure reconnection on error
    };

    setSocket(ws);
  };

  useEffect(() => {
    if(!wsInitialized.current){
      connectWebSocket();
    }
    return () => socket && socket.close(); // Cleanup on unmount
  }, []);

  return <BaseLayout title="Requested List">
    {uploads.length === 0 ? <p>No uploads yet...</p> : null}
    <ul style={{ listStyle: "none", padding: 0 }}>
      {uploads.map((upload, index) => (
          <li key={index} style={{ minWidth: '300px', padding: "10px", borderBottom: "1px solid #ddd" }}>
              <strong>{upload.filename}</strong> <br />
              <div style={{display:'flex', justifyContent: 'space-between'}}>
                <small>{upload.username}</small>
                <small>{new Date(upload.timestamp).toLocaleString()}</small>
              </div>
          </li>
      ))}
    </ul>
  </BaseLayout>
}