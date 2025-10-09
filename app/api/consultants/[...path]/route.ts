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
    const [filename] = path;
    
    if (!filename) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Security: Validate filename
    if (!/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // Security: Prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid path characters', { status: 400 });
    }

    // Build and validate the image path
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'consultants');
    const imagePath = join(uploadsDir, filename);
    
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
    
    // Determine content type based on file extension
    const contentTypeMap = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    const contentType = ext && ext in contentTypeMap ? contentTypeMap[ext as keyof typeof contentTypeMap] : 'image/jpeg';

    const response = new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Content-Length': imageBuffer.length.toString(),
      },
    });
    
    return response;

  } catch (error) {
    console.log('Error serving consultant image:', error);
    return new NextResponse('', { status: 500 });
  }
}