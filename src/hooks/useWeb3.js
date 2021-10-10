import { useMemo } from 'react';

function useWeb3(provider) {
  return useMemo(async () => {
    if (!provider) {
      return { signer: undefined, address: undefined };
    }
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return { signer, address };
  }, [provider]);
}

export default useWeb3;
