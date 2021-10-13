import { Fetcher } from '@uniswap/sdk';
import { useEffect, useState } from 'react';

const useToken = (token, signer, setError, chainId) => {
  const [tokenData, setTokenData] = useState();

  useEffect(() => {
    if (!token) return;
    Fetcher.fetchTokenData(chainId, token, signer)
      .then((tokenInfo) => {
        setTokenData(tokenInfo);
        setError(undefined);
      })
      .catch(() => {
        setError('Token A: Invalid Token Address');
      });
  }, [token, chainId, signer, setError]);

  return { tokenData };
};

export default useToken;
