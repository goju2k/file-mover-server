import styled from 'styled-components';
import FileUpload from './pages/file-upload/FileUpload';

const StyledApp = styled.div`
  body {
    margin: 0;
  }
`;

export function App() {
  return (
    <StyledApp>
      <FileUpload />
    </StyledApp>
  );
}

export default App;
