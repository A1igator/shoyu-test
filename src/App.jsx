import React, { useState } from 'react';
import styled from 'styled-components';
import TokenList from './components/TokenList';
import UniswapMigrate from './components/UniswapMigrate';
import ConnectWalletButton from './components/ConnectWalletButton';
import 'semantic-ui-css/semantic.min.css';

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
  const [userAddress, setUserAddress] = useState('Connect Wallet');

  return (
    <Container>
      <ConnectWalletButton
        setSigner={setSigner}
        setUserAddress={setUserAddress}
        userAddress={userAddress}
      />
      <ContentContainer>
        <TokenList />
        <UniswapMigrate signer={signer} userAddress={userAddress} />
      </ContentContainer>
    </Container>
  );
}

export default App;
