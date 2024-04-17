import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';
import basicServiceAccount from './service-account.json';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const privateInformation = {
  ...basicServiceAccount,
  project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
};

const serviceAccount = {};
Object.assign(serviceAccount, privateInformation);

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

export { db, admin };
