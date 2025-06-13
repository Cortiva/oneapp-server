import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const {
  APP_NAME,
  PORT,
  JWT_SECRET,
  NODE_ENV,
  EMAIL_FROM,
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_USER,
  SMTP_PASS,
  WEBSITE,
  CONTACT_US,
  PRIVACY,
  LOGO_URL,
  ADD_SLOT,
  REFERRAL_MIN_COIN,
  LOGTAIL_TOKEN,
  LOGTAIL_INGESTING_HOST,
} = process.env;

export default {
  APP_NAME,
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  EMAIL_FROM,
  smtp: {
    host: SMTP_HOST,
    port: SMTP_PORT as number,
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  WEBSITE,
  CONTACT_US,
  PRIVACY,
  LOGO_URL,
  ADD_SLOT,
  REFERRAL_MIN_COIN,
  LOGTAIL_TOKEN,
  LOGTAIL_INGESTING_HOST,
};
