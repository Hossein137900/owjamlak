import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import { getPosterById } from "@/middlewares/poster";

export async function GET(req: NextRequest) {
  await connect();
  try {
    const id = req.url.split("/").pop(); // Extract the ID from the URL
    console.log(id)
    if (!id) {
      return NextResponse.json(
        { message: "Poster ID is required" },
        { status: 400 }
      );
    }
    return await getPosterById(id);
  } catch (error) {
    console.error("Error fetching poster:", error);
    return NextResponse.json(
      { message: "Error fetching poster" },
      { status: 500 }
    );
  }
}
