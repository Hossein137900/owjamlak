import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import { getFavoriteById } from "@/middlewares/favorite";

export async function GET(req: NextRequest) {
  await connect();
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "Favorite ID is required" },
        { status: 400 }
      );
    }
    return await getFavoriteById(id);
  } catch (error) {
    console.error("Error fetching favorite:", error);
    return NextResponse.json(
      { message: "Error fetching favorite" },
      { status: 500 }
    );
  }
}
