import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

let adminApp: App;
let db: ReturnType<typeof getFirestore>;

try {
  // Initialize Firebase Admin using environment variables
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process
          .env
          .FIREBASE_PRIVATE_KEY
          ?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    adminApp = getApps()[0];
  }

  db = getFirestore(adminApp);
  console.log(" Firebase Admin SDK initialized successfully.");
} catch (error) {
  if (error instanceof Error) {
    console.error(" Firebase Admin SDK Initialization Error:", error.message);
  } else {
    console.error(
      " Unknown error occurred during Firebase Admin SDK initialization:",
      error
    );
  }
}

export async function GET() {
  if (!db) {
    return NextResponse.json(
      { error: "Firebase Admin SDK not initialized." },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;
    const submissionRef = db.collection("submissions").doc(userEmail);
    const docSnap = await submissionRef.get();

    return NextResponse.json({ hasSubmitted: docSnap.exists });
  } catch (error) {
    console.error("Error checking submission status:", error);
    return NextResponse.json(
      { error: "Failed to check submission status." },
      { status: 500 }
    );
  }
}
