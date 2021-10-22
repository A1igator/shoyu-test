import { Fetcher } from '@uniswap/sdk';
import { useEffect, useState } from 'react';
import useSignerContext from './useSignerContext';
import useToken from './useToken';

const useUniPair = (tokenA, tokenB) => {
  const [pair, setPair] = useState();
  const [error, setError] = useState('');

  const { signer } = useSignerContext();
  const { tokenData: tokenAData, error: tokenAError } = useToken(tokenA, 'A');
  const { tokenData: tokenBData, error: tokenBError } = useToken(tokenB, 'B');
  const tokenError = tokenAError || tokenBError;

  useEffect(() => {
    if (!(tokenAData && tokenBData)) {
      setPair(undefined);
      setError(undefined);
      return;
    }
    Fetcher.fetchPairData(tokenAData, tokenBData, signer)
      .then((uniPair) => {
        setPair(uniPair);
        setError(undefined);
      }).catch(() => {
        setPair(undefined);
        setError('Pair not found on Uniswap');
      });
  }, [tokenAData, tokenBData, signer]);

  return { pair, error, tokenError };
};

export default useUniPair;
