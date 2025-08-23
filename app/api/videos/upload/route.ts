import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { jwtDecode } from "jwt-decode";
import { validateVideoFile, sanitizeFilename } from "@/lib/validation";

interface TokenPayload {
  id?: string;
  _id?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify user token
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
    const file = formData.get("video") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "فایل ویدیو انتخاب نشده است" },
        { status: 400 }
      );
    }

    // Validate video file
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    // Create user-specific uploads directory
    const uploadsDir = join(
      process.cwd(),
      "public",
      "uploads",
      "videos",
      userId
    );
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `video_${timestamp}_${sanitizeFilename(file.name)}`;
    const filepath = join(uploadsDir, filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت آپلود شد",
      data: { src: `/uploads/videos/${userId}/${filename}` },
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در آپلود ویدیو" },
      { status: 500 }
    );
  }
}
