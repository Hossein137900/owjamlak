import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Blog from "@/models/blog";

interface BlogUpdateData {
  title?: string;
  content?: string;
  seoTitle?: string;
  description?: string;
  tags?: string[];
  updatedAt: Date;
  image: string;
  readTime?: number;
  secondImage: string;
}

export async function DELETE(request: Request) {
  try {
    const id = request.headers.get("id");
    await connect();

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Error deleting blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const id = request.headers.get("id");
    const { title, content, seoTitle, image, secondImage, description, tags } =
      await request.json();
    await connect();

    // Filter out undefined values
    const updateData: BlogUpdateData = Object.fromEntries(
      Object.entries({
        title,
        content,
        seoTitle,
        description,
        tags,
        updatedAt: new Date(),
      }).filter(([value]) => value !== undefined)
    ) as BlogUpdateData;

    // Only update images if they are provided
    if (image !== undefined) updateData.image = image;
    if (secondImage !== undefined) updateData.secondImage = secondImage;

    // Recalculate read time if content is updated
    if (content) {
      updateData.readTime = Math.ceil(content.split(" ").length / 200);
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog updated successfully", blog },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating blog:", error);
    return NextResponse.json(
      { message: "Error updating blog" },
      { status: 500 }
    );
  }
}
