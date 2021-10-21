import React, { useState } from 'react';
import AmountToMigrateInput from './AmountToMigrateInput';
import MigrateOptions from './MigrateOptions';

function MigrateSection({ uniswapBalance, pair, updateBalance }) {
  const [amountToMigrateParsed, setAmountToMigrateParsed] = useState(0);
  const [balanceError, setBalanceError] = useState();

  return (
    <>
      <AmountToMigrateInput
        setAmountToMigrateParsed={setAmountToMigrateParsed}
        setBalanceError={setBalanceError}
        balanceError={balanceError}
        uniswapBalance={uniswapBalance}
        pair={pair}
      />
      {!balanceError
          && (
          <MigrateOptions
            amountToMigrate={amountToMigrateParsed}
            pair={pair}
            updateBalance={updateBalance}
          />
          )}
    </>
  );
}

export default MigrateSection;
