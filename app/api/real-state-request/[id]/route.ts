import connect from "@/lib/data";
import { getRealStateRequestById } from "@/middlewares/realStateConsultation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const id = req.url.split("/").pop();
  if (!id)
    return NextResponse.json(
      { error: "Real State Request ID is required" },
      { status: 400 }
    );
  await connect();
  return await getRealStateRequestById(id);
}
