import { useEffect, useState } from 'react';
import { signERC2612Permit } from 'eth-permit';
import { ethers } from 'ethers';
import getTokenLiqudity from '../functions/getTokenLiquidity';
import { useSushiRollContract, useUniPosContract } from './useContract';

const useMigrateWithPermit = (
  signer,
  pair,
  amountToMigrate,
  updateBalance,
  setError,
  userAddress,
  signatureSelected,
) => {
  const { liquidityToken, tokenAmounts } = pair;

  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState();

  const pairContract = useUniPosContract(liquidityToken.address, signer);
  const sushiRollContract = useSushiRollContract(signer);

  useEffect(async () => {
    setApproval(false);
  }, [signatureSelected, amountToMigrate, pairContract, pair, userAddress]);

  const onMigrateClick = async () => {
    let migrateTx;
    const totalSupply = await pairContract.totalSupply();
    const [tokenALiquidity, tokenBLiquidity] = getTokenLiqudity(
      totalSupply,
      amountToMigrate,
      pair,
    );
    try {
      migrateTx = await sushiRollContract.migrateWithPermit(
        tokenAmounts[0].currency.address,
        tokenAmounts[1].currency.address,
        amountToMigrate,
        ethers.utils.parseUnits(tokenALiquidity, tokenAmounts[0].currency.decimals),
        ethers.utils.parseUnits(tokenBLiquidity, tokenAmounts[1].currency.decimals),
        approval.deadline,
        approval.v,
        approval.r,
        approval.s,
      );
    } catch (err) {
      setError('Could not perform migrate transaction');
    }
    setLoading(true);
    if (migrateTx) {
      await migrateTx.wait();
      updateBalance();
      setApproval(false);
      setError(undefined);
    }
    setLoading(false);
  };

  const onApproveClick = async () => {
    let signResult;
    setLoading(true);
    // 10 Minutes from now
    const deadline = Math.round(Date.now() / 1000 + 10 * 60).toString();
    try {
      signResult = await signERC2612Permit(
        window.ethereum,
        liquidityToken.address,
        userAddress,
        sushiRollContract.address,
        amountToMigrate.toString(),
        deadline,
      );
    } catch (err) {
      setError('Could not approve token to migrate');
    }
    if (signResult) {
      const { v, r, s } = signResult;
      setApproval({
        v,
        r,
        s,
        deadline,
      });
      setError(undefined);
    }
    setLoading(false);
  };

  return {
    loading, approval, onMigrateClick, onApproveClick,
  };
};

export default useMigrateWithPermit;
