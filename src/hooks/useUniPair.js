import { Fetcher } from '@uniswap/sdk';
import { useEffect, useState } from 'react';

const useUniPair = (tokenA, tokenB, signer, setError, chainId) => {
  const [pair, setPair] = useState();

  useEffect(async () => {
    if (!(tokenA && tokenB)) return;
    let tokenAData;
    let tokenBData;
    let uniPair;
    try {
      tokenAData = await Fetcher.fetchTokenData(chainId, tokenA);
    } catch (err) {
      setError('Token A: Invalid Token Address');
      return;
    }
    try {
      tokenBData = await Fetcher.fetchTokenData(chainId, tokenB);
    } catch (err) {
      setError('Token B: Invalid Token Address');
      return;
    }
    try {
      uniPair = await Fetcher.fetchPairData(tokenAData, tokenBData, signer);
    } catch (err) {
      setError('Pair: not found on Uniswap');
      return;
    }
    setPair(uniPair);
    setError(undefined);
  }, [tokenA, tokenB, signer, chainId]);

  return { pair };
};

export default useUniPair;
