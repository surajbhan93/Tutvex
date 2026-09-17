import type { NextApiRequest, NextApiResponse } from "next";
import { aiReply } from "@/lib/aiFallback";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const text = "hello tutvex";

  const reply = await aiReply(text, "en");

  return res.status(200).json({
    input: text,
    reply,
  });
}
