import { useContext } from 'react';
import { SignerContext } from '../components/SignerContextProvider';

const useSignerContext = () => {
  const { signer, chainId, userAddress } = useContext(SignerContext);

  return { signer, chainId, userAddress };
};

export default useSignerContext;
