import { Fetcher } from '@uniswap/sdk';
import { useEffect, useState } from 'react';
import useToken from './useToken';

const useUniPair = (tokenA, tokenB, signer, setError, chainId) => {
  const [pair, setPair] = useState();

  const { tokenData: tokenAData } = useToken(tokenA, signer, setError, chainId);
  const { tokenData: tokenBData } = useToken(tokenB, signer, setError, chainId);

  useEffect(() => {
    if (!(tokenAData && tokenBData)) return;
    Fetcher.fetchPairData(tokenAData, tokenBData, signer)
      .then((uniPair) => {
        setPair(uniPair);
        setError(undefined);
      }).catch(() => {
        setError('Pair: not found on Uniswap');
      });
  }, [tokenAData, tokenBData, signer, setError]);

  return { pair };
};

export default useUniPair;
