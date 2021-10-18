import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import styled from 'styled-components';
import MigrateButton from './MigrateButton';
import useMigrate from '../hooks/useMigrate';
import useMigrateWithPermit from '../hooks/useMigrateWithPermit';

const CenterContainer = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: center;
`;

const MigrateContainer = styled.div`
  flex-direction: column;
  display: flex;
`;

function Migrate({
  amountToMigrate, pair, updateBalance,
}) {
  const [signatureSelected, setSignatureSelected] = useState(false);

  return (
    <MigrateContainer>
      <CenterContainer>
        <Checkbox onChange={() => {
          setSignatureSelected(!signatureSelected);
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
      />
    </MigrateContainer>
  );
}

export default Migrate;
