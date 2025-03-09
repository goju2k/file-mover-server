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

  useEffect(() => {
    
    const socket = new WebSocket("ws://localhost:5001");
    
    socket.onmessage = (event) => {
        const uploadedFile = JSON.parse(event.data);
        setUploads((prevUploads) => [uploadedFile, ...prevUploads]); // Add new upload to the top
    };
    
    return () => socket?.close(); // Cleanup WebSocket on component unmount
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