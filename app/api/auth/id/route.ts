import {  NextRequest } from "next/server";
import { getUserByToken, updateUserByToken } from "@/middlewares/auth";

export async function GET(request: NextRequest) {
  return await getUserByToken(request);
}

export async function PATCH(request: NextRequest) {
  return await updateUserByToken(request);
}
