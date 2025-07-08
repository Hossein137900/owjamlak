import connect from "@/lib/data";
import { createRealStateRequest, deleteRealStateRequest, getAllRealStateRequests, updateRealStateRequest } from "@/middlewares/realStateConsultation";

export async function GET() {
  await connect();
  return await getAllRealStateRequests();
}

export async function POST(req: Request) {
  await connect();
  return await createRealStateRequest(req);
}

export async function PATCH(req: Request) {
  await connect();
  return await updateRealStateRequest(req);
}

export async function DELETE(req: Request) {
  await connect();
  return await deleteRealStateRequest(req);
}