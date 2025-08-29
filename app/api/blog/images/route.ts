import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const MAX_SIZE = 30 * 1024 * 1024; // 30MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const imageType = formData.get('type') as string; // 'main' or 'second'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Security validations
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    if (!['main', 'second', 'additional'].includes(imageType)) {
      return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
    }

    // Create blog images directory
    const uploadDir = path.join(process.cwd(), 'public/uploads/blog');
    await mkdir(uploadDir, { recursive: true });

    // Generate secure filename with .webp extension
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^.]*$/, '');
    const filename = `blog_${imageType}_${timestamp}_${sanitizedName}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const imageUrl = `/uploads/blog/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      type: imageType
    });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}