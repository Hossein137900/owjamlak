import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// GET - Serve poster video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; filename: string }> }
) {
  try {
    const { userId, filename } = await params;

    if (!userId || !filename) {
      return NextResponse.json(
        { error: "User ID and filename required" },
        { status: 400 }
      );
    }

    const filepath = join(
      process.cwd(),
      "public",
      "uploads",
      "posters",
      userId,
      filename
    );

    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    const videoBuffer = await readFile(filepath);
    const extension = filename.split('.').pop()?.toLowerCase();
    
    let contentType = "video/mp4";
    switch (extension) {
      case "webm":
        contentType = "video/webm";
        break;
      case "ogg":
        contentType = "video/ogg";
        break;
      case "avi":
        contentType = "video/x-msvideo";
        break;
      case "mov":
        contentType = "video/quicktime";
        break;
    }

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });

  } catch (error) {
    console.error("Error serving video:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}