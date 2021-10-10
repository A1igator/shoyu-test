import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import { Token, TokenAmount } from '@uniswap/sdk';
import { ethers } from 'ethers';
import { signERC2612Permit } from 'eth-permit';
import SushiRollABI from '../SushiRollABI';
// import useWeb3 from '../hooks/useWeb3';

function MigrateWithPermission({
  signer, pair, LPAmount, token1, token2, pairContract, updateBalance,
}) {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approval, setApproval] = useState();
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
    const migrateTx = await sushiRollContract.migrateWithPermit(
      token1,
      token2,
      LPAmount,
      ethers.utils.parseUnits((token1Amounts * 0.95).toString(), 18).toString(),
      ethers.utils.parseUnits((token2Amounts * 0.95).toString(), 18).toString(),
      approval.deadline,
      approval.v,
      approval.r,
      approval.s,
    );
    setLoading(true);
    await migrateTx.wait();
    updateBalance(pairContract);
    setLoading(false);
    setApproved(false);
  };

  const onApproveClick = async () => {
    setLoading(true);
    const deadline = Math.round(Date.now() / 1000 + 10 * 60).toString();
    const { v, r, s } = await signERC2612Permit(
      window.ethereum,
      address,
      await signer.getAddress(),
      '0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5',
      LPAmount.toString(),
      deadline,
    );
    setApproval({
      v,
      r,
      s,
      deadline,
    });
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

export default MigrateWithPermission;
