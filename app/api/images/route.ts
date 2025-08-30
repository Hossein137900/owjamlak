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

    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    if (!filename) {
      return NextResponse.json(
        { success: false, message: "نام فایل نامعتبر است" },
        { status: 400 }
      );
    }

    // Construct file path
    const filePath = join(process.cwd(), "public", "uploads", filename);

    // Delete file if it exists
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return NextResponse.json({
      success: true,
      message: "تصویر با موفقیت حذف شد"
    });

  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف تصویر" },
      { status: 500 }
    );
  }
}