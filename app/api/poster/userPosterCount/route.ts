import { NextRequest } from "next/server";
import connect from "@/lib/data";
import { getPostersByUser } from "@/hooks/middlewares/poster";
export async function GET(req: NextRequest) {
  await connect();
  return await getPostersByUser(req);
}
