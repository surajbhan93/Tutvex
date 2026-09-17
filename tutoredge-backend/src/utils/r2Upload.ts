import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
  forcePathStyle: true, // 🔥 ADD THIS (IMPORTANT)
});


export const uploadToR2 = async (
  buffer: Buffer,
  filename: string,
  mimeType: string
) => {
  try {
    const uniqueName =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex") + "-" + filename;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: uniqueName,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3.send(command);

    // 🔥 PUBLIC URL
    const url = `${process.env.R2_PUBLIC_URL}/${uniqueName}`;

    console.log("✅ Uploaded to R2:", url);

    return url;
  } catch (err) {
  console.error("❌ R2 Upload Error:", err);
  throw err; // 🔥 VERY IMPORTANT
}
};