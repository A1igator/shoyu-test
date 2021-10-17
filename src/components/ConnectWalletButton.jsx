import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import { ethers } from 'ethers';
import useSignerContext from '../hooks/useSignerContext';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ConnectButton = styled(Button)`
  border-radius: 0 !important;
  margin: 0 !important;
`;

function ConnectWalletButton({ setSigner }) {
  const { userAddress } = useSignerContext();
  const isConnected = userAddress !== 'Connect Wallet';

  const onConnectClick = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const newSigner = provider.getSigner();
    setSigner(newSigner);
  };

  // Only works on metamask to smoothly change things if user switches address or chain.
  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return;
    if (userAddress === 'Connect Wallet') return;
    ethereum.on('chainChanged', onConnectClick);
    ethereum.on('accountsChanged', onConnectClick);
  }, [isConnected]);

  return (
    <ButtonContainer>
      <ConnectButton
        onClick={onConnectClick}
      >
        {userAddress}
      </ConnectButton>
    </ButtonContainer>
  );
}

export default ConnectWalletButton;
