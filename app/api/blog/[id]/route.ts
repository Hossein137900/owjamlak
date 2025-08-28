import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: blogId } = await params;
    const body = await request.json();

    // Read existing blogs
    let blogs = [];
    if (fs.existsSync(BLOGS_FILE)) {
      const data = fs.readFileSync(BLOGS_FILE, 'utf8');
      blogs = JSON.parse(data);
    }

    // Find and update the blog
    const blogIndex = blogs.findIndex((blog: any) => blog.id === blogId);
    if (blogIndex === -1) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    blogs[blogIndex] = { ...blogs[blogIndex], ...body };

    // Save updated blogs
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));

    return NextResponse.json({ message: 'Blog updated successfully', blog: blogs[blogIndex] });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: blogId } = await params;

    // Read existing blogs
    let blogs = [];
    if (fs.existsSync(BLOGS_FILE)) {
      const data = fs.readFileSync(BLOGS_FILE, 'utf8');
      blogs = JSON.parse(data);
    }

    // Find the blog to delete
    const blogIndex = blogs.findIndex((blog: any) => blog.id === blogId);
    if (blogIndex === -1) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const blogToDelete = blogs[blogIndex];

    // Delete associated images
    const imagesToDelete = [];
    
    // Add cover image
    if (blogToDelete.coverImage && blogToDelete.coverImage.startsWith('/uploads/blog/')) {
      imagesToDelete.push(blogToDelete.coverImage);
    }
    
    // Add second image if exists
    if (blogToDelete.secondImage && blogToDelete.secondImage.startsWith('/uploads/blog/')) {
      imagesToDelete.push(blogToDelete.secondImage);
    }
    
    // Add all images from images array
    if (blogToDelete.images && Array.isArray(blogToDelete.images)) {
      blogToDelete.images.forEach((img: string) => {
        if (img.startsWith('/uploads/blog/')) {
          imagesToDelete.push(img);
        }
      });
    }

    // Delete image files
    imagesToDelete.forEach((imagePath: string) => {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    // Remove blog from array
    blogs.splice(blogIndex, 1);

    // Save updated blogs
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}