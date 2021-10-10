import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import {
  Token, TokenAmount,
} from '@uniswap/sdk';
import { ethers } from 'ethers';
import SushiRollABI from '../SushiRollABI';

function MigrateWithApproval({
  signer, pair, LPAmount, token1, token2, pairContract, updateBalance,
}) {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const { liquidityToken: { chainId, decimals, address } } = pair;

  const getLiqiduityTokenAmount = (supply) => new TokenAmount(new Token(
    chainId,
    address,
    decimals,
  ), supply);

  const getTokenAmounts = (
    tokenAddresses,
    totalSupply,
  ) => tokenAddresses.map((tokenAddress) => {
    const tokenAmounts = pair.getLiquidityValue(
      new Token(
        chainId,
        tokenAddress,
        decimals,
      ),
      getLiqiduityTokenAmount(totalSupply),
      getLiqiduityTokenAmount(LPAmount),
    );
    return (tokenAmounts.numerator / tokenAmounts.denominator).toString();
  });

  const onMigrateClick = async () => {
    const totalSupply = await pairContract.totalSupply();
    const [token1Amounts, token2Amounts] = getTokenAmounts([token1, token2], totalSupply);
    const sushiRollContract = new ethers.Contract('0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5', SushiRollABI, signer);
    const migrateTx = await sushiRollContract.migrate(
      token1,
      token2,
      LPAmount,
      ethers.utils.parseUnits(token1Amounts, 18).sub(1000),
      ethers.utils.parseUnits(token2Amounts, 18).sub(1000),
      Math.round(Date.now() / 1000 + 10 * 60).toString(),
    );
    setLoading(true);
    await migrateTx.wait();
    updateBalance(pairContract);
    setLoading(false);
    setApproved(false);
  };

  const onApproveClick = async () => {
    const approveTx = await pairContract.approve('0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5', LPAmount);
    setLoading(true);
    await approveTx.wait();
    setLoading(false);
    setApproved(true);
  };

  return (
    approved ? (
      <Button
        loading={loading}
        onClick={onMigrateClick}
        inverted
      >
        Migrate
      </Button>
    ) : (
      <Button
        loading={loading}
        onClick={onApproveClick}
        inverted
      >
        Approve
      </Button>
    )
  );
}

export default MigrateWithApproval;
