import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Consultant from "@/models/consultant";
import mongoose from "mongoose";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import Poster from "@/models/poster";

interface ConsultantWithUser {
  _id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  image: string;
  experienceYears: number;
  posterCount: number;
  workAreas: string[];
  specialties: string[];
  rating?: number;
  description?: string;
  isActive: boolean;
  user: {
    _id: string;
    name: string;
    phone: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const { id } = await params;

    console.log("Fetching consultant with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id);
      return NextResponse.json(
        {
          success: false,
          message: "شناسه مشاور نامعتبر است",
        },
        { status: 400 }
      );
    }

    // 👈 fetch Consultant با populate user (اگر لازم)
    const consultant = await Consultant.findById(id)
      .populate("user", "name phone") // 👈 populate user اگر فیلدهای اضافی می‌خوای
      .lean();

    console.log("Found consultant:", consultant ? "Yes" : "No");

    if (!consultant) {
      return NextResponse.json(
        {
          success: false,
          message: "مشاور یافت نشد",
        },
        { status: 404 }
      );
    }

    // 👈 جدید: fetch posters این مشاور (بر اساس user._id)
    const consultantWithUser = consultant as unknown as ConsultantWithUser;
    const posters = await Poster.find({ user: consultantWithUser.user._id })
      .populate("user", "name") // 👈 optional: populate برای نمایش owner
      .sort({ createdAt: -1 }) // 👈 جدیدترین اول
      .lean();

    // 👈 optional: posterCount اضافه کن
    consultantWithUser.posterCount = posters.length;

    return NextResponse.json({
      success: true,
      consultant,
      posters, // 👈 جدید: لیست آگهی‌ها
    });
  } catch (error) {
    console.log("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات مشاور",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();

  try {
    const { id } = await params;

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
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در به‌روزرسانی مشاور",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();

  try {
    const { id } = await params;

    // First find the consultant to get image path
    const consultant = await Consultant.findById(id);

    if (!consultant) {
      return NextResponse.json(
        {
          success: false,
          message: "مشاور یافت نشد",
        },
        { status: 404 }
      );
    }

    // Delete image file if exists
    if (
      consultant.image &&
      consultant.image.startsWith("/uploads/consultants/")
    ) {
      const filename = consultant.image.split("/").pop();
      if (filename) {
        const filePath = join(
          process.cwd(),
          "public",
          "uploads",
          "consultants",
          filename
        );
        if (existsSync(filePath)) {
          try {
            await unlink(filePath);
          } catch (error) {
            console.log("Error deleting consultant image:", error);
          }
        }
      }
    }

    // Delete consultant from database
    await Consultant.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "مشاور با موفقیت حذف شد",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف مشاور",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
