import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import path from 'path';
import fs from 'fs';

// Securely read the service account key on the server
const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(serviceAccount)
  });
} else {
  adminApp = getApps()[0];
}

const db = getFirestore(adminApp);

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const formData = await request.json();
        const userEmail = session.user.email;

        const submissionRef = db.collection('submissions').doc(userEmail);

        const dataToSave = {
            ...formData,
            submittedAt: new Date(),
            userEmail: userEmail,
        };

        await submissionRef.set(dataToSave);

        return NextResponse.json({ message: 'Application submitted successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Error saving to Firestore:', error);
        return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
    }
}
