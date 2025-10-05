import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data"; // فرض connect به db
import Admin from "@/models/admin";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;

    console.log("Fetching admin with ID:", id); // Debug log

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id); // Debug log
      return NextResponse.json(
        {
          success: false,
          message: "شناسه مدیر نامعتبر است",
        },
        { status: 400 }
      );
    }

    const admin = await Admin.findById(id)
      .populate("user", "name phone") // 👈 populate user
      .lean();

    console.log("Found admin:", admin ? "Yes" : "No"); // Debug log

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "مدیر یافت نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.log("API Error:", error); // Debug log
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات مدیر",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const body = await req.json();
    const { email, image, position, description, isActive } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "شناسه نامعتبر" }, { status: 400 });
    }

    const updated = await Admin.findByIdAndUpdate(
      id,
      { email, image, position, description, isActive },
      { new: true, runValidators: true }
    ).populate("user");

    if (!updated) {
      return NextResponse.json({ message: "مدیر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ admin: updated, message: "به‌روزرسانی شد" });
  } catch {
    return NextResponse.json(
      { message: "خطا در به‌روزرسانی" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return NextResponse.json({ message: "مدیر یافت نشد" }, { status: 404 });
    }

    // optional: user رو delete نکن، چون admin ممکنه جدا باشه
    return NextResponse.json({ message: "حذف شد" });
  } catch {
    return NextResponse.json({ message: "خطا در حذف" }, { status: 500 });
  }
}
