// app/api/dashboard/route.ts
import { NextRequest } from "next/server";
import { getDashboardData } from "@/hooks/middlewares/dashboard";

export async function GET(request: NextRequest) {
  return await getDashboardData(request);
}
