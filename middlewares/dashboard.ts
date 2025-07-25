import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import poster from "@/models/poster";
import realStateRequest from "@/models/realStateConsultation";
import legalConsultation from "@/models/legalConsultation";
import newsletter from "@/models/newsletter";
import employRequest from "@/models/employRequest";

export interface DashboardStats {
  propertyListings: number;
  realEstateRequests: number;
  legalRequests: number;
  employmentRequests: number;
  users: number;
  newsletterSubscribers: number;
}

interface JwtCustomPayload {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
}

export const getDashboardStats = async (request: NextRequest) => {
  try {
    await connect();

    // Check admin authentication
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token missing" },
        { status: 401 }
      );
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtCustomPayload;

      // You can add user role verification here if needed
      const user = await User.findById(decodedToken.id);
      if (user.role !== "superadmin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }
    } catch (authError) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Initialize stats object
    const stats: DashboardStats = {
      propertyListings: 0,
      realEstateRequests: 0,
      legalRequests: 0,
      employmentRequests: 0,
      users: 0,
      newsletterSubscribers: 0,
    };

    // TODO: Replace these with your actual database queries

    // 1. آگهی‌های ملک (Property Listings)
    const propertyCount = await poster.countDocuments();
    stats.propertyListings = propertyCount;

    // 2. درخواست‌های مشاوره املاک (Real Estate Consultation Requests)
    const realEstateCount = await realStateRequest.countDocuments();
    stats.realEstateRequests = realEstateCount;

    // 3. درخواست‌های مشاوره حقوقی (Legal Consultation Requests)
    const legalCount = await legalConsultation.countDocuments();
    stats.legalRequests = legalCount;

    // 4. درخواست‌های همکاری (Employment/Collaboration Requests)
    const employmentCount = await employRequest.countDocuments();
    stats.employmentRequests = employmentCount;

    // 5. کاربران (Users)
    const userCount = await User.countDocuments();
    stats.users = userCount;

    // 6. مشترکین خبرنامه (Newsletter Subscribers)
    const newsletterCount = await newsletter.countDocuments();
    stats.newsletterSubscribers = newsletterCount;

    return NextResponse.json(
      {
        success: true,
        data: stats,
        message: "Dashboard statistics retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت آمار داشبورد",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
};
