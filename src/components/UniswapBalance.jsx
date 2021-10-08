import React, { useEffect, useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { ChainId, Token, Fetcher } from '@uniswap/sdk';
import { ethers } from 'ethers';
import UniPosABI from '../UniPosABI';

const TokenInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
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

function UniswapBalance({ provider }) {
  const [uniswapBalance, setUniswapBalance] = useState();
  const [token1, setToken1] = useState();
  const [token2, setToken2] = useState();
  const [error, setError] = useState();
  const [LPAmount, setLPAmount] = useState();

  useEffect(async () => {
    if (!(token1 && token2)) {
      return;
    }
    try {
      const pair = await Fetcher.fetchPairData(
        new Token(ChainId.MAINNET, token1, 18),
        new Token(ChainId.MAINNET, token2, 18),
        provider,
      );
      const pairContract = new ethers.Contract(pair.liquidityToken.address, UniPosABI, provider);
      const balance = await pairContract.balanceOf('0xD605B974117fb59Ad3159CBa16DF7D57E5B3Fe5f');
      if (balance) {
        setError(undefined);
      }
      setUniswapBalance(balance);
    } catch (err) {
      console.log(err);
    }
  }, [token1, token2]);

  return (
    <Container>
      {provider ? (
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
          <div style={{
            height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center',
          }}
          >
            {uniswapBalance && (
            <>
              <Input
                inverted
                value={LPAmount}
                onChange={(_, { value }) => {
                  setLPAmount(value);
                }}
                action={
                  {
                    inverted: true,
                    content: `Total Balance: ${uniswapBalance || ''}`,
                    onClick: () => {
                      setLPAmount(uniswapBalance);
                    },
                  }
                }
              />
              <Button inverted>Migrate</Button>
            </>
            )}
          </div>
          {error && <div>{error}</div>}
        </>
      ) : <h1>Connect Wallet First</h1>}
    </Container>
  );
}

export default UniswapBalance;
