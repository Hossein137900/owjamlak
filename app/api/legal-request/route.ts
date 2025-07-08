import connect from "@/lib/data";
import { createLegalRequest, deleteLegalRequest, getAllLegalRequests, updateLegalRequest } from "@/middlewares/legalConsultation";

export async function GET() {
  await connect();
  return await getAllLegalRequests();
}

export async function POST(req: Request) {
  await connect();
  return await createLegalRequest(req);
}

export async function PATCH(req: Request) {
  await connect();
  return await updateLegalRequest(req);
}

export async function DELETE(req: Request) {
  await connect();
  return await deleteLegalRequest(req);
}