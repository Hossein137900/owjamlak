import { NextRequest } from "next/server";
import { getDashboardStats } from "@/middlewares/dashboard";

export async function GET(request: NextRequest) {
  return await getDashboardStats(request);
}
