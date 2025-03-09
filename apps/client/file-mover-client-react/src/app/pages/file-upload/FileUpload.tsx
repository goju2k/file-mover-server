import { ChangeEvent, useCallback, useState } from "react";
import axios from "axios";
import { BaseLayout } from "./components/BaseLayout";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

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

    const onDrop = useCallback((acceptedFiles:File[]) => {
      setMessage('');
      setFile(acceptedFiles[0]);
      setProgressInfo({
        progress: 0,
        total: 0,
        current: 0,
      }); // Reset progress
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/zip/*": [] } // Accepts only zips
    });
    
    // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     setFile(event.target.files?.[0]);
    //     setProgressInfo({
    //       progress: 0,
    //       total: 0,
    //       current: 0,
    //     }); // Reset progress
    // };

    const handleUpload = async () => {

      setMessage('');

      if (!file) {
        setMessage("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", 'goju');

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
        setFile(undefined);
    } catch (error) {
        setMessage("Error uploading file");
    }
    };

    return (
      <BaseLayout title="FE File Mover">
        <div style={{width: '100%'}}>
          <div
              {...getRootProps()}
              style={{
                  border: "2px dashed rgb(189, 189, 189)",
                  borderRadius: '4px',
                  padding: "20px",
                  cursor: "pointer",
                  backgroundColor: isDragActive ? "#f0f8ff" : "#f9f9f9",
                  marginBottom: "10px",
              }}
          >
            <input {...getInputProps()} />
            {file ? (
                <DragDropText>Selected File: {file.name}</DragDropText>
            ) : isDragActive ? (
                <DragDropText>Drop the file here...</DragDropText>
            ) : (
                <DragDropText>Drag & drop a file here, or click to select one</DragDropText>
            )}
          </div>
          {/* <input type="file" onChange={handleFileChange} /> */}
          <div style={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
            <p>{message}</p>
            <UploadButton onClick={handleUpload} disabled={!file}>전송</UploadButton>
          </div>
          <div style={{ width: "100%", backgroundColor: "#818181", marginTop: "10px", borderRadius: '4px', opacity: 0.5 + (0.005 * progressInfo.progress) }}>
              <div
                  style={{
                      width: `${progressInfo.progress}%`,
                      height: "10px",
                      backgroundColor: "#31bb31",
                      borderRadius: '4px',
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
        </div>
      </BaseLayout>
  );
};

const DragDropText = styled.p({
  fontSize: '14px',
})

const UploadButton = styled.button({
  borderRadius: '4px',
  padding: '5px 15px',
  background: '#f7f4f7',
  color: '#39063a',
  fontWeight: 700,
  border: '1px solid #eee6ee',
  cursor: 'pointer',
  ':disabled': {
    cursor: 'default',
    opacity: 0.5,
  }
});

export default FileUpload;
