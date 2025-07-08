import { NextResponse } from "next/server";
import Favorite from "@/models/favorite";

export const getAllFavorites = async () => {
  try {
    const favorites = await Favorite.find().populate("user").populate("posters");
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { message: "Error fetching favorites" },
      { status: 500 }
    );
  }
};

export const getFavoriteById = async (id: string) => {
  try {
    const favorite = await Favorite.findById(id).populate("user").populate("posters");
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error fetching favorite:", error);
    return NextResponse.json(
      { message: "Error fetching favorite" },
      { status: 500 }
    );
  }
};

export const createFavorite = async (req: Request) => {
  const token = req.headers.get("token");
  if (!token) {
    return NextResponse.json(
      { message: "Token Is Not Provided" },
      { status: 401 }
    );
  }
  try {
    const favoriteData = await req.json();
    const favorite = new Favorite(favoriteData);
    await favorite.save();
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error creating favorite:", error);
    return NextResponse.json(
      { message: "Error creating favorite" },
      { status: 500 }
    );
  }
};

export const updateFavorite = async (req: Request) => {
  try {
    const { id, ...updateData } = await req.json();
    const favorite = await Favorite.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error updating favorite:", error);
    return NextResponse.json(
      { message: "Error updating favorite" },
      { status: 500 }
    );
  }
};

export const deleteFavorite = async (req: Request) => {
  try {
    const { id } = await req.json();
    const favorite = await Favorite.findByIdAndDelete(id);
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { message: "Error deleting favorite" },
      { status: 500 }
    );
  }
};

export const getFavoritesByUser = async (userId: string) => {
  try {
    const favorites = await Favorite.find({ user: userId })
      .populate("user")
      .populate("posters");
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites by user:", error);
    return NextResponse.json(
      { message: "Error fetching favorites by user" },
      { status: 500 }
    );
  }
};

export const addPosterToFavorite = async (req: Request) => {
  try {
    const { favoriteId, posterId } = await req.json();
    const favorite = await Favorite.findByIdAndUpdate(
      favoriteId,
      { $addToSet: { posters: posterId } },
      { new: true }
    ).populate("user").populate("posters");
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error adding poster to favorite:", error);
    return NextResponse.json(
      { message: "Error adding poster to favorite" },
      { status: 500 }
    );
  }
};

export const removePosterFromFavorite = async (req: Request) => {
  try {
    const { favoriteId, posterId } = await req.json();
    const favorite = await Favorite.findByIdAndUpdate(
      favoriteId,
      { $pull: { posters: posterId } },
      { new: true }
    ).populate("user").populate("posters");
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error removing poster from favorite:", error);
    return NextResponse.json(
      { message: "Error removing poster from favorite" },
      { status: 500 }
    );
  }
};
