export interface ISettings {
  BACKEND_URL: string;
  FRONTEND_URL: string;
  INITIAL_TOKEN_AMOUNT: number;
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  MONGO_SERVER: string;
  MAILER_API_URL: string;
  MAIL_HOST: string;
  MAIL_POLLED: boolean;
  MAIL_PORT: string;
  MAIL_SECURED: boolean;
  MAIL_USERNAME: string;
  TOKEN: string;
  SECRET: string;
  SESSION_RELOAD_INTERVAL: number;
  MAX_IMAGE_SIZE: number;
  MAX_AVATAR_SIZE: number;
  INACTIVITY_TIMEOUT: number;
  EXPIRATION_REQUEST_TIME: number;
  INTERACTION_TOKEN_INIT_COUNT: number;
  INTERACTION_MINUTE_COST: number;
  PLATFORM_FEE: number;
  MIN_PLATFORM_FIXED_FEE_AMOUNT: number;
  PLATFORM_FIXED_FEE: number;
  FREE_OF_FEE_AMOUNT: number;
  FREE_MESSAGES_LIMIT: number;
  ADMIN_EMAIL: string;
  STRIPE_SK: string;
  WEBHOOK_PK: string;
  PRICE_100: string;
  REF_TOKEN_REWARD_AMOUNT: number;
  CHAIN_ID: number;
  RPC_PROVIDER: string;
  H2H_TOKEN_ADDRESS: string;
  H2H_TOKEN_ADMIN_PRIVATE_KEY: string;
  H2H_TOKEN_STARTING_AMOUNT: number;
  H2H_TOKEN_ADMIN_WALLET_ADDRESS: string;
  OUTDATED_TOKENS_DAYS: number;
}
