import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function DELETE(request: NextRequest) {
  try {
    const { posterId, imageUrl } = await request.json();

    if (!posterId || !imageUrl) {
      return NextResponse.json(
        { success: false, message: "شناسه آگهی و URL تصویر مورد نیاز است" },
        { status: 400 }
      );
    }

    // Extract userId and filename from URL
    // URL format: /api/images/userId/filename
    const urlParts = imageUrl.split('/');
    const userId = urlParts[urlParts.length - 2];
    const filename = urlParts[urlParts.length - 1];
    
    if (!userId || !filename) {
      return NextResponse.json(
        { success: false, message: "نام فایل یا شناسه کاربر نامعتبر است" },
        { status: 400 }
      );
    }

    // Construct file path for poster images
    const filePath = join(process.cwd(), "public", "uploads", "posters", userId, filename);

    // Delete file if it exists
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return NextResponse.json({
      success: true,
      message: "تصویر با موفقیت حذف شد"
    });

  } catch (error) {
    console.log("Error deleting image:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف تصویر" },
      { status: 500 }
    );
  }
}