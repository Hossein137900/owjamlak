import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Consultant from "@/models/consultant";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    // Await params in Next.js 15+
    const { id } = await params;

    console.log("Fetching consultant with ID:", id); // Debug log

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id); // Debug log
      return NextResponse.json(
        {
          success: false,
          message: "شناسه مشاور نامعتبر است",
        },
        { status: 400 }
      );
    }

    const consultant = await Consultant.findById(id).lean();
    console.log("Found consultant:", consultant ? "Yes" : "No"); // Debug log

    if (!consultant) {
      return NextResponse.json(
        {
          success: false,
          message: "مشاور یافت نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      consultant,
    });
  } catch (error: any) {
    console.log("API Error:", error); // Debug log
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات مشاور",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه مشاور نامعتبر است",
        },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      whatsapp,
      email,
      image,
      experienceYears,
      workAreas,
      specialties,
      description,
      rating,
      isActive,
    } = await req.json();

    // Validation
    if (
      !name ||
      !phone ||
      !whatsapp ||
      !experienceYears ||
      !workAreas?.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "فیلدهای اجباری را پر کنید",
        },
        { status: 400 }
      );
    }

    // Check if phone already exists for other consultants
    const existingConsultant = await Consultant.findOne({
      _id: { $ne: id },
      $or: [{ phone }, { whatsapp }],
    });

    if (existingConsultant) {
      return NextResponse.json(
        {
          success: false,
          message: "مشاوری با این شماره تلفن قبلاً ثبت شده است",
        },
        { status: 400 }
      );
    }

    const consultant = await Consultant.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        whatsapp,
        email,
        image,
        experienceYears,
        workAreas: workAreas.filter((area: string) => area.trim()),
        specialties:
          specialties?.filter((specialty: string) => specialty.trim()) || [],
        description,
        rating,
        isActive,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!consultant) {
      return NextResponse.json(
        {
          success: false,
          message: "مشاور یافت نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "مشاور با موفقیت به‌روزرسانی شد",
      consultant,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در به‌روزرسانی مشاور",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  try {
    const { id } = params;

    const consultant = await Consultant.findByIdAndDelete(id);

    if (!consultant) {
      return NextResponse.json(
        {
          success: false,
          message: "مشاور یافت نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "مشاور با موفقیت حذف شد",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف مشاور",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
