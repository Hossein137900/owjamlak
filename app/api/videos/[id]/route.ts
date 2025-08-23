import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/video";
import { jwtDecode } from "jwt-decode";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import connect from "@/lib/data";

interface TokenPayload {
  id?: string;
  _id?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json(
        { success: false, message: "ویدیو یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در دریافت ویدیو" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await connect();
    const body = await request.json();
    const { title, description, src, alt } = body;

    const video = await Video.findByIdAndUpdate(
      params.id,
      { title, description, src, alt },
      { new: true, runValidators: true }
    );

    if (!video) {
      return NextResponse.json(
        { success: false, message: "ویدیو یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت به‌روزرسانی شد",
      data: video,
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در به‌روزرسانی ویدیو" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await connect();
    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json(
        { success: false, message: "ویدیو یافت نشد" },
        { status: 404 }
      );
    }

    // Delete video file from disk if it exists
    if (video.src && video.src.startsWith("/uploads/videos/")) {
      const filePath = join(process.cwd(), "public", video.src);
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (error) {
          console.error("Error deleting video file:", error);
        }
      }
    }

    await Video.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف ویدیو" },
      { status: 500 }
    );
  }
}
