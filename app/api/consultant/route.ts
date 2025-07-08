import { NextRequest } from "next/server";
import connect from "@/lib/data";
import {
  createConsultant,
  updateConsultant,
  deleteConsultant,
  getAllConsultants,
} from "@/middlewares/consultant";

export async function POST(req: NextRequest) {
  await connect();
  return await createConsultant(req);
}
export async function PATCH(req: NextRequest) {
  await connect();
  return await updateConsultant(req);
}
export async function DELETE(req: NextRequest) {
  await connect();
  return await deleteConsultant(req);
}

// Keep GET method for backward compatibility
export async function GET(req: NextRequest) {
  await connect();
  return await getAllConsultants(req);
}
