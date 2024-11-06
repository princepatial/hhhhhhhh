import { getTokensBalance } from 'queries/tokensQuery/tokens';

export const checkIfUserHasTokens = async (limit = 25, isHigher = true) => {
  const tokens = await getTokensBalance();
  if (isHigher) {
    return tokens >= limit;
  } else {
    return tokens < limit;
  }
};
