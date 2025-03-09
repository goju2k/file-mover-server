import styled from 'styled-components';
import FileUpload from './pages/file-upload/FileUpload';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { UploadList } from './pages/upload-list/UploadList';

const StyledApp = styled.div`
  body {
    margin: 0;
  }
`;

export function App() {
  return (
    <StyledApp>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FileUpload />} />
          <Route path='/upload/list' element={<UploadList />} />
        </Routes>
      </BrowserRouter>
    </StyledApp>
  );
}

export default App;
