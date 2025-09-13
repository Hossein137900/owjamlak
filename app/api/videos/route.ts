import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
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

// GET - List all videos (no auth required)
export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find().sort({ createdAt: -1 });

    return NextResponse.json({ videos });
  } catch (error) {
    console.log("Error listing videos:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت لیست ویدیوها" },
      { status: 500 }
    );
  }
}

// POST - Upload video (admin/superadmin only)
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

    const formData = await request.formData();
    const videoFile = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const alt = formData.get("alt") as string;

    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "فایل ویدیو مورد نیاز است" },
        { status: 400 }
      );
    }

    if (!title || !description || !alt) {
      return NextResponse.json(
        { success: false, message: "عنوان، توضیحات و متن جایگزین الزامی است" },
        { status: 400 }
      );
    }

    // Validate video file
    const allowedTypes = [
      "video/mp4", // H.264, MPEG-4, HEVC
      "video/quicktime", // MOV با H.264 یا MJPEG
      "video/mov", // MOV (مشابه quicktime)
      "video/hevc",
      "video/HEVC",
      "video/x-matroska", // MKV با H.264 یا HEVC
      "video/webm", // VP8/VP9
      "video/avi", // AVI با کدک‌های مختلف
      "video/mpeg", // MPEG-2
    ];
    if (!allowedTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { success: false, message: "فرمت ویدیو پشتیبانی نمیشود" },
        { status: 400 }
      );
    }

    // Check file size (50MB limit)
    const maxSize = 20 * 1024 * 1024; // 50MB
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "حجم فایل نباید بیشتر از 20 مگابایت باشد" },
        { status: 400 }
      );
    }

    // Create videos directory
    const videosDir = join(process.cwd(), "public", "uploads", "videos");
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = videoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const extension = originalName.split(".").pop() || "mp4";
    const filename = `video_${timestamp}.${extension}`;
    const filepath = join(videosDir, filename);

    // Save file
    const bytes = await videoFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Save to database
    await connectDB();
    const video = new Video({
      title,
      description,
      alt,
      src: `/uploads/videos/${filename}`,
      filename,
      originalName: videoFile.name,
      size: videoFile.size,
      uploadedBy: role,
    });

    await video.save();

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت آپلود شد",
      video,
    });
  } catch (error) {
    console.log("Error uploading video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در آپلود ویدیو" },
      { status: 500 }
    );
  }
}

// DELETE - Delete video (admin/superadmin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

    const { isValid } = checkAdminAccess(token);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "دسترسی محدود به ادمین و سوپرادمین" },
        { status: 403 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه ویدیو مورد نیاز است" },
        { status: 400 }
      );
    }

    await connectDB();
    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json(
        { success: false, message: "ویدیو یافت نشد" },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    const videosDir = join(process.cwd(), "public", "uploads", "videos");
    const filepath = join(videosDir, video.filename);

    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // Delete from database
    await Video.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت حذف شد",
    });
  } catch (error) {
    console.log("Error deleting video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف ویدیو" },
      { status: 500 }
    );
  }
}

// PATCH - Update video metadata (admin/superadmin only)
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

    const { isValid } = checkAdminAccess(token);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "دسترسی محدود به ادمین و سوپرادمین" },
        { status: 403 }
      );
    }

    const { id, title, description, alt } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه ویدیو مورد نیاز است" },
        { status: 400 }
      );
    }

    if (!title || !description || !alt) {
      return NextResponse.json(
        { success: false, message: "عنوان، توضیحات و متن جایگزین الزامی است" },
        { status: 400 }
      );
    }

    await connectDB();
    const video = await Video.findByIdAndUpdate(
      id,
      { title, description, alt },
      { new: true }
    );

    if (!video) {
      return NextResponse.json(
        { success: false, message: "ویدیو یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "اطلاعات ویدیو با موفقیت به‌روزرسانی شد",
      video,
    });
  } catch (error) {
    console.log("Error updating video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در به‌روزرسانی ویدیو" },
      { status: 500 }
    );
  }
}
