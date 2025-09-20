import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  id?: string;
  _id?: string;
};

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userId = decoded.id || decoded._id || '';
      if (!userId) throw new Error('Invalid token');
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images allowed' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size too large. Max 5MB allowed' }, { status: 400 });
    }

    // Validate filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileExtension = originalName.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create user-specific directory
    const userUploadsDir = join(process.cwd(), 'public', 'uploads', 'blog', userId);
    if (!existsSync(userUploadsDir)) {
      await mkdir(userUploadsDir, { recursive: true });
    }

    // Generate secure filename
    const timestamp = Date.now();
    const filename = `blog_${timestamp}_${originalName}`;
    const filePath = join(userUploadsDir, filename);

    // Write the file
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: `/uploads/blog/${userId}/${filename}`
    });
  } catch (error) {
    console.log('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}