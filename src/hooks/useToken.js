import { Fetcher } from '@uniswap/sdk';
import { useEffect, useState } from 'react';
import useSignerContext from './useSignerContext';

const useToken = (token, setError, name) => {
  const [tokenData, setTokenData] = useState();

  const { signer, chainId } = useSignerContext();

  useEffect(() => {
    if (!token) {
      setTokenData(undefined);
      setError(undefined);
      return;
    }
    Fetcher.fetchTokenData(chainId, token)
      .then((tokenInfo) => {
        setTokenData(tokenInfo);
        setError(undefined);
      })
      .catch(() => {
        setError(`Token ${name} address is invalid`);
      });
  }, [token, chainId, signer, setError]);

  return { tokenData };
};

export default useToken;
