import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import { ethers } from 'ethers';
import TokenList from './components/TokenList';
import UniswapBalance from './components/UniswapBalance';
import 'semantic-ui-css/semantic.min.css';

const Container = styled.div`
  background: #1B1C1D;
  color: rgba(255, 255, 255, 0.9);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: calc(100vh - 40px);
`;

function App() {
  const [address, setAddress] = useState('Connect Wallet');
  const [provider, setProvider] = useState();

  return (
    <Container>
      <ButtonContainer>
        <Button
          disabled={!(address === 'Connect Wallet')}
          onClick={async () => {
            const walletProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(walletProvider);
            await walletProvider.send('eth_requestAccounts', []);
            const signer = walletProvider.getSigner();
            setAddress(await signer.getAddress());
          }}
        >
          {address}
        </Button>
      </ButtonContainer>
      <ContentContainer>
        <TokenList />
        <UniswapBalance address={address} provider={provider} />
      </ContentContainer>
    </Container>
  );
}

export default App;
