import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blog";
import connect from "@/lib/data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single blog by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    // Await the params Promise
    const { id } = await params;

    const blog = await Blog.findById(id).populate("userId", "name username");

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching blog" },
      { status: 500 }
    );
  }
}

// PUT - Update blog by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    // Await the params Promise
    const { id } = await params;

    const { title, content, seoTitle, description, tags } =
      await request.json();

    interface BlogUpdateData {
      title?: string;
      content?: string;
      seoTitle?: string;
      description?: string;
      tags?: string[];
      updatedAt: Date;
    }

    const updateData: BlogUpdateData = {
      title,
      content,
      seoTitle,
      description,
      tags,
      updatedAt: new Date(),
    };

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, message: "Error updating blog" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connect();

    // Await the params Promise
    const { id } = await params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting blog" },
      { status: 500 }
    );
  }
}
