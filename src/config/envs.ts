import 'dotenv/config'
import { get } from 'env-var'

export const envs = {
  PORT: get('PORT').required().asPortNumber(),

  MONGO_URL: get('MONGO_URL').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),

  GOOGLE_CLIENT_ID: get('GOOGLE_CLIENT_ID').required().asString(),

  FACEBOOK_APP_ID: get('FACEBOOK_APP_ID').required().asString(),
  FACEBOOK_APP_SECRET: get('FACEBOOK_APP_SECRET').required().asString(),
  FACEBOOK_REDIRECT_UIR: get('FACEBOOK_REDIRECT_UIR').required().asString(),

  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString()
}

