import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/data";
import Video from "@/models/video";

type TokenPayload = {
  id?: string;
  _id?: string;
  role?: string;
};

// Helper function to check admin/superadmin access
function checkAdminAccess(token: string): { isValid: boolean; role?: string } {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const role = decoded.role;

    if (role === "admin" || role === "superadmin") {
      return { isValid: true, role };
    }
    return { isValid: false };
  } catch {
    return { isValid: false };
  }
}

// POST - Create video metadata record (admin/superadmin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

    const { isValid, role } = checkAdminAccess(token);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "دسترسی محدود به ادمین و سوپرادمین" },
        { status: 403 }
      );
    }

    const { title, description, alt, filename, originalName, size } = await request.json();

    if (!title || !description || !alt || !filename) {
      return NextResponse.json(
        { success: false, message: "عنوان، توضیحات، متن جایگزین و نام فایل الزامی است" },
        { status: 400 }
      );
    }

    // Save to database
    await connectDB();
    
    const video = new Video({
      title,
      description,
      alt,
      src: `/api/videos/files/${filename}`,
      filename,
      originalName: originalName || filename,
      size: size || 0,
      uploadedBy: role,
    });

    await video.save();

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت ثبت شد",
      video,
    });
  } catch (error) {
    console.log("Error creating video metadata:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ثبت اطلاعات ویدیو" },
      { status: 500 }
    );
  }
}