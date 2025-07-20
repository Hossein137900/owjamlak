import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import images from "@/models/images";

const NEXT_BASE_API_URL = process.env.NEXT_BASE_API_URL;

export async function GET() {
  if (!NEXT_BASE_API_URL) {
    return new NextResponse("Missing NEXT_BASE_API_URL env variable", {
      status: 500,
    });
  }
  await connectToDatabase();
  if (!connectToDatabase) {
    return new NextResponse("Unable to connect to database", { status: 500 });
  }
  try {
    const allImages = await images.find();
    return new NextResponse(JSON.stringify(allImages), { status: 200 });
  } catch (error) {
    console.log(error);

    return new NextResponse("Error fetching image documents", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { files } = await req.json();

    const newImages = files.map(
      (file: {
        name: string;
        url: string;
        type: string;
        category: string;
      }) => ({
        name: file.name,
        url: file.url,
        type: file.type,
        category: file.category,
      })
    );

    const insertedImages = await images.insertMany(newImages);

    return new NextResponse(JSON.stringify(insertedImages), { status: 200 });
  } catch (error) {
    console.log("Error saving image document:", error);
    return new NextResponse("Error saving image document", { status: 500 });
  }
}
