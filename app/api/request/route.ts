import connect from "@/lib/data";
import { createRequest, deleteRequest, getAllRequests, updateRequest } from "@/hooks/middlewares/employRequest";

// works with request extract id from req.body 
export async function GET() {
  await connect();
  return await getAllRequests();
}

export async function POST(req: Request) {
  await connect();
  return await createRequest(req);
}

export async function PATCH(req: Request) {
  await connect();
  return await updateRequest(req);
}

export async function DELETE(req: Request) {
  await connect();
  return await deleteRequest(req);
}
