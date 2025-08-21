import { NextRequest } from "next/server";
import connect from "@/lib/data";
import { incrementPosterView } from "@/hooks/middlewares/poster";

export async function POST(req: NextRequest) {
  await connect();
  return await incrementPosterView(req);
}
