import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const userEmail = session.user.email;

    const submissionRef = db.collection("submissions").doc(userEmail);

    const dataToSave = {
      ...formData,
      submittedAt: new Date(),
      userEmail: userEmail,
    };

    await submissionRef.set(dataToSave);

    return NextResponse.json(
      { message: "Application submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 }
    );
  }
}
