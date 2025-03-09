import { PropsWithChildren } from "react";
import styled from "styled-components";

interface BaseLayoutProps extends PropsWithChildren {
  title: string;
}
export function BaseLayout({title, children}:BaseLayoutProps){
  return <Page>
    <Container>
      <Header>{title}</Header>
      <Content>
      {children}
      </Content>
    </Container>
  </Page>
}

const Page = styled.div({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  background: '#d9d9d9',
});

const Container = styled.div({
  width: '100%',
  maxWidth: '600px',
  minWidth: '340px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  margin: '10px',
  background: '#83388a',
});

const Header = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flex: '0 0 60px',
  padding: '15px',
  color: 'white',
  fontWeight: 600,
});

const Content = styled.div({
  width: '100%',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '20px',
  borderRadius: '8px',
  background: 'white',
});
