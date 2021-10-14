import React, { useState } from 'react';
import styled from 'styled-components';
import TokenList from './components/TokenList';
import UniswapMigrate from './components/UniswapMigrate';
import ConnectWalletButton from './components/ConnectWalletButton';
import 'semantic-ui-css/semantic.min.css';
import SignerContextProvider from './components/SignerContextProvider';

const Container = styled.div`
  background: #1B1C1D;
  color: rgba(255, 255, 255, 0.9);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: calc(100vh - 36px);
`;

function App() {
  const [signer, setSigner] = useState();

  return (
    <SignerContextProvider signer={signer}>
      <Container>
        <ConnectWalletButton
          setSigner={setSigner}
        />
        <ContentContainer>
          <TokenList />
          <UniswapMigrate />
        </ContentContainer>
      </Container>
    </SignerContextProvider>
  );
}

export default App;
