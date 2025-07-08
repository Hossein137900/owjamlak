import { NextResponse } from "next/server";
import Poster from "@/models/poster";
import User from "@/models/user";

export const getAllPosters = async (req?: Request) => {
  try {
    // Get pagination parameters from query string
    const url = new URL(req?.url || 'http://localhost:3000');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination info
    const totalPosters = await Poster.countDocuments();
    
    // Get paginated posters
    const posters = await Poster.find()
      .populate({
        path: "user",
        model: User
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination metadata
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
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching posters:", error);
    return NextResponse.json(
      { message: "Error fetching posters" },
      { status: 500 }
    );
  }
};


export const getPosterById = async (id: string) => {
  try {
    const poster = await Poster.findById(id).populate("user");
    return NextResponse.json(poster);
  } catch (error) {
    console.error("Error fetching poster:", error);
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
      { message: "Token Is Not Privider" },
      { status: 401 }
    );
  }
  try {
    const posterData = await req.json();
    console.log(posterData)
    const poster = new Poster(posterData);
    await poster.save();
    return NextResponse.json(poster);
  } catch (error) {
    console.error("Error creating poster:", error);
    return NextResponse.json(
      { message: "خطا در ساخت آگهی" },
      { status: 500 }
    );
  }
};

export const updatePoster = async (req: Request) => {
  try {
    const { id, ...updateData } = await req.json();
    const poster = await Poster.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json(poster);
  } catch (error) {
    console.error("Error updating poster:", error);
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
    console.error("Error deleting poster:", error);
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
    console.error("Error fetching posters by category:", error);
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
    console.error("Error fetching posters by user:", error);
    return NextResponse.json(
      { message: "Error fetching posters by user" },
      { status: 500 }
    );
  }
};
