import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/user";
import Poster from "@/models/poster";
import jwt from "jsonwebtoken"; // اگر از jwt استفاده می‌کنی

interface JWTPayload {
  id: string; // آیدی کاربر که شما ذخیره می‌کنید
  iat?: number; // issued at
  exp?: number; // expiration time
  [key: string]: unknown; // برای هر کلید اضافی
}
export async function GET(req: NextRequest) {
  try {
    await connect();

    const token = req.headers.get("token");
    if (!token) {
      return NextResponse.json({ message: "توکن ارسال نشده" }, { status: 401 });
    }

    // ✅ توکن رو decode کن
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "توکن نامعتبر" }, { status: 401 });
    }

    // ✅ کاربر رو بگیر
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    // ✅ آگهی‌های علاقه‌مندی رو populate کن
    const favorites = await Poster.find({ _id: { $in: user.favorite } });

    return NextResponse.json({ favorites });
  } catch (err) {
    console.log(
      "Error get favorite:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({
      message: "خطای سرور",
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const token = req.headers.get("token");
    const posterId = req.headers.get("posterid");
    if (!token || !posterId) {
      return NextResponse.json(
        { message: "توکن یا شناسه آگهی ارسال نشده" },
        { status: 400 }
      );
    }

    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "توکن نامعتبر" }, { status: 401 });
    }
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    user.favorite = user.favorite.filter(
      (fav: string) => fav.toString() !== posterId
    );
    await user.save();

    return NextResponse.json(
      { message: "آگهی از علاقه‌مندی‌ها حذف شد" },
      { status: 200 }
    );
  } catch (err) {
    console.log(
      "Error removing favorite:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      {
        message: "خطای سرور",
        error: err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
