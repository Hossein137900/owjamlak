import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import jwt from 'jsonwebtoken';

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

    const { isValid } = checkAdminAccess(token);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "دسترسی محدود به ادمین و سوپرادمین" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    const uploadId = formData.get('uploadId') as string;
    const filename = formData.get('filename') as string;

    if (!chunk || isNaN(chunkIndex) || isNaN(totalChunks) || !uploadId || !filename) {
      return NextResponse.json(
        { success: false, message: "اطلاعات chunk ناقص است" },
        { status: 400 }
      );
    }

    // Create temp directory for chunks
    const tempDir = join(process.cwd(), 'temp', 'video-chunks', uploadId);
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Save chunk
    const chunkPath = join(tempDir, `chunk-${chunkIndex}`);
    const chunkBuffer = await chunk.arrayBuffer();
    await writeFile(chunkPath, Buffer.from(chunkBuffer));

    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded`,
    });

  } catch (error) {
    console.log('Error uploading chunk:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در آپلود chunk' },
      { status: 500 }
    );
  }
}