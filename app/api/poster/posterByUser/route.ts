import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Poster from "@/models/poster";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  await connect();
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization header is missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in token" },
        { status: 400 }
      );
    }

    const posters = await Poster.find({ user: userId })
      .populate("user", "_id name phone email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ posters }, { status: 200 });
  } catch (error) {
    console.log("Error fetching user posters:", error);
    return NextResponse.json(
      { message: "Error fetching user posters" },
      { status: 500 }
    );
  }
}
