import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, readFile, unlink, rmdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id?: string;
  _id?: string;
};

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

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

    const { uploadId, originalFilename } = await request.json();

    if (!uploadId || !originalFilename) {
      return NextResponse.json(
        { success: false, message: "پارامترهای مورد نیاز ناقص است" },
        { status: 400 }
      );
    }

    // Get chunks directory
    const tempDir = join(process.cwd(), "temp", "video-chunks", userId, uploadId);
    
    if (!existsSync(tempDir)) {
      return NextResponse.json(
        { success: false, message: "قطعات آپلود یافت نشد" },
        { status: 404 }
      );
    }

    // Read and sort chunk files
    const chunkFiles = await readdir(tempDir);
    const sortedChunks = chunkFiles
      .filter(file => file.startsWith('chunk_'))
      .sort((a, b) => {
        const aIndex = parseInt(a.replace('chunk_', ''));
        const bIndex = parseInt(b.replace('chunk_', ''));
        return aIndex - bIndex;
      });

    // Create final video file
    const userDir = join(process.cwd(), "public", "uploads", "posters", userId);
    if (!existsSync(userDir)) {
      await mkdir(userDir, { recursive: true });
    }

    const extension = originalFilename.split(".").pop() || "mp4";
    const finalFilename = `poster_${Date.now()}_video.${extension}`;
    const finalPath = join(userDir, finalFilename);

    // Combine chunks
    const chunks: Buffer[] = [];
    for (const chunkFile of sortedChunks) {
      const chunkPath = join(tempDir, chunkFile);
      const chunkData = await readFile(chunkPath);
      chunks.push(chunkData);
    }

    const finalBuffer = Buffer.concat(chunks);
    await writeFile(finalPath, finalBuffer);

    // Clean up temp files
    for (const chunkFile of sortedChunks) {
      const chunkPath = join(tempDir, chunkFile);
      await unlink(chunkPath);
    }
    await rmdir(tempDir);

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت آپلود شد",
      filename: finalFilename,
    });

  } catch (error) {
    console.log("Error finalizing upload:", error);
    return NextResponse.json(
      { success: false, message: "خطا در نهاییسازی آپلود" },
      { status: 500 }
    );
  }
}