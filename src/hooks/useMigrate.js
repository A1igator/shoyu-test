import { useState } from 'react';
import { ethers } from 'ethers';
import getTokenLiqudity from '../functions/getTokenLiquidity';
import { useSushiRollContract, useUniPosContract } from './useContract';

const useMigrate = (signer, pair, amountToMigrate, updateBalance) => {
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
    const migrateTx = await sushiRollContract.migrate(
      tokenAmounts[0].currency.address,
      tokenAmounts[1].currency.address,
      amountToMigrate,
      ethers.utils.parseUnits(token1Amounts, 18),
      ethers.utils.parseUnits(token2Amounts, 18),
      Math.round(Date.now() / 1000 + 10 * 60).toString(),
    );
    setLoading(true);
    await migrateTx.wait();
    updateBalance();
    setLoading(false);
    setApproval(false);
  };

  const onApproveClick = async () => {
    const approveTx = await pairContract.approve('0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5', amountToMigrate);
    setLoading(true);
    await approveTx.wait();
    setLoading(false);
    setApproval(true);
  };

  return {
    loading, approval, onMigrateClick, onApproveClick,
  };
};

export default useMigrate;
