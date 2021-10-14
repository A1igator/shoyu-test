import React from 'react';
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

function ConnectWalletButton({
  setSigner,
}) {
  const { userAddress } = useSignerContext();

  const onConnectClick = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    provider.on('network', (_, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
        window.location.reload();
      }
    });
    const signer = provider.getSigner();
    setSigner(signer);
  };

  return (
    <ButtonContainer>
      <ConnectButton
        // disabled={!(userAddress === 'Connect Wallet')}
        onClick={onConnectClick}
      >
        {userAddress}
      </ConnectButton>
    </ButtonContainer>
  );
}

export default ConnectWalletButton;
