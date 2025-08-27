import { NextRequest, NextResponse } from "next/server";
import Poster from "@/models/poster";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { join } from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";

interface TokenPayload {
  id?: string;
  _id?: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

const validateImageFile = (file: File): ValidationResult => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "فرمت فایل مجاز نیست" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "حجم فایل بیش از حد مجاز است" };
  }

  return { valid: true };
};

export const getAllPosters = async (req: NextRequest) => {
  try {
    // 🔐 چک کردن توکن
    const token = req.headers.get("token");
    let hasToken = false;
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET!);
        hasToken = true;
      } catch {
        hasToken = false;
      }
    }

    // اگه توکن نداشت، فیلدهای حساس رو برنگردون
    const userSelect = hasToken ? "" : "-phone -password";
    const posterSelect = hasToken ? "" : "-contact";

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const parentType = searchParams.get("parentType") || "";
    const tradeType = searchParams.get("tradeType") || "";
    const type = searchParams.get("type") || "";
    const searchQuery = searchParams.get("query") || "";
    const isSuggestionMode = searchParams.get("suggestionsOnly") === "true";

    const skip = (page - 1) * limit;

    // 🔍 ساخت query
    const query: any = {};
    if (parentType) query.parentType = parentType;
    if (tradeType) query.tradeType = tradeType;
    if (type) query.type = type;

    // Only show approved posters for public view
    const isAdminRequest = req.headers.get("x-admin-request") === "true";
    if (!isAdminRequest) {
      query.isApproved = true;
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { address: { $regex: searchQuery, $options: "i" } },
        { neighborhood: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // ✅ حالت suggestions
    if (isSuggestionMode) {
      const suggestionsRaw = await Poster.find(query)
        .limit(10)
        .select("title")
        .lean();

      const suggestions = Array.from(
        new Set(suggestionsRaw.map((s) => s.title).filter(Boolean))
      ).slice(0, 5);

      return NextResponse.json({ suggestions });
    }

    // ✅ حالت عادی با paginate
    const totalPosters = await Poster.countDocuments(query);
    const posters = await Poster.find(query)
      .select(posterSelect)
      .populate({ path: "user", model: User, select: userSelect })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalPosters / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      posters,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosters,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching posters:", error);
    return NextResponse.json(
      { message: "Error fetching posters", error: error.message },
      { status: 500 }
    );
  }
};

