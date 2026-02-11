// auth/firebase-admin.provider.ts
import * as admin from 'firebase-admin';

// Instead of importing the JSON file directly (which causes issues with TypeScript),
// require it or load it dynamically.
const serviceAccount = require('../firebase-service-account.json');

export const FirebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});