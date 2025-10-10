import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, unlink, rmdir, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/data';
import Video from '@/models/video';

type TokenPayload = {
  id?: string;
  _id?: string;
  role?: string;
};

function checkAdminAccess(token: string): { isValid: boolean; role?: string } {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const role = decoded.role;

    if (role === "admin" || role === "superadmin") {
      return { isValid: true, role };
    }
    return { isValid: false };
  } catch {
    return { isValid: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

    const { isValid, role } = checkAdminAccess(token);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "دسترسی محدود به ادمین و سوپرادمین" },
        { status: 403 }
      );
    }

    const { uploadId, filename, totalChunks, originalName, size, title, description, alt } = await request.json();

    if (!uploadId || !filename || !totalChunks) {
      return NextResponse.json(
        { success: false, message: "اطلاعات finalize ناقص است" },
        { status: 400 }
      );
    }

    // Read and combine chunks
    const tempDir = join(process.cwd(), 'temp', 'video-chunks', uploadId);
    const chunks: Buffer[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = join(tempDir, `chunk-${i}`);
      if (!existsSync(chunkPath)) {
        return NextResponse.json(
          { success: false, message: `Chunk ${i} missing` },
          { status: 400 }
        );
      }
      const chunkBuffer = await readFile(chunkPath);
      chunks.push(chunkBuffer);
    }

    // Combine chunks
    const finalBuffer = Buffer.concat(chunks);

    // Generate final filename
    const timestamp = Date.now();
    const extension = filename.split('.').pop() || 'mp4';
    const finalFilename = `video_${timestamp}.${extension}`;

    // Save to videos directory
    const videosDir = join(process.cwd(), 'public', 'uploads', 'videos');
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true });
    }

    const finalPath = join(videosDir, finalFilename);
    await writeFile(finalPath, finalBuffer);

    // Clean up temp files
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = join(tempDir, `chunk-${i}`);
      if (existsSync(chunkPath)) {
        await unlink(chunkPath);
      }
    }
    if (existsSync(tempDir)) {
      await rmdir(tempDir);
    }

    // Save to database
    await connectDB();
    const video = new Video({
      title: title || originalName?.replace(/\.[^/.]+$/, '') || finalFilename,
      description: description || `Video uploaded: ${originalName || finalFilename}`,
      alt: alt || originalName || finalFilename,
      src: `/api/videos/files/${finalFilename}`,
      filename: finalFilename,
      originalName: originalName || filename,
      size: size || finalBuffer.length,
      uploadedBy: role,
    });

    await video.save();

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت آپلود شد",
      filename: finalFilename,
      video,
    });

  } catch (error) {
    console.log('Error finalizing upload:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در finalize آپلود' },
      { status: 500 }
    );
  }
}