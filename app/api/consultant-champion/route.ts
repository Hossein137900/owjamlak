import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import TopConsultant from "@/models/consultantChampion";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const data = await req.json();

    // Check if rank already exists
    const existingRank = await TopConsultant.findOne({ rank: data.rank });
    if (existingRank) {
      // Replace existing consultant at this rank
      await TopConsultant.findByIdAndUpdate(existingRank._id, data);
    } else {
      await TopConsultant.create(data);
    }

    return NextResponse.json({
      success: true,
      message: "مشاور برتر با موفقیت ثبت شد",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در ثبت مشاور برتر" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connect();
    const topConsultants = await TopConsultant.find({ isActive: true })
      .populate("consultant", "name phone")
      .sort({ rank: 1 })
      .limit(3);

    return NextResponse.json({ success: true, consultants: topConsultants });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در دریافت مشاوران برتر" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await TopConsultant.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "مشاور برتر حذف شد" });
  } catch {
    return NextResponse.json(
      { success: false, message: "خطا در حذف مشاور برتر" },
      { status: 500 }
    );
  }
}
