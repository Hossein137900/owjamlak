import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = join(process.cwd(), 'public', 'uploads', ...path);
  
  if (!existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const file = await readFile(filePath);
  const ext = path[path.length - 1].split('.').pop()?.toLowerCase();
  
  const contentType = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
  }[ext || ''] || 'application/octet-stream';

  return new NextResponse(file, {
    headers: { 'Content-Type': contentType },
  });
}