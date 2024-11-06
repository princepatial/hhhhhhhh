export enum TokenTransactionStatus {
  ERROR = 'ERROR',
  SUCCEDED = 'SUCCEDED',
  TO_TRANSFER_TOKENS = 'TO_TRANSFER_TOKENS',
  TO_TRANSFER_TOKENS_ONCHAIN = 'TO_TRANSFER_TOKENS_ONCHAIN',// should be set after TO_TRANSFER_TOKENS status when off chain tokens are transferred, should collect transaction and transfer onchain tokens
  OPEN = 'OPEN', // transaction in progress when chat is in progress and amount increasing
}

/**
 * Token Transactionn chat lifecycle is: 
 * 1. OPEN - chat was started and transaction amount can be increased
 * 2. TO_TRANSFER_TOKENS - when chat is ended and service should collect transaction and transfer tokens
 * 3. TO_TRANSFER_TOKENS_ONCHAIN - when off chain tokens are transferred, should collect transaction and transfer onchain tokens
 * 4. SUCCEDED - When on chain tokens are transferred or recipient does not have wallet adress - in this case status is succeded but TokenTransaction.tokensTransferredOnchain is false
 */
