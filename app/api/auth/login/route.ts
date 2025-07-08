import { NextRequest } from "next/server";
import { login, checkAdminAccess } from "@/middlewares/auth";

export async function POST(request: NextRequest) {
  return await login(request);
}

export async function GET(request: NextRequest) {
  return await checkAdminAccess(request);
}
