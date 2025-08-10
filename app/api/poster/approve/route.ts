import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Poster from "@/models/poster";

export async function PATCH(req: NextRequest) {
  await connect();

  try {
    const { id, action } = await req.json();

    if (!id || !action) {
      return NextResponse.json(
        { message: "شناسه آگهی و عملیات الزامی است" },
        { status: 400 }
      );
    }

    let updateData: { isApproved: boolean };

    if (action === "approve") {
      updateData = { isApproved: true };
    } else if (action === "decline") {
      updateData = { isApproved: false };
    } else {
      return NextResponse.json({ message: "عملیات نامعتبر" }, { status: 400 });
    }

    const poster = await Poster.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!poster) {
      return NextResponse.json({ message: "آگهی پیدا نشد" }, { status: 404 });
    }

    const message = action === "approve" ? "آگهی تایید شد" : "آگهی رد شد";
    return NextResponse.json({ message, poster });
  } catch (error) {
    console.error("Error updating poster approval:", error);
    return NextResponse.json(
      { message: "خطا در بروزرسانی وضعیت آگهی" },
      { status: 500 }
    );
  }
}
