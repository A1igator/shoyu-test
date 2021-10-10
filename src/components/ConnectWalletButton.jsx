import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import { ethers } from 'ethers';
// import useWeb3 from '../hooks/useWeb3';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ConnectButton = styled(Button)`
  border-radius: 0 !important;
  margin: 0 !important;
`;

function ConnectWalletButton({ setSigner }) {
  const [address, setAddress] = useState('Connect Wallet');

  const onConnectClick = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    setSigner(signer);
    setAddress(await signer.getAddress());
  };

  return (
    <ButtonContainer>
      <ConnectButton
        disabled={!(address === 'Connect Wallet')}
        onClick={onConnectClick}
      >
        {address}
      </ConnectButton>
    </ButtonContainer>
  );
}

export default ConnectWalletButton;
