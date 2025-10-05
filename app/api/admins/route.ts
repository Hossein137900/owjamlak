import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data"; // فرض connect به db
import Admin from "@/models/admin";
import User from "@/models/user";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connect();
    const admins = await Admin.find({}).populate("user", "name phone").lean();
    return NextResponse.json({ admins });
  } catch (error) {
    console.log("Error fetching admins:", error);
    return NextResponse.json(
      { message: "خطا در دریافت مدیران" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const { userId, email, image, position, description, isActive } = body;

    // چک user معتبر و role admin/superadmin
    const user = await User.findById(userId);
    if (!user || !["admin", "superadmin"].includes(user.role)) {
      return NextResponse.json(
        { message: "کاربر معتبر نیست یا نقش مدیر ندارد" },
        { status: 400 }
      );
    }

    // چک existing admin
    const existingAdmin = await Admin.findOne({ user: userId });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "این کاربر قبلاً پروفایل مدیر دارد" },
        { status: 400 }
      );
    }

    // create admin
    const newAdmin = await Admin.create({
      name: user.name, // از user
      phone: user.phone, // از user
      email,
      image,
      position,
      description,
      isActive: isActive ?? true,
      user: userId,
    });

    return NextResponse.json(
      { admin: newAdmin, message: "مدیر با موفقیت ایجاد شد" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating admin:", error);
    return NextResponse.json({ message: "خطا در ایجاد مدیر" }, { status: 500 });
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
