import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "فایل تصویر مورد نیاز است" },
        { status: 400 }
      );
    }

    // Validate image file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, message: "فرمت تصویر پشتیبانی نمیشود" },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    const maxSize = 8 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "حجم فایل نباید بیشتر از 8 مگابایت باشد" },
        { status: 400 }
      );
    }

    // Create consultants directory
    const consultantsDir = join(process.cwd(), "public", "uploads", "consultants");
    if (!existsSync(consultantsDir)) {
      await mkdir(consultantsDir, { recursive: true });
    }

    // Generate filename
    const extension = imageFile.name.split('.').pop() || 'webp';
    const filename = `consultant_${Date.now()}.${extension}`;
    const filepath = join(consultantsDir, filename);

    // Save file
    const bytes = await imageFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const imageUrl = `/uploads/consultants/${filename}`;

    return NextResponse.json({
      success: true,
      message: "تصویر با موفقیت آپلود شد",
      imageUrl
    });

  } catch (error) {
    console.error("Error uploading consultant image:", error);
    return NextResponse.json(
      { success: false, message: "خطا در آپلود تصویر" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "URL تصویر مورد نیاز است" },
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
    const filePath = join(process.cwd(), "public", "uploads", "consultants", filename);

    // Delete file if it exists
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return NextResponse.json({
      success: true,
      message: "تصویر با موفقیت حذف شد"
    });

  } catch (error) {
    console.error("Error deleting consultant image:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف تصویر" },
      { status: 500 }
    );
  }
}