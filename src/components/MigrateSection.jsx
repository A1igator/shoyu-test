import React, { useState } from 'react';
import styled from 'styled-components';
import AmountToMigrateInput from './AmountToMigrateInput';
import Migrate from './Migrate';

const MigratePlaceHolder = styled.div`
  height: 60px;
`;

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
        ? (
          <Migrate
            amountToMigrate={amountToMigrateParsed}
            pair={pair}
            updateBalance={updateBalance}
          />
        ) : <MigratePlaceHolder />}
    </>
  );
}

export default MigrateSection;
