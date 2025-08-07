import { checkAdminAccess } from "@/middlewares/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return await checkAdminAccess(request);
}