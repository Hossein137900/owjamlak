import {   NextResponse } from "next/server";
import User from "@/models/user";

export async function GET() {
  try {
    const users = await User.find({ role: { $in: ["admin", "superadmin"] } })
      .select("name phone _id")
      .lean();
    return NextResponse.json({ users });
  } catch (error) {
    console.log("Error fetching admin users:", error);
    return NextResponse.json(
      { message: "خطا در دریافت کاربران مدیر" },
      { status: 500 }
    );
  }
}
