import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';
import MigrateButton from './MigrateButton';
import useMigrate from '../hooks/useMigrate';
import useMigrateWithPermit from '../hooks/useMigrateWithPermit';
import CenterContainer from './CenterContainer';

const MigrateContainer = styled.div`
  flex-direction: column;
  display: flex;
`;

function MigrateOptions({
  amountToMigrate, pair, updateBalance, disabled,
}) {
  const [signatureSelected, setSignatureSelected] = useState(false);

  return (
    <MigrateContainer>
      <CenterContainer>
        <Checkbox
          onChange={(_, { checked }) => {
            setSignatureSelected(checked);
          }}
        />
        <div>Use signature</div>
      </CenterContainer>
      <MigrateButton
        pair={pair}
        amountToMigrate={amountToMigrate}
        useMigrate={signatureSelected ? useMigrateWithPermit : useMigrate}
        updateBalance={updateBalance}
        signatureSelected={signatureSelected}
        disabled={disabled}
      />
    </MigrateContainer>
  );
}

export default MigrateOptions;
