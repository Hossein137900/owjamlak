import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import ContactMessage from "@/models/contactForm";

// GET - Fetch all messages or testimonials
export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const testimonials = searchParams.get("testimonials");

    let filter = {};

    // If requesting testimonials only
    if (testimonials === "true") {
      filter = {
        status: "accepted",
        isTestimonial: true,
      };
    }

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت پیام‌ها",
      },
      { status: 500 }
    );
  }
}

// PATCH - Update message status for testimonials
export async function PATCH(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { messageId, status, rating, isTestimonial, adminNote } = body;

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه پیام الزامی است",
        },
        { status: 400 }
      );
    }

    if (!["accepted", "declined", "pending"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "وضعیت نامعتبر است",
        },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      adminNote: adminNote || "",
    };

    // Set fields based on status
    if (status === "accepted") {
      updateData.acceptedAt = new Date();
      updateData.declinedAt = null;
      if (rating) updateData.rating = rating;
      if (isTestimonial !== undefined) updateData.isTestimonial = isTestimonial;
    } else if (status === "declined") {
      updateData.declinedAt = new Date();
      updateData.acceptedAt = null;
      updateData.isTestimonial = false;
      updateData.rating = null;
    } else {
      updateData.acceptedAt = null;
      updateData.declinedAt = null;
      updateData.isTestimonial = false;
      updateData.rating = null;
    }

    const contact = await ContactMessage.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true }
    );

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "پیام یافت نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `پیام با موفقیت ${
        status === "accepted"
          ? "تایید"
          : status === "declined"
          ? "رد"
          : "به حالت انتظار تغییر"
      } شد`,
      data: contact,
    });
  } catch (error) {
    console.error("Error updating message status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در به‌روزرسانی وضعیت پیام",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific message
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه پیام الزامی است",
        },
        { status: 400 }
      );
    }

    const contact = await ContactMessage.findByIdAndDelete(messageId);

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "پیام یافت نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "پیام با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف پیام",
      },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    const {  name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "فیلدهای ضروری خالی هستند" },
        { status: 400 }
      );
    }

    const doc = await ContactMessage.create({
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: "خطا در ذخیره پیام" }, { status: 500 });
  }
}
