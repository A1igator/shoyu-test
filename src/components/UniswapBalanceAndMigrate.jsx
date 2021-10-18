import React, {
  useCallback, useEffect, useState,
} from 'react';
import { Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { useUniPosContract } from '../hooks/useContract';
import useUniPair from '../hooks/useUniPair';
import useSignerContext from '../hooks/useSignerContext';
import Error from './Error';
import MigrateSection from './MigrateSection';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  height: 50vh;
  width: 55vw;
  @media (max-width: 1400px) {
    height: 30vh;
    width: 100vw;
  }
`;

const TokenInputContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-direction: row;
  width: 100%;
  flex: 2;
`;

const TokenInput = styled(Input)`
  width: 350px;
`;

function UniswapBalanceAndMigrate() {
  const [uniswapBalance, setUniswapBalance] = useState();
  const [tokenA, setTokenA] = useState();
  const [tokenB, setTokenB] = useState();

  const { chainId, userAddress } = useSignerContext();
  const { pair, error: uniPairError } = useUniPair(tokenA, tokenB);
  const pairContract = useUniPosContract(pair?.liquidityToken.address);

  const updateBalance = useCallback(async () => {
    if (!pairContract) return;
    const balance = await pairContract.balanceOf(userAddress);
    setUniswapBalance(balance);
  }, [pairContract, userAddress]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return (
    <Container>
      {chainId !== 42 && <h1>Switch Network to Kovan</h1>}
      {chainId === 42 && (
        <>
          <TokenInputContainer>
            <TokenInput
              placeholder="token A"
              onChange={(_, { value }) => {
                setTokenA(value);
              }}
              inverted
            />
            <TokenInput
              placeholder="token B"
              onChange={(_, { value }) => {
                setTokenB(value);
              }}
              inverted
            />
          </TokenInputContainer>
          {pair && uniswapBalance && !uniPairError && (
          <MigrateSection
            uniswapBalance={uniswapBalance}
            pair={pair}
            updateBalance={updateBalance}
          />
          )}
          <Error>{uniPairError}</Error>
        </>
      )}
    </Container>
  );
}

export default UniswapBalanceAndMigrate;