export const getPosterById = async (req: NextRequest, id: string) => {
  try {
    // چک کردن توکن
    const token = req.headers.get("token");
    let hasToken = false;
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET!);
        hasToken = true;
      } catch {
        hasToken = false;
      }
    }

    // اگر توکن نداشت، شماره رو برنگردون
    const posterSelect = hasToken ? "" : "-contact";
    const userSelect = hasToken
      ? "" //
      : "-phone -password  ";

    const poster = await Poster.findById(id).select(posterSelect).populate({
      path: "user",
      select: userSelect,
    });

    if (!poster) {
      return NextResponse.json({ message: "آگهی پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(poster, { status: 200 });
  } catch (error) {
    console.error("Error fetching poster:", error);
    return NextResponse.json(
      { message: "خطا در دریافت اطلاعات آگهی" },
      { status: 500 }
    );
  }
};
export const incrementPosterView = async (req: Request) => {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing id" },
        { status: 400 }
      );
    }

    let updated;
    try {
      updated = await Poster.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
    } catch (dbError: any) {
      if (dbError.name === "CastError") {
        return NextResponse.json(
          { success: false, message: "Invalid poster ID" },
          { status: 400 }
        );
      }
      throw dbError;
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Poster not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, views: updated.views });
  } catch (error) {
    console.error("Error incrementing poster view:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

export const createPoster = async (req: Request) => {
  const token = req.headers.get("token");
  if (!token) {
    return NextResponse.json(
      { message: "خطا در ثبت آگهی .لطفا وارد شوید" },
      { status: 401 }
    );
  }
  try {
    const posterData = await req.json();
    // Validate coordinates
    if (
      !posterData.coordinates ||
      !posterData.coordinates.lat ||
      !posterData.coordinates.lng
    ) {
      return NextResponse.json(
        { message: "موقعیت جغرافیایی الزامی است" },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    const { lat, lng } = posterData.coordinates;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { message: "مختصات جغرافیایی نامعتبر است" },
        { status: 400 }
      );
    }
    console.log(posterData);
    const poster = new Poster(posterData);
    await poster.save();
    return NextResponse.json(poster);
  } catch (error) {
    console.log("Error creating poster:", error);
    return NextResponse.json({ message: "خطا در ساخت آگهی" }, { status: 500 });
  }
};

export const updatePoster = async (req: Request) => {
  try {
    const token = req.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type");
    const isFormData = contentType?.includes("multipart/form-data");

    if (isFormData) {
      // Handle FormData (with new images)
      let userId: string;
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        userId = decoded.id || decoded._id || "";
        if (!userId) throw new Error("Invalid token");
      } catch {
        return NextResponse.json(
          { success: false, message: "توکن نامعتبر است" },
          { status: 401 }
        );
      }

      const formData = await req.formData();
      const posterId = formData.get("id") as string;

      if (!posterId) {
        return NextResponse.json(
          { success: false, message: "شناسه آگهی مورد نیاز است" },
          { status: 400 }
        );
      }

      // Create user-specific uploads directory
      const uploadsDir = join(
        process.cwd(),
        "public",
        "uploads",
        "posters",
        userId
      );
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Process uploaded images
      const imageFiles = formData.getAll("images") as File[];
      const uploadedImages = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file.size > 0) {
          const validation = validateImageFile(file);
          if (!validation.valid) {
            return NextResponse.json(
              { success: false, message: validation.error },
              { status: 400 }
            );
          }

          const timestamp = Date.now();
          const extension = "webp";
          const filename = `${posterId}_${timestamp}_${i}_image.${extension}`;
          const filepath = join(uploadsDir, filename);

          const bytes = await file.arrayBuffer();
          await writeFile(filepath, Buffer.from(bytes));

          const imageDataKey = `imageData_${i}`;
          const imageData = formData.get(imageDataKey);
          const metadata = imageData ? JSON.parse(imageData as string) : {};

          uploadedImages.push({
            alt: metadata.alt || `تصویر ${i + 1}`,
            url: `/api/images/${userId}/${filename}`,
            mainImage: metadata.mainImage || false,
          });
        }
      }

      // Prepare update data from FormData
      const updateData: any = {};

      if (formData.get("title")) updateData.title = formData.get("title");
      if (formData.get("description"))
        updateData.description = formData.get("description");
      if (formData.get("buildingDate"))
        updateData.buildingDate = Number(formData.get("buildingDate"));
      if (formData.get("area")) updateData.area = Number(formData.get("area"));
      if (formData.get("rooms"))
        updateData.rooms = Number(formData.get("rooms"));
      if (formData.get("parentType"))
        updateData.parentType = formData.get("parentType");
      if (formData.get("tradeType"))
        updateData.tradeType = formData.get("tradeType");

      if (
        formData.get("totalPrice") &&
        !isNaN(Number(formData.get("totalPrice")))
      ) {
        updateData.totalPrice = Number(formData.get("totalPrice"));
      }
      if (
        formData.get("pricePerMeter") &&
        !isNaN(Number(formData.get("pricePerMeter")))
      ) {
        updateData.pricePerMeter = Number(formData.get("pricePerMeter"));
      }
      if (
        formData.get("depositRent") &&
        !isNaN(Number(formData.get("depositRent")))
      ) {
        updateData.depositRent = Number(formData.get("depositRent"));
      }
      if (
        formData.get("rentPrice") &&
        !isNaN(Number(formData.get("rentPrice")))
      ) {
        updateData.rentPrice = Number(formData.get("rentPrice"));
      }

      if (formData.get("convertible"))
        updateData.convertible = formData.get("convertible") === "true";
      if (formData.get("location"))
        updateData.location = formData.get("location");
      if (formData.get("coordinates")) {
        const coordinates = JSON.parse(formData.get("coordinates") as string);
        const { lat, lng } = coordinates;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          return NextResponse.json(
            { message: "مختصات جغرافیایی نامعتبر است" },
            { status: 400 }
          );
        }
        updateData.coordinates = coordinates;
      }
      if (formData.get("locationDetails"))
        updateData.locationDetails = JSON.parse(
          formData.get("locationDetails") as string
        );
      if (formData.get("contact")) updateData.contact = formData.get("contact");
      if (formData.get("storage"))
        updateData.storage = formData.get("storage") === "true";
      if (formData.get("floor"))
        updateData.floor = Number(formData.get("floor"));
      if (formData.get("parking"))
        updateData.parking = formData.get("parking") === "true";
      if (formData.get("lift"))
        updateData.lift = formData.get("lift") === "true";
      if (formData.get("balcony"))
        updateData.balcony = formData.get("balcony") === "true";
      if (formData.get("type")) updateData.type = formData.get("type");
      if (formData.get("status")) updateData.status = formData.get("status");

      // Add new images to existing ones
      if (uploadedImages.length > 0) {
        const existingPoster = await Poster.findById(posterId);
        if (existingPoster) {
          updateData.images = [
            ...(existingPoster.images || []),
            ...uploadedImages,
          ];
        } else {
          updateData.images = uploadedImages;
        }
      }

      const poster = await Poster.findByIdAndUpdate(posterId, updateData, {
        new: true,
      });

      if (!poster) {
        return NextResponse.json(
          { success: false, message: "آگهی پیدا نشد" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "آگهی با موفقیت بروزرسانی شد",
        data: poster,
      });
    } else {
      // Handle JSON (without new images)
      const { id, ...updateData } = await req.json();

      if (updateData.coordinates) {
        const { lat, lng } = updateData.coordinates;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          return NextResponse.json(
            { message: "مختصات جغرافیایی نامعتبر است" },
            { status: 400 }
          );
        }
      }

      const poster = await Poster.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!poster) {
        return NextResponse.json(
          { success: false, message: "آگهی پیدا نشد" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "آگهی با موفقیت بروزرسانی شد",
        data: poster,
      });
    }
  } catch (error) {
    console.log("خطا در ویرایش:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش" },
      { status: 500 }
    );
  }
};
// export const updatePoster = async (req: Request) => {
//   try {
//     const { id, ...updateData } = await req.json();
//      if (updateData.coordinates) {
//       const { lat, lng } = updateData.coordinates;
//       if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
//         return NextResponse.json(
//           { message: "مختصات جغرافیایی نامعتبر است" },
//           { status: 400 }
//         );
//       }
//     }
//     const poster = await Poster.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });
//     return NextResponse.json(poster);
//   } catch (error) {
//     console.log("خطا در ویرایش:", error);
//     return NextResponse.json(
//       { message: "خطا در ویرایش" },
//       { status: 500 }
//     );
//   }
// };

