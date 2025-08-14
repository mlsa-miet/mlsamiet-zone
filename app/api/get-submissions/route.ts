import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import path from 'path';
import fs from 'fs';

type Submission = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    year: string;
    branch: string;
    firstChoice: string;
    secondChoice: string;
    motivation: string;
    contribution: string;
    additionalInfo?: string;
    submittedAt?: {
        seconds: number;
        nanoseconds: number;
    } | null;
};
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

export async function GET() {
    const session = await getServerSession(authOptions);
    
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

    // Security Check: Ensure user is logged in AND is an admin
    if (!session || !session.user?.email || !adminEmails.includes(session.user.email)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const submissionsRef = db.collection('submissions');
        const snapshot = await submissionsRef.get();

        if (snapshot.empty) {
            return NextResponse.json([]);
        }

        const submissions: Submission[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const submissionData = {
                id: doc.id,
                ...data,
                submittedAt: data.submittedAt && data.submittedAt.seconds 
                    ? { seconds: data.submittedAt.seconds, nanoseconds: data.submittedAt.nanoseconds } 
                    : null
            } as Submission; 
            submissions.push(submissionData);
        });

        return NextResponse.json(submissions);

    } catch (error) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions.' }, { status: 500 });
    }
}
