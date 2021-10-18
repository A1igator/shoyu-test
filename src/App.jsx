import React, { useState } from 'react';
import styled from 'styled-components';
import TokenList from './components/TokenList';
import UniswapBalanceAndMigrate from './components/UniswapBalanceAndMigrate';
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
  @media (max-width: 1400px) {
    flex-direction: column;
  }
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
          {!signer && <h1>Connect Wallet First</h1>}
          {signer && <UniswapBalanceAndMigrate />}
        </ContentContainer>
      </Container>
    </SignerContextProvider>
  );
}

export default App;