export const deletePoster = async (req: Request) => {
  try {
    const { id } = await req.json();
    const poster = await Poster.findByIdAndDelete(id);
    return NextResponse.json(poster);
  } catch (error) {
    console.log("Error deleting poster:", error);
    return NextResponse.json(
      { message: "Error deleting poster" },
      { status: 500 }
    );
  }
};

export const getPostersByUser = async (req: Request) => {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization header is missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as { id: string }; // 👈 تایپ اختیاری
    const userId = decoded.id; // 👈 بسته به اینکه توکن رو چطور ساختی
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in token" },
        { status: 400 }
      );
    }

    // ✅ گرفتن تعداد آگهی‌ها
    const count = await Poster.countDocuments({ user: userId });

    // ✅ گرفتن لیست آگهی‌ها
    // const posters = await Poster.find({ user: userId })
    //   .populate("user", "_id name phone")
    //   .sort({ createdAt: -1 })
    //   .lean();

    return NextResponse.json(
      {
        total: count,
        // posters: posters,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error fetching posters by user:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

// New function to get posters near a location
export const getPostersNearLocation = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get("lat") || "0");
    const lng = parseFloat(url.searchParams.get("lng") || "0");
    const radius = parseInt(url.searchParams.get("radius") || "10"); // Default 10km
    const limit = parseInt(url.searchParams.get("limit") || "20");

    if (!lat || !lng) {
      return NextResponse.json(
        { message: "مختصات جغرافیایی الزامی است" },
        { status: 400 }
      );
    }

    const posters = await Poster.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    })
      .populate("user")
      .limit(limit);

    return NextResponse.json(posters);
  } catch (error) {
    console.log("Error fetching nearby posters:", error);
    return NextResponse.json(
      { message: "Error fetching nearby posters" },
      { status: 500 }
    );
  }
};

// export const getConsultantPosterCount = async (consultantId: string) => {
//   const consultant = await Consultant.findById(consultantId).lean();
//   if (!consultant) throw new Error("مشاور پیدا نشد");

//   // یوزری که این مشاور بهش وصله
//   const userId = consultant.user;

//   const count = await Poster.countDocuments({ user: userId });
//   return count;
// };
