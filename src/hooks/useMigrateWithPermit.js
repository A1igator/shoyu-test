import { useState } from 'react';
import { signERC2612Permit } from 'eth-permit';
import { ethers } from 'ethers';
import getTokenLiqudity from '../functions/getTokenLiquidity';
import { useSushiRollContract, useUniPosContract } from './useContract';

const useMigrateWithPermit = (signer, pair, amountToMigrate, updateBalance) => {
  const { liquidityToken, tokenAmounts } = pair;

  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState();

  const pairContract = useUniPosContract(liquidityToken.address, signer);
  const sushiRollContract = useSushiRollContract(signer);

  const onMigrateClick = async () => {
    const totalSupply = await pairContract.totalSupply();
    const [token1Amounts, token2Amounts] = getTokenLiqudity(
      [tokenAmounts[0].currency.address, tokenAmounts[1].currency.address],
      totalSupply,
      amountToMigrate,
      pair,
    );
    const migrateTx = await sushiRollContract.migrateWithPermit(
      tokenAmounts[0].currency.address,
      tokenAmounts[1].currency.address,
      amountToMigrate,
      ethers.utils.parseUnits(token1Amounts, 18).toString(),
      ethers.utils.parseUnits(token2Amounts, 18).toString(),
      approval.deadline,
      approval.v,
      approval.r,
      approval.s,
    );
    setLoading(true);
    await migrateTx.wait();
    updateBalance();
    setApproval(false);
    setLoading(false);
  };

  const onApproveClick = async () => {
    setLoading(true);
    const deadline = Math.round(Date.now() / 1000 + 10 * 60).toString();
    const { v, r, s } = await signERC2612Permit(
      window.ethereum,
      liquidityToken.address,
      await signer.getAddress(),
      '0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5',
      amountToMigrate.toString(),
      deadline,
    );
    setApproval({
      v,
      r,
      s,
      deadline,
    });
    setLoading(false);
  };

  return {
    loading, approval, onMigrateClick, onApproveClick,
  };
};

export default useMigrateWithPermit;
