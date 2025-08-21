// middlewares/dashboard.ts - Updated version
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import poster from "@/models/poster";
import realStateRequest from "@/models/realStateConsultation";
import legalConsultation from "@/models/legalConsultation";
import newsletter from "@/models/newsletter";
import employRequest from "@/models/employRequest";

interface JwtCustomPayload {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
}

export const getDashboardData = async (request: NextRequest) => {
  try {
    await connect();

    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن یافت نشد" },
        { status: 401 }
      );
    }

    let decodedToken: JwtCustomPayload;
    try {
      decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtCustomPayload;
    } catch {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    const { role } = user;

    // برای کاربران عادی و مشاوران - فقط آمار شخصی
    if (role === "user" || role === "consultant") {
      const userPosters = await poster.countDocuments({ user: user._id });
      const favoriteCount = user.favorite ? user.favorite.length : 0;

      return NextResponse.json({
        success: true,
        data: {
          userInfo: {
            name: user.name,
            role: user.role,
            phone: user.phone,
            createdAt: user.createdAt,
          },
          myPosters: userPosters,
          myFavorites: favoriteCount,
        },
        message: "اطلاعات شخصی با موفقیت دریافت شد",
      });
    }

    // برای ادمین و سوپر ادمین - آمار کامل
    if (role === "admin" || role === "superadmin") {
      const [
        propertyListings,
        realEstateRequests,
        legalRequests,
        employmentRequests,
        users,
        newsletterSubscribers,
      ] = await Promise.all([
        poster.countDocuments(),
        realStateRequest.countDocuments(),
        legalConsultation.countDocuments(),
        employRequest.countDocuments(),
        User.countDocuments(),
        newsletter.countDocuments(),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          userInfo: {
            name: user.name,
            role: user.role,
            phone: user.phone,
            createdAt: user.createdAt,
          },
          propertyListings,
          realEstateRequests,
          legalRequests,
          employmentRequests,
          users,
          newsletterSubscribers,
        },
        message: "آمار داشبورد با موفقیت دریافت شد",
      });
    }

    return NextResponse.json(
      { success: false, message: "دسترسی غیرمجاز" },
      { status: 403 }
    );
  } catch (error) {
    console.error("خطا در دریافت اطلاعات داشبورد:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت اطلاعات داشبورد" },
      { status: 500 }
    );
  }
};
