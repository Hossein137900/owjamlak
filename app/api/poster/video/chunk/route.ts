import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

    const formData = await request.formData();
    const chunk = formData.get("chunk") as File;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string);
    const totalChunks = parseInt(formData.get("totalChunks") as string);
    const uploadId = formData.get("uploadId") as string;

    if (!chunk || isNaN(chunkIndex) || isNaN(totalChunks) || !uploadId) {
      return NextResponse.json(
        { success: false, message: "پارامترهای مورد نیاز ناقص است" },
        { status: 400 }
      );
    }

    // Create temp directory for chunks
    const tempDir = join(process.cwd(), "temp", "video-chunks", userId, uploadId);
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Save chunk
    const chunkFilename = `chunk_${chunkIndex.toString().padStart(4, '0')}`;
    const chunkPath = join(tempDir, chunkFilename);
    
    const bytes = await chunk.arrayBuffer();
    await writeFile(chunkPath, Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      message: `قطعه ${chunkIndex + 1} از ${totalChunks} آپلود شد`,
      chunkId: chunkFilename,
    });

  } catch (error) {
    console.log("Error uploading chunk:", error);
    return NextResponse.json(
      { success: false, message: "خطا در آپلود قطعه" },
      { status: 500 }
    );
  }
}