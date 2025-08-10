import { NextRequest } from "next/server";
import connect from "@/lib/data";
import { getPosterById } from "@/middlewares/poster";

export async function GET(req: NextRequest) {
  await connect();

  return await getPosterById(req);
}
