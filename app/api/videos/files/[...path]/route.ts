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
    if (!/^[a-zA-Z0-9._-]+$/i.test(filename.replace(/\.(mp4|webm|avi|mov|mkv|mpeg)$/i, ''))) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // Security: Prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid path characters', { status: 400 });
    }

    // Build and validate the video path
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos');
    const videoPath = join(uploadsDir, filename);
    
    // Security: Ensure the resolved path is within uploads directory
    const resolvedPath = resolve(videoPath);
    const resolvedUploadsDir = resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return new NextResponse('Access denied', { status: 403 });
    }
    
    if (!existsSync(videoPath)) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const videoBuffer = await readFile(videoPath);
    const ext = filename.split('.').pop()?.toLowerCase();
    
    // Determine content type based on file extension
    let contentType = 'video/mp4';
    if (ext) {
      contentType = {
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'mkv': 'video/x-matroska',
        'mpeg': 'video/mpeg'
      }[ext] || 'video/mp4';
    }

    return new NextResponse(new Uint8Array(videoBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.log('Error serving video:', error);
    return new NextResponse('', { status: 500 });
  }
}