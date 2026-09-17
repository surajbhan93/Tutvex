import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function saveFile(
  buffer: Buffer,
  originalName: string,
  mimetype: string
) {
  const uploadsDir = path.join(process.cwd(), "uploads");

  // uploads folder ensure
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // unique filename
  const ext = path.extname(originalName);
  const filename = `${Date.now()}_${crypto
    .randomBytes(6)
    .toString("hex")}${ext}`;

  const filePath = path.join(uploadsDir, filename);

  // save file
  await fs.promises.writeFile(filePath, buffer);

  return {
    filename,
    url: `/uploads/${filename}`, // 👈 frontend ke liye
    mimetype,
    size: buffer.length,
  };
}
