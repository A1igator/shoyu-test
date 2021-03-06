import React from 'react';
import { Button } from 'semantic-ui-react';
import CenterContainer from './CenterContainer';
import Error from './Error';

function MigrateButton({
  pair,
  amountToMigrate,
  updateBalance,
  useMigrate,
  signatureSelected,
  disabled,
}) {
  const {
    loading,
    approval,
    error,
    onMigrateClick,
    onApproveClick,
  } = useMigrate(
    pair,
    amountToMigrate,
    updateBalance,
    signatureSelected,
  );

  return (
    <>
      <CenterContainer>
        <Button
          loading={loading}
          onClick={approval ? onMigrateClick : onApproveClick}
          inverted
          size="large"
          disabled={disabled || loading || amountToMigrate.eq(0)}
        >
          {approval ? 'Migrate' : 'Approve'}
        </Button>
      </CenterContainer>
      <Error>{error}</Error>
    </>
  );
}

export default MigrateButton;
