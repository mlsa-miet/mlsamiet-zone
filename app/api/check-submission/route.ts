import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import path from 'path';
import fs from 'fs';

let adminApp: App;
let db: ReturnType<typeof getFirestore>;

try {
  // Construct the path to the service account file in the project root
  const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("firebase-service-account.json not found in project root. Please ensure the file is there.");
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  // Initialize Firebase Admin SDK
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    adminApp = getApps()[0];
  }

  db = getFirestore(adminApp);
  console.log("Firebase Admin SDK initialized successfully.");

}  catch (error) { 
  if (error instanceof Error) {
    console.error("Firebase Admin SDK Initialization Error:", error.message);
  } else {
    console.error("An unknown error occurred during Firebase Admin SDK initialization:", error);
  }
}

export async function GET() {
    if (!db) {
        return NextResponse.json({ error: 'Firebase Admin SDK not initialized.' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const userEmail = session.user.email;
        const submissionRef = db.collection('submissions').doc(userEmail);
        const docSnap = await submissionRef.get();

        if (docSnap.exists) {
            return NextResponse.json({ hasSubmitted: true });
        } else {
            return NextResponse.json({ hasSubmitted: false });
        }

    } catch (error) {
        console.error('Error checking submission status:', error);
        return NextResponse.json({ error: 'Failed to check submission status.' }, { status: 500 });
    }
}