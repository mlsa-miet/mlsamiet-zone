import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

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

let adminApp: App;
let db: ReturnType<typeof getFirestore>;

try {
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }

  db = getFirestore(adminApp);
  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (error) {
  if (error instanceof Error) {
    console.error("❌ Firebase Admin SDK Initialization Error:", error.message);
  } else {
    console.error("❌ Unknown error initializing Firebase Admin SDK:", error);
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];

  // Security check — must be logged in AND an admin
  if (!session || !session.user?.email || !adminEmails.includes(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const submissionsRef = db.collection("submissions");
    const snapshot = await submissionsRef.get();

    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const submissions: Submission[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt:
          data.submittedAt && data.submittedAt.seconds
            ? {
                seconds: data.submittedAt.seconds,
                nanoseconds: data.submittedAt.nanoseconds,
              }
            : null,
      } as Submission;
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions." },
      { status: 500 }
    );
  }
}
