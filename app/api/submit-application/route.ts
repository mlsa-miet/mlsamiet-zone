import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Function to initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountString) {
      throw new Error("The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.");
    }
    
    const serviceAccount = JSON.parse(serviceAccountString);

    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    
    console.log("✅ Firebase Admin SDK initialized successfully.");
    return getFirestore();
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Firebase Admin SDK Initialization Error:", error.message);
    } else {
      console.error("❌ Unknown error initializing Firebase Admin SDK:", error);
    }
    // Return null or throw the error to indicate failure
    return null;
  }
};

const db = initializeFirebaseAdmin();

export async function POST(request: Request) {
  // ✅ Crucial Check: If DB initialization failed, return an error immediately.
  if (!db) {
    return NextResponse.json(
      { error: "Server configuration error. Please try again later." },
      { status: 500 }
    );
  }

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