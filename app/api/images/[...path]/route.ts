import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const [userId, filename] = path;
    
    if (!userId || !filename) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Security: Validate userId and filename
    if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
      return new NextResponse('Invalid user ID', { status: 400 });
    }

    // More flexible filename validation - allow files without extensions but check if they exist
    if (!/^[a-zA-Z0-9._-]+$/i.test(filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, ''))) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // Security: Prevent path traversal
    if (userId.includes('..') || filename.includes('..') || 
        userId.includes('/') || userId.includes('\\') ||
        filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid path characters', { status: 400 });
    }

    // Build and validate the image path
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'posters');
    const userDir = join(uploadsDir, userId);
    const imagePath = join(userDir, filename);
    
    // Security: Ensure the resolved path is within uploads directory
    const resolvedPath = resolve(imagePath);
    const resolvedUploadsDir = resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return new NextResponse('Access denied', { status: 403 });
    }
    
    if (!existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const imageBuffer = await readFile(imagePath);
    const ext = filename.split('.').pop()?.toLowerCase();
    
    // Determine content type based on file extension or default to jpeg
    let contentType = 'image/jpeg';
    if (ext) {
      contentType = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp'
      }[ext] || 'image/jpeg';
    } else {
      // If no extension, try to detect from file content (first few bytes)
      const header = imageBuffer.slice(0, 4);
      if (header[0] === 0xFF && header[1] === 0xD8) {
        contentType = 'image/jpeg';
      } else if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
        contentType = 'image/png';
      } else if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
        contentType = 'image/gif';
      }
    }

    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE - Remove image
export async function DELETE(request: NextRequest) {
  try {
    const { posterId, imageUrl } = await request.json();

    if (!posterId || !imageUrl) {
      return NextResponse.json(
        { success: false, message: "شناسه آگهی و URL تصویر مورد نیاز است" },
        { status: 400 }
      );
    }

    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    if (!filename) {
      return NextResponse.json(
        { success: false, message: "نام فایل نامعتبر است" },
        { status: 400 }
      );
    }

    // Construct file path
    const filePath = join(process.cwd(), "public", "uploads", filename);

    // Delete file if it exists
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return NextResponse.json({
      success: true,
      message: "تصویر با موفقیت حذف شد"
    });

  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف تصویر" },
      { status: 500 }
    );
  }
}