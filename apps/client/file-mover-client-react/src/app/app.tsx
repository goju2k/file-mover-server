import styled from 'styled-components';
import FileUpload from './pages/file-upload/FileUpload';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <h1>File Upload</h1>
      <FileUpload />
    </StyledApp>
  );
}

export default App;
