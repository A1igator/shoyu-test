import { TokenAmount } from '@uniswap/sdk';
import memoize from 'memoizee';

const getTokenLiqudity = (
  totalSupply,
  amountToMigrate,
  pair,
) => {
  const { liquidityToken, tokenAmounts } = pair;
  const tokenAddresses = [tokenAmounts[0], tokenAmounts[1]];
  return tokenAddresses.map((tokenAmount) => {
    const tokenLiquidity = pair.getLiquidityValue(
      tokenAmount.currency,
      new TokenAmount(liquidityToken, totalSupply),
      new TokenAmount(liquidityToken, amountToMigrate),
    );
    return ((tokenLiquidity.numerator / tokenLiquidity.denominator) * 0.995).toFixed(18);
  });
};

export default memoize(getTokenLiqudity);
