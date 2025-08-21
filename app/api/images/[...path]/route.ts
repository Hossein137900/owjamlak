import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
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

    if (!/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
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
    
    const contentType = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    }[ext || 'jpg'] || 'image/jpeg';

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