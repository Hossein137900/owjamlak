import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import {
  createPoster,
  deletePoster,
  getAllPosters,
  updatePoster,
} from "@/middlewares/poster";
import Poster from "@/models/poster";

export async function POST(req: NextRequest) {
  await connect();
  return await createPoster(req);
}

export async function GET() {
  await connect();
  return await getAllPosters();
}

export async function PATCH(req: NextRequest) {
  await connect();
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // Handle view increment
  if (action === "view") {
    try {
      const { posterId, viewerIdentifier } = await req.json();

      if (!posterId || !viewerIdentifier) {
        return NextResponse.json(
          { error: "Poster ID and viewer identifier are required" },
          { status: 400 }
        );
      }

      // Atomically find the poster and update it if the viewer is unique
      const updatedPoster = await Poster.findOneAndUpdate(
        { _id: posterId, viewedBy: { $ne: viewerIdentifier } },
        {
          $inc: { views: 1 },
          $push: { viewedBy: viewerIdentifier },
        },
        { new: true } // Return the updated document
      );

      if (updatedPoster) {
        // A new view was successfully added.
        return NextResponse.json({
          success: true,
          views: updatedPoster.views,
          message: "View count updated.",
        });
      } else {
        // No update happened. This could be because the user already viewed it, or the poster doesn't exist.
        const poster = await Poster.findById(posterId);
        if (!poster) {
          return NextResponse.json(
            { error: "Poster not found" },
            { status: 404 }
          );
        }
        // Poster exists, but the user has already viewed it.
        return NextResponse.json({
          success: false,
          views: poster.views,
          message: "Already viewed.",
        });
      }
    } catch (error) {
      console.error("Error updating views:", error);
      return NextResponse.json(
        { error: "Failed to update views" },
        { status: 500 }
      );
    }
  }

  // Handle regular updates
  return await updatePoster(req);
}

export async function DELETE(req: NextRequest) {
  await connect();
  return await deletePoster(req);
}
