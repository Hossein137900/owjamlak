import connect from "@/lib/data";
import { getLegalRequestById } from "@/hooks/middlewares/legalConsultation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const id = await req.url.split("/").pop();
    console.log(id)
    console.log(req.url);
    if (!id)
      return NextResponse.json(
        { error: "Legal Request ID is required" },
        { status: 400 }
      );
    await connect();
    return await getLegalRequestById(id);
  } catch {
    return NextResponse.json(
      { error: "Legal Request ID is required" },
      { status: 400 }
    );
  }
}
