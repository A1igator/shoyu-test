import React, { useEffect, useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import {
  ChainId, Token, Fetcher, TokenAmount,
} from '@uniswap/sdk';
import { ethers } from 'ethers';
import UniPosABI from '../UniPosABI';
import SushiRollABI from '../SushiRollABI';

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

function UniswapBalance({ provider, address }) {
  const [uniswapBalance, setUniswapBalance] = useState();
  const [pair, setPair] = useState();
  const [token1, setToken1] = useState();
  const [token2, setToken2] = useState();
  const [error, setError] = useState();
  const [LPAmount, setLPAmount] = useState(0);

  useEffect(async () => {
    if (!(token1 && token2)) {
      return;
    }
    try {
      const uniPair = await Fetcher.fetchPairData(
        new Token(ChainId.KOVAN, token1, 18),
        new Token(ChainId.KOVAN, token2, 18),
        provider,
      );
      setPair(uniPair);
      const pairContract = new ethers.Contract(uniPair.liquidityToken.address, UniPosABI, provider);
      const balance = await pairContract.balanceOf(address);
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
              <Button
                onClick={async () => {
                  console.log(pair);
                  const pairContract = new ethers.Contract(
                    pair.liquidityToken.address,
                    UniPosABI,
                    provider.getSigner(),
                  );
                  const totalSupply = await pairContract.totalSupply();
                  const totalSupplyToken = new TokenAmount(new Token(
                    pair.liquidityToken.chainId,
                    pair.liquidityToken.address,
                    pair.liquidityToken.decimals,
                  ), totalSupply);
                  const liquidityToken = new TokenAmount(new Token(
                    pair.liquidityToken.chainId,
                    pair.liquidityToken.address,
                    pair.liquidityToken.decimals,
                  ), LPAmount);
                  const token1Amounts = pair.getLiquidityValue(new Token(
                    pair.liquidityToken.chainId,
                    token1,
                    pair.liquidityToken.decimals,
                  ), totalSupplyToken, liquidityToken);
                  const token2Amounts = pair.getLiquidityValue(new Token(
                    pair.liquidityToken.chainId,
                    token2,
                    pair.liquidityToken.decimals,
                  ), totalSupplyToken, liquidityToken);
                  console.log(token1Amounts.numerator / token1Amounts.denominator);
                  console.log(token2Amounts.numerator / token2Amounts.denominator);
                  const sushiRollContract = new ethers.Contract('0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5', SushiRollABI, provider.getSigner());
                  try {
                    const approveResults = await pairContract.approve('0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5', LPAmount);
                    console.log(approveResults);
                    console.log(
                      token1,
                      token2,
                      LPAmount.toString(),
                      ethers.utils.parseUnits(
                        (token2Amounts.numerator / token2Amounts.denominator).toString(), 18,
                      ).sub(100).toString(),
                      ethers.utils.parseUnits(
                        (token1Amounts.numerator / token1Amounts.denominator).toString(), 18,
                      ).sub(100).toString(),
                      ethers.BigNumber.from(
                        Math.round(Date.now() / 1000 + 10 * 60).toString(),
                      ).toString(),
                    );
                    const result = await sushiRollContract.migrate(
                      token1,
                      token2,
                      LPAmount,
                      ethers.utils.parseUnits(
                        (token1Amounts.numerator / token1Amounts.denominator).toString(), 18,
                      ).sub(100),
                      ethers.utils.parseUnits(
                        (token2Amounts.numerator / token2Amounts.denominator).toString(), 18,
                      ).sub(100),
                      Math.round(Date.now() / 1000 + 10 * 60).toString(),
                    );
                    console.log(result);
                  } catch (err) {
                    console.log(err);
                  }
                }}
                inverted
              >
                Migrate
              </Button>
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
