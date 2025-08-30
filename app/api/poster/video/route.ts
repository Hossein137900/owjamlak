import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id?: string;
  _id?: string;
};

// POST - Upload video for poster
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userId = decoded.id || decoded._id || "";
      if (!userId) throw new Error("Invalid token");
    } catch {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const videoFile = formData.get("video") as File;
    const posterId = formData.get("posterId") as string;
    const userIdFromForm = formData.get("userId") as string;

    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "فایل ویدیو مورد نیاز است" },
        { status: 400 }
      );
    }

    // For new posters, use temporary filename with timestamp
    const tempId = posterId || `temp_${Date.now()}`;

    // Validate video file
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/quicktime"];
    if (!allowedTypes.includes(videoFile.type)) {
      return NextResponse.json(
        { success: false, message: "فرمت ویدیو پشتیبانی نمیشود" },
        { status: 400 }
      );
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "حجم فایل نباید بیشتر از 50 مگابایت باشد" },
        { status: 400 }
      );
    }

    // Create user directory
    const userDir = join(process.cwd(), "public", "uploads", "posters", userId);
    if (!existsSync(userDir)) {
      await mkdir(userDir, { recursive: true });
    }

    // Generate filename
    const extension = videoFile.name.split('.').pop() || 'mp4';
    const filename = `poster_${tempId}_video.${extension}`;
    const filepath = join(userDir, filename);

    // Save file
    const bytes = await videoFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت آپلود شد",
      filename
    });

  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در آپلود ویدیو" },
      { status: 500 }
    );
  }
}

// DELETE - Remove video
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userId = decoded.id || decoded._id || "";
      if (!userId) throw new Error("Invalid token");
    } catch {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const { posterId, filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { success: false, message: "نام فایل مورد نیاز است" },
        { status: 400 }
      );
    }

    // Construct file path
    const userDir = join(process.cwd(), "public", "uploads", "posters", userId);
    const filepath = join(userDir, filename);

    // Delete file if it exists
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

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