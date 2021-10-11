import { Fetcher } from '@uniswap/sdk';
import { useEffect, useState } from 'react';

const useUniPair = (tokenA, tokenB, signer) => {
  const [pair, setPair] = useState();

  useEffect(async () => {
    if (!(tokenA && tokenB)) return;
    const tokenAData = await Fetcher.fetchTokenData(signer.provider?._network?.chainId, tokenA);
    const tokenBData = await Fetcher.fetchTokenData(signer.provider?._network?.chainId, tokenB);
    const uniPair = await Fetcher.fetchPairData(tokenAData, tokenBData, signer);
    setPair(uniPair);
  }, [tokenA, tokenB]);

  return { pair };
};

export default useUniPair;
