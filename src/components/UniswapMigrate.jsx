import React, { useEffect, useState } from 'react';
import { Checkbox, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import MigrateWithApproval from './MigrateWithApproval';
import useMigrate from '../hooks/useMigrate';
import useMigrateWithPermit from '../hooks/useMigrateWithPermit';
import { useUniPosContract } from '../hooks/useContract';
import useUniPair from '../hooks/useUniPair';

const TokenInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  width: 100%;
  flex: 2;
`;

const Error = styled.div`
  color: red;
`;

const BottomContainer = styled.div`
  flex: 1;
`;

const ButtonContainer = styled.div`
  flex-direction: column;
  display: flex;
`;

const CheckBoxContainer = styled.div`
  flex-direction: row;
  display: flex;
`;

const TokenInput = styled(Input)`
  width: 380px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  height: 50vh;
  width: 55vw;
`;

function UniswapMigrate({ signer, userAddress }) {
  const [uniswapBalance, setUniswapBalance] = useState();
  const [tokenA, setTokenA] = useState();
  const [tokenB, setTokenB] = useState();
  const [amountToMigrate, setAmountToMigrate] = useState(0);
  const [signatureSelected, setSignatureSelected] = useState(false);
  const [error, setError] = useState();

  const { pair } = useUniPair(tokenA, tokenB, signer, setError);
  const pairContract = useUniPosContract(pair?.liquidityToken.address, signer?.provider);

  const updateBalance = async () => {
    const balance = await pairContract.balanceOf(userAddress);
    setUniswapBalance(balance);
  };

  useEffect(async () => {
    if (!pairContract) return;
    await updateBalance();
  }, [pairContract]);

  return (
    <Container>
      {!signer && <h1>Connect Wallet First</h1>}
      {signer && signer.provider?._network?.chainId !== 42 && <h1>Switch Network to Kovan</h1>}
      {signer && signer.provider?._network?.chainId === 42 && (
        <>
          <TokenInputContainer>
            <TokenInput
              placeholder="token 1"
              onChange={(_, { value }) => {
                setTokenA(value);
              }}
              inverted
            />
            <TokenInput
              placeholder="token 2"
              onChange={(_, { value }) => {
                setTokenB(value);
              }}
              inverted
            />
          </TokenInputContainer>
          {uniswapBalance && !error?.includes(':') && (
            <>
              <BottomContainer>
                <Input
                  inverted
                  value={ethers.utils.formatUnits(amountToMigrate, 18)}
                  onChange={(_, { value }) => {
                    if (value !== '' && !Number.isNaN(+value) && ethers.utils.parseUnits(value, 18).lte(uniswapBalance)) {
                      setAmountToMigrate(ethers.utils.parseUnits(value, 18));
                    }
                  }}
                  action={
                    {
                      inverted: true,
                      content: `Total Balance: ${ethers.utils.formatUnits(uniswapBalance, 18) || ''}`,
                      onClick: () => {
                        setAmountToMigrate(uniswapBalance);
                      },
                    }
                  }
                />
              </BottomContainer>
              <ButtonContainer>
                <CheckBoxContainer>
                  <Checkbox onChange={() => {
                    setSignatureSelected(!signatureSelected);
                  }}
                  />
                  <div>Use signature</div>
                </CheckBoxContainer>
                <MigrateWithApproval
                  signer={signer}
                  pair={pair}
                  amountToMigrate={amountToMigrate}
                  useMigrate={signatureSelected ? useMigrateWithPermit : useMigrate}
                  updateBalance={updateBalance}
                  setError={setError}
                  userAddress={userAddress}
                  signatureSelected={signatureSelected}
                />
              </ButtonContainer>
            </>
          )}
          <Error>{error}</Error>
        </>
      )}
    </Container>
  );
}

export default UniswapMigrate;
