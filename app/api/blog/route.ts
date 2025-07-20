import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Blog from "@/models/blog";
import User from "@/models/user";

export async function GET() {
  try {
    await connect();
    const blogs = await Blog.find().populate({
      path: "userId",
      model: User,
      select: "username name",
    }).sort({ createdAt: -1 });
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.log("Error fetching blogs:", error);
    return NextResponse.json(
      { message: "Error fetching blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // const token = request.headers.get("token");
  // if (!token) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  
  // interface JwtPayloadWithId {
  //   id: string;
  // }
  
  // const decodedToken = jwt.verify(
  //   token,
  //   process.env.JWT_SECRET || "msl"
  // ) as JwtPayloadWithId;
  
  // if (!decodedToken) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  
  // const userId = decodedToken.id;
  // if (!userId) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  
  const { title, description, image, secondImage, tags, seoTitle, content } =
    await request.json();
    
  try {
    await connect();
    const newBlog = new Blog({
      title,
      seoTitle,
      content,
      tags,
      description,
      image,
      secondImage,
      userId: "654702904c320b4300d71406",
      readTime: Math.ceil(content.split(" ").length / 200),
    });

    await newBlog.save();
    return NextResponse.json(
      { message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating blog:", error);
    return NextResponse.json(
      { message: "Error creating blog" },
      { status: 500 }
    );
  }
}
