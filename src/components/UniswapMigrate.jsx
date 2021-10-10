import React, { useEffect, useState } from 'react';
import { Checkbox, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  ChainId, Token, Fetcher,
} from '@uniswap/sdk';
import { ethers } from 'ethers';
import UniPosABI from '../UniPosABI';
import MigrateWithApproval from './MigrateWithApproval';
import MigrateWithPermission from './MigrateWithPermission';
// import useWeb3 from '../hooks/useWeb3';

const TokenInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  width: 100%;
  flex: 2;
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

function UniswapMigrate({ signer }) {
  const [uniswapBalance, setUniswapBalance] = useState();
  const [pair, setPair] = useState();
  const [pairContract, setPairContract] = useState();
  const [token1, setToken1] = useState();
  const [token2, setToken2] = useState();
  const [LPAmount, setLPAmount] = useState(0);
  const [signatureUsed, setSignatureUsed] = useState(false);

  const updateBalance = async (uniPairContract) => {
    const address = await signer.getAddress();
    const balance = await uniPairContract.balanceOf(address);
    setUniswapBalance(balance);
  };

  useEffect(async () => {
    if (!(token1 && token2)) {
      return;
    }
    const uniPair = await Fetcher.fetchPairData(
      new Token(ChainId.KOVAN, token1, 18),
      new Token(ChainId.KOVAN, token2, 18),
      signer,
    );
    setPair(uniPair);
    const uniPairContract = new ethers.Contract(
      uniPair.liquidityToken.address,
      UniPosABI,
      signer,
    );
    setPairContract(uniPairContract);
    await updateBalance(uniPairContract);
  }, [token1, token2]);

  return (
    <Container>
      {signer ? (
        <>
          <TokenInputContainer>
            <TokenInput
              placeholder="token 1"
              onChange={(_, { value }) => {
                setToken1(value);
              }}
              inverted
            />
            <TokenInput
              placeholder="token 2"
              onChange={(_, { value }) => {
                setToken2(value);
              }}
              inverted
            />
          </TokenInputContainer>
          {uniswapBalance && (
          <>
            <BottomContainer>
              <Input
                inverted
                value={ethers.utils.formatUnits(LPAmount, 18)}
                onChange={(_, { value }) => {
                  if (!Number.isNaN(+value)) {
                    setLPAmount(ethers.utils.parseUnits(value, 18));
                  }
                }}
                action={
                  {
                    inverted: true,
                    content: `Total Balance: ${ethers.utils.formatUnits(uniswapBalance, 18) || ''}`,
                    onClick: () => {
                      setLPAmount(uniswapBalance);
                    },
                  }
                }
              />
            </BottomContainer>
            <BottomContainer>
              <ButtonContainer>
                <CheckBoxContainer>
                  <Checkbox onChange={() => {
                    setSignatureUsed(!signatureUsed);
                  }}
                  />
                  <div>Use signature</div>
                </CheckBoxContainer>
                {signatureUsed ? (
                  <MigrateWithPermission
                    signer={signer}
                    pair={pair}
                    pairContract={pairContract}
                    LPAmount={LPAmount}
                    token1={token1}
                    token2={token2}
                    updateBalance={updateBalance}
                  />
                ) : (
                  <MigrateWithApproval
                    signer={signer}
                    pair={pair}
                    pairContract={pairContract}
                    LPAmount={LPAmount}
                    token1={token1}
                    token2={token2}
                    updateBalance={updateBalance}
                  />
                )}
              </ButtonContainer>
            </BottomContainer>
          </>
          )}
        </>
      ) : <h1>Connect Wallet First</h1>}
    </Container>
  );
}

export default UniswapMigrate;
