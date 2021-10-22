import { BigNumber } from 'ethers';
import React, { useState } from 'react';
import AmountToMigrateInput from './AmountToMigrateInput';
import MigrateOptions from './MigrateOptions';

function MigrateSection({
  uniswapBalance, pair, updateBalance, disabled,
}) {
  const [amountToMigrateParsed, setAmountToMigrateParsed] = useState(BigNumber.from(0));
  const [balanceError, setBalanceError] = useState('');

  return (
    <>
      <AmountToMigrateInput
        setAmountToMigrateParsed={setAmountToMigrateParsed}
        setBalanceError={setBalanceError}
        balanceError={balanceError}
        uniswapBalance={uniswapBalance}
        pair={pair}
        disabled={disabled}
      />
      <MigrateOptions
        amountToMigrate={amountToMigrateParsed}
        pair={pair}
        updateBalance={updateBalance}
        disabled={disabled || !!balanceError}
      />
    </>
  );
}

export default MigrateSection;
