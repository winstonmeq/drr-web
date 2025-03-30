import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "alertify-90d58",
      clientEmail: "firebase-adminsdk-fbsvc@alertify-90d58.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHtMAFL+MiVOjU\ndQulHfqqRo3qj8Js7Zd8pQYhSimDZUrc/OTsVBY7Ed+g1f6A3ft62SaGODUksYkE\nbIkwHNJvtX2RKiCqpWMeu9BE0DYBVo/WwkrhSHBJTSbtJf/32o9adavJ/RY6pdDy\nz0jbJWKlSy/e3GUlVRkwUjoOqPkwkwUGAj6GXyFQzzcGoxQc7qLho/rDLzTp0jYt\nzo5RRh7KrAlP5HaHAUSyGVGfT9fBPRGNS7L5ENXH2WND/4sUzhC85uXA/MnQSICw\nWaHPtkUP35siM4WL4uGZLwNDkuPpwDAiQuXHFcr34mOJPHbipAfWw1eVIhIpGc+T\nu/uYe0DRAgMBAAECggEAJeqohpOYAV2zsxrh8iCmBgxNR5qx5HKbz3uZlVp6VUs3\nEowlfsVcTyzOk7/tiVQcOi/eg59KX8Qhaqicx3jBb5o61AP2nc+26Q/ptBcAGfLw\nbmsHQoy5XQF8AYy0c7+YdilfS4N04/+1k1RN1eXcO9vxo9OelJ76oFUMVto4LcN2\nTlRiVZmwkITRyP9k0rDHe6OhldCMoKkYdKGQamrc777GXnZYxFQVmhIN+zDuXlpQ\noHa3sVaz2GeEICXvFNhzaIBPTohDy3wGe0aMj8/FuOL0aSgRCF6hvDuXUlMiwUEq\nLBPaINTZ93icsz8L+gLfypdSFp+BGCyBa9NLlZ11/QKBgQDn+p9tH0LJAbNqUSA9\nenNYqu1Ms9ZO3+oA7nYIbFEzT6b/1M5SxbaLVIccp6KE2aq8OLyyKvpYtFAgMb3a\nWxTHmc8YuI4moO9AH/7pyUCSNS7O43TYOZ4SR+SGJQxug4AD9Q/PAlF+wUNdurO9\nymLoxbSEJr5++Zkq5VFw/6YTqwKBgQDcYqAX/eqS0RDEDRxX5fOKUCk69fobHWVq\n+KdcZbj14N2yknbU9slwjTTiDMmfNP9VdVNbPxI0l7HnqzN9W3GPZcyRAHVWeGjz\nYqODKebNcVFz4NYLhRfQD5zVlqAx3j0jsfY/eFsmKm34nzLs9cvaywr8NazioK/z\naRaXf6ZBcwKBgQC6cdsquCJULZLG01cnMkB8tjwtFqkbEaogf4fMM0p8A/vDyITf\nT9rsVs6VAEKFpfAsgSlfxV0aaCmyBmiBlAy6c+tYAhT2BQjlsBGQUtkb6bSqQXPK\nyVw7cx6/lg1M0VHVXGQNS962EpyTO5h05LHkRepVAFLA+Nja+h4fxMj1KwKBgB9W\nattegMeFsPOfxaL+EMZfJa27omfOo0g1uV6bHFTiN8QXrYwU14oImjd2iAj6eUBG\noaa87jLKS0LdBkJSCXDRkeggf47fKlVJdmTFRYt7DJEErIsQztUIE04P0BGnP1xf\nBtv5mkRwDhknUg992BHxg0tfuoizPrHHBK5gOVzfAoGAXWaUJ458gRwyR2gHILpJ\nJD1DPNjJHBIybSfEBNXoC9yrbX49yVzbRTJ327EoYWuYBBss6xiQf3ZavwzifltG\nc89mbOGwi+g+BjAcEXNCDVvt0zbmZ1MhwbcZiinI+0rjkT+8TLmAFVPzTztUG8Bq\noxAcpQWHgdGekoZHpmXYyM0=\n-----END PRIVATE KEY-----\n",

    }),
  });
}

export async function POST(req: Request) {
  try {
    const { token, topic } = await req.json();
    
    if (!token || !topic) return NextResponse.json({ error: "Missing token or topic" }, { status: 400 });

    await admin.messaging().subscribeToTopic("cS5iK6wRAfrguhzeiMxt--:APA91bFDegM8ya78SYKNBw7xOprPttoQCY8XpvatdXo4-YMOY3u2MFamz5BlkYWq8G5AF4x7b-dI40hAyX5lA0enulAtyjfIbtJSXFHw-o5uSmW7Z4-TP_o", "presroxastoken2025");
    return NextResponse.json({ success: `Subscribed to ${topic}` });
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
