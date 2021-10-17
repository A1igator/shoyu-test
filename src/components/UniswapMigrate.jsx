import React, {
  useCallback, useEffect, useState,
} from 'react';
import { Checkbox, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import MigrateWithApproval from './MigrateWithApproval';
import useMigrate from '../hooks/useMigrate';
import useMigrateWithPermit from '../hooks/useMigrateWithPermit';
import { useUniPosContract } from '../hooks/useContract';
import useUniPair from '../hooks/useUniPair';
import useSignerContext from '../hooks/useSignerContext';
import AmountToMigrateInput from './AmountToMigrateInput';
import Error from './Error';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  height: 50vh;
  width: 55vw;
`;

const TokenInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  width: 100%;
  flex: 2;
`;

const TokenInput = styled(Input)`
  width: 380px;
`;

const MigrateButtonPlaceHolder = styled.div`
  height: 56px;
`;

const MigrateButtonContainer = styled.div`
  flex-direction: column;
  display: flex;
`;

const CheckBoxContainer = styled.div`
  flex-direction: row;
  display: flex;
`;

function UniswapMigrate() {
  const [uniswapBalance, setUniswapBalance] = useState();
  const [tokenA, setTokenA] = useState();
  const [tokenB, setTokenB] = useState();
  const [amountToMigrateParsed, setAmountToMigrateParsed] = useState(0);
  const [signatureSelected, setSignatureSelected] = useState(false);
  const [error, setError] = useState();
  const [balanceError, setBalanceError] = useState();

  const { signer, chainId, userAddress } = useSignerContext();
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
      {!signer && <h1>Connect Wallet First</h1>}
      {signer && chainId !== 42 && <h1>Switch Network to Kovan</h1>}
      {signer && chainId === 42 && (
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
            <>
              <AmountToMigrateInput
                setAmountToMigrateParsed={setAmountToMigrateParsed}
                setBalanceError={setBalanceError}
                balanceError={balanceError}
                uniswapBalance={uniswapBalance}
                pair={pair}
              />
              <MigrateButtonContainer>
                {!balanceError ? (
                  <>
                    <CheckBoxContainer>
                      <Checkbox onChange={() => {
                        setSignatureSelected(!signatureSelected);
                      }}
                      />
                      <div>Use signature</div>
                    </CheckBoxContainer>
                    <MigrateWithApproval
                      pair={pair}
                      amountToMigrate={amountToMigrateParsed}
                      useMigrate={signatureSelected ? useMigrateWithPermit : useMigrate}
                      updateBalance={updateBalance}
                      setError={setError}
                      signatureSelected={signatureSelected}
                    />
                  </>
                ) : <MigrateButtonPlaceHolder />}
              </MigrateButtonContainer>
            </>
          )}
          <Error>{error || uniPairError}</Error>
        </>
      )}
    </Container>
  );
}

export default UniswapMigrate;
