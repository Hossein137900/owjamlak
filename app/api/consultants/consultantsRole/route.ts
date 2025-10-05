import { NextResponse } from "next/server";
import User from "@/models/user";

export async function GET() {
  try {
    const users = await User.find({ role: "consultant" })
      .select("name phone _id") // فقط فیلدهای لازم
      .lean();
    return NextResponse.json({ users });
  } catch (error) {
    console.log("Error fetching consultant users:", error);
    return NextResponse.json(
      { message: "خطا در دریافت کاربران مشاور" },
      { status: 500 }
    );
  }
}
