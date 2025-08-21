import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import { getPosterById } from "@/hooks/middlewares/poster";
import { unlink, rmdir } from 'fs/promises';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';
import { jwtDecode } from 'jwt-decode';
import Poster from '@/models/poster';

type TokenPayload = {
  id?: string;
  _id?: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Skip if it's an image file or not a valid ObjectId format
  if (!id || id.includes('.') || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid poster ID' }, { status: 400 });
  }
  
  await connect();
  return await getPosterById(req, id);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify user token
    const token = req.headers.get('token');
    if (!token) {
      return NextResponse.json({ success: false, message: 'توکن مورد نیاز است' }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userId = decoded.id || decoded._id || '';
      if (!userId) throw new Error('Invalid token');
    } catch {
      return NextResponse.json({ success: false, message: 'توکن نامعتبر است' }, { status: 401 });
    }

    await connect();
    
    // Get poster to verify ownership and get image info
    const poster = await Poster.findById(id);
    if (!poster) {
      return NextResponse.json({ success: false, message: 'آگهی یافت نشد' }, { status: 404 });
    }
    
    // Check if user owns this poster
    if (poster.user.toString() !== userId) {
      return NextResponse.json({ success: false, message: 'شما مجاز به حذف این آگهی نیستید' }, { status: 403 });
    }

    // Delete poster images from disk
    if (poster.images && poster.images.length > 0) {
      for (const image of poster.images) {
        if (image.url) {
          // Extract filename from URL: /api/images/userId/filename -> filename
          const filename = image.url.split('/').pop();
          if (filename) {
            const imagePath = join(process.cwd(), 'public', 'uploads', 'posters', userId, filename);
            if (existsSync(imagePath)) {
              await unlink(imagePath);
            }
          }
        }
      }
      
      // Remove directory if empty
      const userUploadsDir = join(process.cwd(), 'public', 'uploads', 'posters', userId);
      if (existsSync(userUploadsDir)) {
        const remainingFiles = readdirSync(userUploadsDir);
        if (remainingFiles.length === 0) {
          await rmdir(userUploadsDir);
        }
      }
    }

    // Delete poster from database
    await Poster.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: 'آگهی و تصاویر با موفقیت حذف شد' 
    });

  } catch (error) {
    console.error('Error deleting poster:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف آگهی' },
      { status: 500 }
    );
  }
}
