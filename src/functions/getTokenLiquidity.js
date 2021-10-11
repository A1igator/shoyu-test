import { Token, TokenAmount } from '@uniswap/sdk';
import memoize from 'memoizee';

const getTokenLiqudity = (
  tokenAddresses,
  totalSupply,
  amountToMigrate,
  pair,
) => tokenAddresses.map((tokenAddress) => {
  const { liquidityToken } = pair;
  const tokenLiquidity = pair.getLiquidityValue(
    new Token(
      liquidityToken.chainId,
      tokenAddress,
      liquidityToken.decimals,
    ),
    new TokenAmount(new Token(
      liquidityToken.chainId,
      liquidityToken.address,
      liquidityToken.decimals,
    ), totalSupply),
    new TokenAmount(new Token(
      liquidityToken.chainId,
      liquidityToken.address,
      liquidityToken.decimals,
    ), amountToMigrate),
  );
  return ((tokenLiquidity.numerator / tokenLiquidity.denominator) * 0.995).toFixed(18);
});

export default memoize(getTokenLiqudity);
