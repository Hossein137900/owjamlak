import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/user";
import Poster from "@/models/poster";
import jwt from "jsonwebtoken"; // اگر از jwt استفاده می‌کنی

export async function GET(req: NextRequest) {
  try {
    await connect();

    const token = req.headers.get("token");
    if (!token) {
      return NextResponse.json({ message: "توکن ارسال نشده" }, { status: 401 });
    }

    // ✅ توکن رو decode کن
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
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
  } catch (err: any) {
    console.log("Error in favorite list API:", err);
    return NextResponse.json(
      { message: "خطای سرور", error: err.message },
      { status: 500 }
    );
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

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    user.favorite = user.favorite.filter(
      (fav: any) => fav.toString() !== posterId
    );
    await user.save();

    return NextResponse.json(
      { message: "آگهی از علاقه‌مندی‌ها حذف شد" },
      { status: 200 }
    );
  } catch (err: any) {
    console.log("Error removing favorite:", err);
    return NextResponse.json(
      { message: "خطای سرور", error: err.message },
      { status: 500 }
    );
  }
}
