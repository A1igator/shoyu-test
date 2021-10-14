import React from 'react';
import { Button } from 'semantic-ui-react';

function MigrateWithApproval({
  pair,
  amountToMigrate,
  updateBalance,
  useMigrate,
  setError,
  signatureSelected,
}) {
  const {
    loading,
    approval,
    onMigrateClick,
    onApproveClick,
  } = useMigrate(
    pair,
    amountToMigrate,
    updateBalance,
    setError,
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
