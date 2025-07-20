// app/api/favorites/route.js
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "@/models/user";
import Poster from "@/models/poster";

export async function POST(req: NextRequest) {
  await connect();
  try {
    const posterId = req.headers.get("posterId");
    const userId = req.headers.get("userId");

    if (!posterId || !userId) {
      return NextResponse.json(
        { message: "User ID و Poster ID الزامی هستند" },
        { status: 400 }
      );
    }

    const poster = await Poster.findById(posterId);
    if (!poster) {
      return NextResponse.json({ message: "آگهی پیدا نشد" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    if (!user.favorite.includes(posterId)) {
      user.favorite.push(posterId);
      await user.save();
    }

    return NextResponse.json({
      message: "به علاقه‌مندی‌ها اضافه شد",
      favorite: user.favorite,
    });
  } catch (error) {
    console.log("خطا در افزودن علاقه‌مندی:", error);
    return NextResponse.json({ message: "خطا در سرور" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connect();
  try {
    const posterId = req.headers.get("posterId");
    const userId = req.headers.get("userId");

    if (!posterId || !userId) {
      return NextResponse.json(
        { message: "User ID و Poster ID الزامی هستند" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    user.favorite = user.favorite.filter(
      (fav: String) => fav.toString() !== posterId
    );
    await user.save();

    return NextResponse.json({
      message: "از علاقه‌مندی‌ها حذف شد",
      favorite: user.favorite,
    });
  } catch (error) {
    console.log("خطا در حذف علاقه‌مندی:", error);
    return NextResponse.json({ message: "خطا در سرور" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connect();
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID الزامی است" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate("favorite");
    if (!user) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ favorite: user.favorite });
  } catch (error) {
    console.log("خطا در گرفتن علاقه‌مندی‌ها:", error);
    return NextResponse.json({ message: "خطا در سرور" }, { status: 500 });
  }
}
