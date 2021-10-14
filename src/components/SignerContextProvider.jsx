import React, { useEffect, useState } from 'react';

export const SignerContext = React.createContext();

const SignerContextProvider = ({ children, signer }) => {
  const [userAddress, setUserAddress] = useState('Connect Wallet');
  const [chainId, setChainId] = useState();

  const getAddress = async () => {
    setUserAddress(await signer.getAddress());
  };

  const getChainId = async () => {
    const network = await signer.provider.getNetwork();
    setChainId(network.chainId);
  };

  useEffect(() => {
    if (!signer) return;
    getAddress();
    getChainId();
  }, [signer]);

  return (
    <SignerContext.Provider value={{ signer, userAddress, chainId }}>
      {children}
    </SignerContext.Provider>
  );
};

export default SignerContextProvider;
