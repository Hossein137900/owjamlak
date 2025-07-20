import { NextResponse } from "next/server";
import Poster from "@/models/poster";
import User from "@/models/user";

export const getAllPosters = async (req?: Request) => {
  try {
    // 🔥 گرفتن مقادیر از هدر
    const headers = req?.headers;
    const page = parseInt(headers?.get("page") || "1");
    const limit = parseInt(headers?.get("limit") || "8");
    const parentType = headers?.get("parentType");
    const tradeType = headers?.get("tradeType");

    const skip = (page - 1) * limit;

    // 🔥 ساخت query بر اساس parentType و tradeType
    const query: any = {};
    if (parentType) {
      query.parentType = parentType;
    }
    if (tradeType) {
      query.tradeType = tradeType;
    }

    // 🔥 گرفتن تعداد کل
    const totalPosters = await Poster.countDocuments(query);

    // 🔥 دریافت آگهی‌ها
    const posters = await Poster.find(query)
      .populate({
        path: "user",
        model: User,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    console.log(posters);

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
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching posters", error },
      { status: 500 }
    );
  }
};

export const getPosterById = async (id: string) => {
  try {
    const poster = await Poster.findById(id).populate("user");
    if (!poster) {
      return NextResponse.json({ message: "آگهی پیدا نشد" }, { status: 404 });
    }

    poster.views = (poster.views || 0) + 1;
    await poster.save();
    return NextResponse.json(poster, { status: 200 });
  } catch (error) {
    console.log("Error fetching poster:", error);
    return NextResponse.json(
      { message: "Error fetching poster" },
      { status: 500 }
    );
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
    const { id, ...updateData } = await req.json();
    // Validate coordinates if they're being updated
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
    return NextResponse.json(poster);
  } catch (error) {
    console.log("Error updating poster:", error);
    return NextResponse.json(
      { message: "Error updating poster" },
      { status: 500 }
    );
  }
};

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

export const getPostersByCategory = async (categoryId: string) => {
  try {
    const posters = await Poster.find({ category: categoryId })
      .populate("category")
      .populate("user");
    return NextResponse.json(posters);
  } catch (error) {
    console.log("Error fetching posters by category:", error);
    return NextResponse.json(
      { message: "Error fetching posters by category" },
      { status: 500 }
    );
  }
};

export const getPostersByUser = async (userId: string) => {
  try {
    const posters = await Poster.find({ user: userId })
      .populate("category")
      .populate("user");
    return NextResponse.json(posters);
  } catch (error) {
    console.log("Error fetching posters by user:", error);
    return NextResponse.json(
      { message: "Error fetching posters by user" },
      { status: 500 }
    );
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
