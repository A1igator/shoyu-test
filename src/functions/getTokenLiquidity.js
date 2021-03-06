import { Percent, TokenAmount } from '@uniswap/sdk';
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
    const slippage = new Percent(995, 1000);
    return tokenLiquidity.multiply(slippage).toFixed(tokenAmount.currency.decimals);
  });
};

export default memoize(getTokenLiqudity);
