import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Consultant from "@/models/consultant";
import User from "@/models/user";
import mongoose from "mongoose";

interface ConsultantData {
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  image?: string;
  experienceYears: number;
  workAreas: string[];
  specialties?: string[];
  description?: string;
  rating?: number; // 1 تا 5
  isActive: boolean;
  posterCount: number;
  user: mongoose.Types.ObjectId;
}

export async function GET(req: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const workArea = searchParams.get("workArea");
    const minExperience = searchParams.get("minExperience");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive") || "true";

    const query: Record<string, unknown> = {};

    if (isActive !== "all") {
      query.isActive = isActive === "true";
    }

    if (workArea) {
      query.workAreas = { $in: [workArea] };
    }

    if (minExperience) {
      query.experienceYears = { $gte: parseInt(minExperience) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { workAreas: { $in: [new RegExp(search, "i")] } },
        { specialties: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const consultants = await Consultant.find(query)
      .sort({ experienceYears: -1, posterCount: -1, rating: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      consultants,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت مشاوران",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connect();

  try {
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
      isActive = true,
      userId,
    } = await req.json();

    const user = await User.findById(userId);
    if (!user || user.role !== "consultant") {
      return NextResponse.json(
        { message: "کاربر معتبر نیست یا نقش مشاور ندارد" },
        { status: 400 }
      );
    }

    // Validation
    if (
      !name ||
      !phone ||
      !whatsapp ||
      experienceYears === undefined ||
      experienceYears === null ||
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

    // Check if phone already exists
    const existingConsultant = await Consultant.findOne({
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

    const consultantData: ConsultantData = {
      name: user.name, // از User بگیر
      phone: user.phone, // از User بگیر
      whatsapp,
      experienceYears,
      workAreas: workAreas.filter((area: string) => area.trim()),
      specialties:
        specialties?.filter((specialty: string) => specialty.trim()) || [],
      isActive,
      posterCount: 0,
      user: userId,
    };

    // Add optional fields only if they have values
    if (email) consultantData.email = email;
    if (image) consultantData.image = image;
    if (description) consultantData.description = description;
    if (rating && rating >= 1 && rating <= 5) consultantData.rating = rating;

    const consultant = new Consultant(consultantData);

    await consultant.save();

    return NextResponse.json(
      {
        success: true,
        message: "مشاور با موفقیت ایجاد شد",
        consultant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Consultant creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در ایجاد مشاور",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
