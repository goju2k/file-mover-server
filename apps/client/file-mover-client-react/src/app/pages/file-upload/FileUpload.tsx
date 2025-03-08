import { ChangeEvent, useState } from "react";
import axios from "axios";

interface ProgressInfo {
  progress: number;
  total: number;
  current: number;
}

const FileUpload = () => {
    const [file, setFile] = useState<File>();
    const [message, setMessage] = useState("");
    const [progressInfo, setProgressInfo] = useState<ProgressInfo>({
      progress: 0,
      total: 0,
      current: 0,
    });
    
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0]);
        setProgressInfo({
          progress: 0,
          total: 0,
          current: 0,
        }); // Reset progress
    };

    const handleUpload = async () => {
      if (!file) {
        setMessage("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post("http://localhost:5000/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                if(progressEvent.total){
                  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  setProgressInfo({
                    total: progressEvent.total,
                    current: progressEvent.loaded,
                    progress: percentCompleted,
                  });
                }else{
                  setProgressInfo({
                    total: 0,
                    current: progressEvent.loaded,
                    progress: 100,
                  });
                }
            },
        });
        setMessage(response.data.message);
    } catch (error) {
        setMessage("Error uploading file");
    }
    };

    return (
      <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
          <div style={{ width: "100%", backgroundColor: "#ccc", marginTop: "10px" }}>
              <div
                  style={{
                      width: `${progressInfo.progress}%`,
                      height: "10px",
                      backgroundColor: "green",
                  }}
              />
          </div>
          {
          progressInfo.progress > 0 && 
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>{`${progressInfo.current.toLocaleString()} / ${progressInfo.total.toLocaleString()}`}</div>
            <div>{`${progressInfo.progress}%`}</div>
          </div>
          }
          {message && <p>{message}</p>}
      </div>
  );
};

export default FileUpload;
