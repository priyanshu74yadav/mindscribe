import dotenv from 'dotenv';
import admin from 'firebase-admin';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'GEMINI_API_KEY',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Initialize Firebase Admin
try {
  // Parse private key (replace \\n with actual newlines)
  const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  process.exit(1);
}

export const db = admin.firestore();
export const storage = admin.storage();
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const PORT = process.env.PORT || 3000;

