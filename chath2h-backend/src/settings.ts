import { ISettings } from './types/interface.Settings';
import { config } from 'dotenv';

config();

export const Settings: ISettings = {
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001', //Backend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000', //Frontend URL
  INITIAL_TOKEN_AMOUNT: Number(process.env.INITIAL_TOKEN_AMOUNT) || 100, //Initial amount of tokens user recieves after registration
  DB_HOST: process.env.DB_HOST || '127.0.0.1', //Database connection string Host
  DB_PORT: process.env.DB_PORT || '27017', //Database connection string Port
  DB_NAME: process.env.DB_NAME || 'H2H', //Database connection string Name
  MONGO_SERVER: process.env.MONGO_SERVER || 'database', //Database Server
  MAILER_API_URL: process.env.MAILER_API_URL || 'http://127.0.1:3002/email', //Mailer API Endpoint
  MAIL_HOST: process.env.MAIL_HOST || 'smtp.gmail.com', //Mailer Host
  MAIL_POLLED: Boolean(process.env.MAIL_POLLED) || true, //Email Polling
  MAIL_PORT: process.env.MAIL_PORT || '465', //Mailer Port
  MAIL_SECURED: Boolean(process.env.MAIL_SECURED) || true, //Mailer Secured
  MAIL_USERNAME: process.env.MAIL_USERNAME || 'mailer@neti-soft.com', //Mailer Username
  TOKEN: process.env.TOKEN || 'DMxdIHIEDOTQQ2aRikFf', //Mailer Token
  SECRET: process.env.SECRET || 'shush', //Secret for Auth Cookie
  SESSION_RELOAD_INTERVAL: Number(process.env.SESSION_RELOAD_INTERVAL) || 30000, // Session reload interval default to 30s
  MAX_IMAGE_SIZE: Number(process.env.MAX_IMAGE_SIZE) || 5242880, //Max image size for offers default 5242880 Bytes (5mb)
  MAX_AVATAR_SIZE: Number(process.env.MAX_AVATAR_SIZE) || 5242880, //Max size of avatar image
  INACTIVITY_TIMEOUT: Number(process.env.INACTIVITY_TIMEOUT) || 600000, //Time after user activity status is changed to Offline default 10 minutes
  EXPIRATION_REQUEST_TIME:
    Number(process.env.EXPIRATION_REQUEST_TIME) || 5 * 60 * 1000,
  INTERACTION_TOKEN_INIT_COUNT:
    Number(process.env.INTERACTION_TOKEN_INIT_COUNT) || 25, //Amount of tokens needed to start chat
  INTERACTION_MINUTE_COST: Number(process.env.INTERACTION_MINUTE_COST) || 1, //Cost for 1 minute of chatting default 1 token
  PLATFORM_FEE: Number(process.env.PLATFORM_FEE) || 20, //Platform fee precentage example 2 = 20% default 20
  FREE_MESSAGES_LIMIT: Number(process.env.FREE_MESSAGES_LIMIT) || 3, //Amount of free messages per conversation default 3
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@coachh2h.com',
  STRIPE_SK: process.env.STRIPE_SK || 'sk_test',
  WEBHOOK_PK: process.env.WEBHOOK_PK || 'pk_test',
  PRICE_100: process.env.PRICE_100 || 'price_',
  MIN_PLATFORM_FIXED_FEE_AMOUNT:
    Number(process.env.MIN_PLATFORM_FIXED_FEE_AMOUNT) || 5, // min amount of tokens where fixed fee is used
  PLATFORM_FIXED_FEE: Number(process.env.PLATFORM_FIXED_FEE) || 1, // platform fixed fee
  FREE_OF_FEE_AMOUNT: Number(process.env.FREE_OF_FEE_AMOUNT) || 1, // amount of tokens where fee is not used
  REF_TOKEN_REWARD_AMOUNT: Number(process.env.REF_TOKEN_REWARD_AMOUNT) || 25,
  CHAIN_ID: Number(process.env.CHAIN_ID) || 80001,
  RPC_PROVIDER: process.env.RPC_PROVIDER || 'https://polygon-mumbai.blockpi.network/v1/rpc/public',
  H2H_TOKEN_ADDRESS: process.env.H2H_TOKEN_ADDRESS || '0x3d26Dc7Cf433F35fC707e13a66f8e48FbC61a367',
  H2H_TOKEN_ADMIN_PRIVATE_KEY: process.env.H2H_TOKEN_ADMIN_PRIVATE_KEY || '',
  H2H_TOKEN_STARTING_AMOUNT: Number(process.env.H2H_TOKEN_STARTING_AMOUNT) || 25000000000000000000,
  H2H_TOKEN_ADMIN_WALLET_ADDRESS: process.env.H2H_TOKEN_ADMIN_WALLET_ADDRESS || '',
  OUTDATED_TOKENS_DAYS: Number(process.env.OUTDATED_TOKENS_DAYS) || 1
};
