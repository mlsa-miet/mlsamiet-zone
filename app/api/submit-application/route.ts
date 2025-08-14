import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

let db: ReturnType<typeof getFirestore>;

// --- START: REPLACE THIS ENTIRE BLOCK ---
try {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountString) {
    throw new Error("The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.");
  }
  
  // Parse the service account key from the environment variable
  const serviceAccount = JSON.parse(serviceAccountString);

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount), // Use the parsed service account object
    });
  }
  
  db = getFirestore();
  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (error) {
  if (error instanceof Error) {
    console.error("❌ Firebase Admin SDK Initialization Error:", error.message);
  } else {
    console.error("❌ Unknown error initializing Firebase Admin SDK:", error);
  }
}



export async function POST(request: Request) {
}