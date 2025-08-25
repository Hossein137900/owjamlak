import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";

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
    const videosDir = join(process.cwd(), "public", "uploads", "videos");
    
    if (!existsSync(videosDir)) {
      return NextResponse.json({ videos: [] });
    }

    const files = await readdir(videosDir);
    const videoFiles = files.filter(file => 
      /\.(mp4|webm|ogg|avi|mov)$/i.test(file)
    );

    const videos = videoFiles.map(filename => ({
      filename,
      url: `/api/videos/${filename}`,
      uploadedAt: new Date().toISOString() // You might want to get actual file stats
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error listing videos:", error);
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

    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "فایل ویدیو مورد نیاز است" },
        { status: 400 }
      );
    }

    // Validate video file
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/quicktime"];
    if (!allowedTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { success: false, message: "فرمت ویدیو پشتیبانی نمیشود" },
        { status: 400 }
      );
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "حجم فایل نباید بیشتر از 50 مگابایت باشد" },
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
    const originalName = videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = originalName.split('.').pop() || 'mp4';
    const filename = `video_${timestamp}.${extension}`;
    const filepath = join(videosDir, filename);

    // Save file
    const bytes = await videoFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت آپلود شد",
      video: {
        filename,
        url: `/api/videos/${filename}`,
        originalName: videoFile.name,
        size: videoFile.size,
        uploadedBy: role
      }
    });

  } catch (error) {
    console.error("Error uploading video:", error);
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

    const { filename } = await request.json();
    
    if (!filename) {
      return NextResponse.json(
        { success: false, message: "نام فایل مورد نیاز است" },
        { status: 400 }
      );
    }

    // Security: Validate filename
    if (!/^[a-zA-Z0-9._-]+$/.test(filename) || filename.includes('..')) {
      return NextResponse.json(
        { success: false, message: "نام فایل نامعتبر است" },
        { status: 400 }
      );
    }

    const videosDir = join(process.cwd(), "public", "uploads", "videos");
    const filepath = join(videosDir, filename);

    if (!existsSync(filepath)) {
      return NextResponse.json(
        { success: false, message: "فایل یافت نشد" },
        { status: 404 }
      );
    }

    await unlink(filepath);

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت حذف شد"
    });

  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف ویدیو" },
      { status: 500 }
    );
  }
}