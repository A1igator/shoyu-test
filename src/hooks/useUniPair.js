import { Fetcher } from '@uniswap/sdk';
import { useEffect, useState } from 'react';
import useSignerContext from './useSignerContext';
import useToken from './useToken';

const useUniPair = (tokenA, tokenB, setError) => {
  const [pair, setPair] = useState();
  const { signer } = useSignerContext();

  const { tokenData: tokenAData } = useToken(tokenA, setError);
  const { tokenData: tokenBData } = useToken(tokenB, setError);

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
