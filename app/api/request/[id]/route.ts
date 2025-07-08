import connect from "@/lib/data";
import { getRequestById } from "@/middlewares/employRequest";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
) {
    const id = req.url.split("/").pop();
    if (!id) return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
    await connect();
    return await getRequestById(id);
}
