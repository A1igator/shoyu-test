import {
  useCallback, useEffect, useState,
} from 'react';
import { signERC2612Permit } from 'eth-permit';
import { ethers } from 'ethers';
import getTokenLiqudity from '../functions/getTokenLiquidity';
import { useSushiRollContract, useUniPosContract } from './useContract';
import useSignerContext from './useSignerContext';

const useMigrateWithPermit = (
  pair,
  amountToMigrate,
  updateBalance,
  setError,
  signatureSelected,
) => {
  const { liquidityToken, tokenAmounts } = pair;

  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState();

  const { signer, userAddress } = useSignerContext();
  const pairContract = useUniPosContract(liquidityToken.address);
  const sushiRollContract = useSushiRollContract();

  const resetApproval = useCallback(async () => {
    setApproval(false);
  }, [signatureSelected, amountToMigrate, pairContract, userAddress, sushiRollContract]);

  useEffect(() => {
    resetApproval();
  }, [resetApproval]);

  const onMigrateClick = async () => {
    const totalSupply = await pairContract.totalSupply();
    const [tokenALiquidity, tokenBLiquidity] = getTokenLiqudity(
      totalSupply,
      amountToMigrate,
      pair,
    );
    let migrateTx;
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
    if (!migrateTx) return;
    setLoading(true);
    await migrateTx.wait();
    updateBalance();
    setApproval(false);
    setError(undefined);
    setLoading(false);
  };

  const onApproveClick = async () => {
    let signResult;
    // 10 Minutes from now
    const deadline = Math.round(Date.now() / 1000 + 10 * 60).toString();
    try {
      signResult = await signERC2612Permit(
        signer.provider,
        liquidityToken.address,
        userAddress,
        sushiRollContract.address,
        amountToMigrate.toString(),
        deadline,
      );
    } catch (err) {
      setError('Could not approve token to migrate');
    }
    if (!signResult) return;
    const id = setTimeout(() => {
      setApproval(false);
    }, deadline * 1000 - Date.now());
    const { v, r, s } = signResult;
    setApproval({
      v,
      r,
      s,
      deadline,
      id,
    });
    setError(undefined);
  };

  return {
    loading, approval, onMigrateClick, onApproveClick,
  };
};

export default useMigrateWithPermit;
