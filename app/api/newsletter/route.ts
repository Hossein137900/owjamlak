import { NextRequest, NextResponse } from "next/server";
import Newsletter from "@/models/newsletter";
import connect from "@/lib/data";
import mongoose from "mongoose";

interface NewsletterFilter {
  source?: string;
  isActive?: boolean;
}
interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  error?: string;
}

// GET - Retrieve all newsletter subscriptions
export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const source = searchParams.get("source");
    const isActive = searchParams.get("isActive");

    // Build filter object
    const filter: NewsletterFilter = {};
    if (source) filter.source = source;
    if (isActive !== null) filter.isActive = isActive === "true";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Newsletter.countDocuments(filter);

    // Get newsletters with pagination
    const newsletters = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: newsletters,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
        message: "خبرنامه‌ها با موفقیت دریافت شدند",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching newsletters:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات خبرنامه",
      },
      { status: 500 }
    );
  }
}

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { email, source = "footer" } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "لطفاً ایمیل خود را وارد کنید",
        },
        { status: 400 }
      );
    }

    // Check if email is valid
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "لطفاً یک ایمیل معتبر وارد کنید",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: "این ایمیل قبلاً در خبرنامه ثبت شده است",
          },
          { status: 409 }
        );
      } else {
        // Reactivate existing subscription
        existingSubscription.isActive = true;
        existingSubscription.source = source;
        await existingSubscription.save();

        return NextResponse.json(
          {
            success: true,
            message: "اشتراک شما مجدداً فعال شد",
            data: existingSubscription,
          },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    const newSubscription = new Newsletter({
      email: email.trim().toLowerCase(),
      source,
      isActive: true,
    });

    await newSubscription.save();

    return NextResponse.json(
      {
        success: true,
        message: "با تشکر! شما با موفقیت در خبرنامه ثبت نام شدید",
        data: newSubscription,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log("Error subscribing to newsletter:", error);

    // Handle duplicate key error (MongoDB)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "این ایمیل قبلاً در خبرنامه ثبت شده است",
        },
        { status: 409 }
      );
    }

    // Handle validation errors (Mongoose)
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError" &&
      "errors" in error
    ) {
      const validationError = error as unknown as {
        errors: Record<string, { message: string }>;
      };
      const messages = Object.values(validationError.errors).map(
        (err) => err.message
      );

      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: "خطا در اعتبارسنجی داده‌ها",
          errors: messages,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : "خطای نامشخص";

    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: "خطا در ثبت ایمیل در خبرنامه",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

// DELETE - Bulk delete newsletter subscriptions
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "لیست شناسه‌ها معتبر نیست",
        },
        { status: 400 }
      );
    }

    // Validate all ObjectIds
    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "هیچ شناسه معتبری یافت نشد",
        },
        { status: 400 }
      );
    }

    // Delete multiple subscriptions
    const result = await Newsletter.deleteMany({
      _id: { $in: validIds },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${result.deletedCount} اشتراک با موفقیت حذف شد`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error bulk deleting newsletter subscriptions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف گروهی اشتراک‌ها",
      },
      { status: 500 }
    );
  }
}
