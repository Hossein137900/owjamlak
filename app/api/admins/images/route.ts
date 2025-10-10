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
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/HEIC",
      "image/heic",
      "image/HEIF",
    ];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, message: "فرمت تصویر پشتیبانی نمیشود" },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "حجم فایل نباید بیشتر از 5 مگابایت باشد" },
        { status: 400 }
      );
    }

    // Create admins directory
    const adminsDir = join(process.cwd(), "public", "uploads", "admins");
    if (!existsSync(adminsDir)) {
      await mkdir(adminsDir, { recursive: true });
    }

    // Generate filename
    const extension = imageFile.name.split(".").pop() || "webp";
    const filename = `admin_${Date.now()}.${extension}`;
    const filepath = join(adminsDir, filename);

    // Save file
    const bytes = await imageFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const imageUrl = `/api/admins/images/${filename}`;

    return NextResponse.json({
      success: true,
      message: "تصویر با موفقیت آپلود شد",
      imageUrl,
    });
  } catch (error) {
    console.log("Error uploading admin image:", error);
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
    const filename = imageUrl.split("/").pop();
    if (!filename) {
      return NextResponse.json(
        { success: false, message: "نام فایل نامعتبر است" },
        { status: 400 }
      );
    }

    // Construct file path
    const filePath = join(
      process.cwd(),
      "public",
      "uploads",
      "admins",
      filename
    );

    // Delete file if it exists
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return NextResponse.json({
      success: true,
      message: "تصویر با موفقیت حذف شد",
    });
  } catch (error) {
    console.log("Error deleting admin image:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف تصویر" },
      { status: 500 }
    );
  }
}
