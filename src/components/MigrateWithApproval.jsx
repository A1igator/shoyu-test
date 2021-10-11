import React from 'react';
import { Button } from 'semantic-ui-react';

function MigrateWithApproval({
  signer,
  pair,
  amountToMigrate,
  updateBalance,
  useMigrate,
  setError,
  userAddress,
  signatureSelected,
}) {
  const {
    loading,
    approval,
    onMigrateClick,
    onApproveClick,
  } = useMigrate(
    signer,
    pair,
    amountToMigrate,
    updateBalance,
    setError,
    userAddress,
    signatureSelected,
  );

  return (
    <Button
      loading={loading}
      onClick={approval ? onMigrateClick : onApproveClick}
      inverted
    >
      {approval ? 'Migrate' : 'Approve'}
    </Button>
  );
}

export default MigrateWithApproval;
