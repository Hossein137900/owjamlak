import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "data", "blogs.json");
    const fs = require("fs");

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(dataPath, "utf8");
    const blogs = JSON.parse(fileContent);

    return NextResponse.json(blogs);
  } catch (error) {
    console.log(error)
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      excerpt,
      description,
      seoTitle,
      content,
      contentHtml,
      images,
      tags,
    } = await request.json();

    // Use the correct field names
    const finalExcerpt = excerpt || description;
    const finalContent = contentHtml || content;

    // Validate required fields
    if (!title || !finalExcerpt || !seoTitle || !finalContent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate blog data
    const blogId = `blog_${Date.now()}`;
    const blogData = {
      id: blogId,
      title,
      excerpt: finalExcerpt,
      coverImage:
        images && images.length > 0 ? images[0] : "/assets/images/hero4.jpg",
      author: "مدیر سایت",
      date: new Date().toLocaleDateString("fa-IR"),
      readTime: `${Math.ceil(finalContent.split(" ").length / 200)} دقیقه`,
      category: "عمومی",
      contentHtml: finalContent,
      seoTitle,
      images: images || [],
      tags: tags || [],
      tableOfContents: [],
    };

    // Save to data file (you can replace this with database later)
    const dataPath = path.join(process.cwd(), "data", "blogs.json");

    try {
      const fs = require("fs");
      let existingBlogs = [];

      if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, "utf8");
        existingBlogs = JSON.parse(fileContent);
      }

      existingBlogs.push(blogData);

      await writeFile(dataPath, JSON.stringify(existingBlogs, null, 2));

      return NextResponse.json({
        success: true,
        message: "Blog created successfully",
        blogId,
      });
    } catch (fileError) {
      console.error("File operation error:", fileError);
      return NextResponse.json(
        { error: "Failed to save blog" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
