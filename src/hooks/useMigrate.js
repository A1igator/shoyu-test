import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import getTokenLiqudity from '../functions/getTokenLiquidity';
import { useSushiRollContract, useUniPosContract } from './useContract';
import useSignerContext from './useSignerContext';

const useMigrate = (
  pair,
  amountToMigrate,
  updateBalance,
  signatureSelected,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [approval, setApproval] = useState();

  const { liquidityToken, tokenAmounts } = pair;
  const { userAddress } = useSignerContext();

  const pairContract = useUniPosContract(liquidityToken.address);
  const sushiRollContract = useSushiRollContract();

  const checkAllowance = useCallback(async () => {
    // reset timeout from useMigrateWithPermit.
    const id = approval?.id;
    if (id) {
      clearTimeout(id);
    }

    const approvedAmount = await pairContract.allowance(userAddress, sushiRollContract.address);
    if (!approvedAmount.eq(0) && approvedAmount.gte(amountToMigrate)) {
      setApproval(true);
    } else {
      setApproval(false);
    }
  }, [signatureSelected, amountToMigrate, pairContract, userAddress, sushiRollContract]);

  useEffect(() => {
    checkAllowance();
  }, [checkAllowance]);

  const onMigrateClick = async () => {
    let migrateTx;
    const totalSupply = await pairContract.totalSupply();
    const [tokenALiquidity, tokenBLiquidity] = getTokenLiqudity(
      totalSupply,
      amountToMigrate,
      pair,
    );
    try {
      migrateTx = await sushiRollContract.migrate(
        tokenAmounts[0].currency.address,
        tokenAmounts[1].currency.address,
        amountToMigrate,
        ethers.utils.parseUnits(tokenALiquidity, tokenAmounts[0].currency.decimals),
        ethers.utils.parseUnits(tokenBLiquidity, tokenAmounts[1].currency.decimals),
        Math.round(Date.now() / 1000 + 10 * 60).toString(),
      );
    } catch (err) {
      setError('Could not perform migrate transaction');
    }
    if (!migrateTx) return;
    setLoading(true);
    await migrateTx.wait();
    updateBalance();
    setApproval(false);
    setError(undefined);
    setLoading(false);
  };

  const onApproveClick = async () => {
    let approveTx;
    try {
      approveTx = await pairContract.approve(sushiRollContract.address, amountToMigrate);
    } catch (err) {
      setError('Could not approve token to migrate');
    }
    if (!approveTx) return;
    setLoading(true);
    await approveTx.wait();
    setApproval(true);
    setError(undefined);
    setLoading(false);
  };

  return {
    loading, error, approval, onMigrateClick, onApproveClick,
  };
};

export default useMigrate;
