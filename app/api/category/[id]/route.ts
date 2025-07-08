import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/category";
import connect from "@/lib/data";
import { slugify } from "@/utils/slugify";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();

  try {
    const category = await Category.findById(params.id)
      .populate("parent", "name slug")
      .populate("children", "name slug");

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const { name, parentId, level } = await req.json();

  const slug = {
    fa: slugify(name.fa),
    en: slugify(name.en),
  };

  await Category.findByIdAndUpdate(params.id, {
    name,
    slug,
    parent: parentId || null,
    level,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
