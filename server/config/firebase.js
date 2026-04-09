import admin from "firebase-admin";

function getPrivateKey() {
  const raw = process.env.FIREBASE_PRIVATE_KEY || "";
  if (!raw) return "";
  // Allow storing multiline keys in .env with \n escapes.
  return raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
}

export function isFirebaseConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      getPrivateKey() &&
      process.env.FIREBASE_STORAGE_BUCKET,
  );
}

export function getFirebaseBucket() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || "";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";
    const privateKey = getPrivateKey();
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || "";

    if (!projectId || !clientEmail || !privateKey || !storageBucket) {
      const missing = [
        !projectId && "FIREBASE_PROJECT_ID",
        !clientEmail && "FIREBASE_CLIENT_EMAIL",
        !privateKey && "FIREBASE_PRIVATE_KEY",
        !storageBucket && "FIREBASE_STORAGE_BUCKET",
      ].filter(Boolean);
      throw new Error(`Missing Firebase env: ${missing.join(", ")}`);
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
  }

  return admin.storage().bucket();
}

