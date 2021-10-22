import { Fetcher } from '@uniswap/sdk';
import { useEffect, useState } from 'react';
import useSignerContext from './useSignerContext';

const useToken = (token, name) => {
  const [tokenData, setTokenData] = useState();
  const [error, setError] = useState('');

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
        setTokenData(undefined);
        setError(`Token ${name} address is invalid`);
      });
  }, [token, chainId, signer]);

  return { tokenData, error };
};

export default useToken;
