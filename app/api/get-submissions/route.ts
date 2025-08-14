import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

// ... (Your Submission type definition remains the same)

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
  console.log("✅ Firebase Admin SDK initialized successfully in get-submissions.");
} catch (error) {
  if (error instanceof Error) {
    console.error("❌ Firebase Admin SDK Initialization Error:", error.message);
  } else {
    console.error("❌ Unknown error initializing Firebase Admin SDK:", error);
  }
}
// --- END: REPLACE THIS ENTIRE BLOCK ---


export async function GET() {
  // ... your existing GET function code is correct and remains the same
  // ...
}
