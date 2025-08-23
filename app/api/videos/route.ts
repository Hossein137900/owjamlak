import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/video";
import { jwtDecode } from "jwt-decode";
import connect from "@/lib/data";

interface TokenPayload {
  id?: string;
  _id?: string;
}

export async function GET() {
  try {
    await connect();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در دریافت ویدیوها" },
      { status: 500 }
    );
  }
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

    await connect();
    const body = await request.json();
    const { title, description, src, alt } = body;

    if (!title || !description || !src || !alt) {
      return NextResponse.json(
        { success: false, message: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    const video = new Video({ title, description, src, alt });
    await video.save();

    return NextResponse.json(
      {
        success: true,
        message: "ویدیو با موفقیت ایجاد شد",
        data: video,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ایجاد ویدیو" },
      { status: 500 }
    );
  }
}
