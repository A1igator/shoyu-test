import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Input } from 'semantic-ui-react';
import styled from 'styled-components';
import Error from './Error';

const AmountToMigrateContainer = styled.div`
  flex: 1;
`;

function AmountToMigrateInput({
  setAmountToMigrateParsed, setBalanceError, balanceError, uniswapBalance, pair, disabled,
}) {
  const [amountToMigrate, setAmountToMigrate] = useState(0);

  useEffect(() => {
    setAmountToMigrate(0);
    setAmountToMigrateParsed(BigNumber.from(0));
    setBalanceError(undefined);
  }, [pair, uniswapBalance, disabled]);

  const onInputChange = (_, { value }) => {
    let valueParsed;
    // Ensure input works
    try {
      valueParsed = ethers.utils.parseUnits(value || '0', 18);
    } catch (err) {
      return;
    }

    setAmountToMigrate(value);
    setAmountToMigrateParsed(valueParsed);
    if (valueParsed.gt(uniswapBalance)) {
      setBalanceError('Not enough balance');
    } else {
      setBalanceError(undefined);
    }
  };

  const onMaxClick = () => {
    setAmountToMigrate(ethers.utils.formatUnits(uniswapBalance, 18));
    setAmountToMigrateParsed(uniswapBalance);
    setBalanceError(undefined);
  };

  return (
    <AmountToMigrateContainer balanceError={balanceError}>
      <Input
        inverted
        value={amountToMigrate}
        onChange={onInputChange}
        disabled={disabled}
        action={{
          inverted: true,
          content: `Total Balance: ${ethers.utils.formatUnits(uniswapBalance, 18)}`,
          onClick: onMaxClick,
          disabled,
        }}
      />
      <Error>{balanceError}</Error>
    </AmountToMigrateContainer>
  );
}

export default AmountToMigrateInput;
