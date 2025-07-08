// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import { slugify } from "@/utils/slugify";
import Category from "../../../models/category";

export async function GET() {
  await connect();
  const categories = await Category.find().sort({ order: 1 });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  await connect();
  const { name, parentId, level } = await req.json();

  const slug = {
    fa: slugify(name.fa),
    en: slugify(name.en),
  };

  const category = new Category({
    name,
    slug,
    parent: parentId || null,
    level,
    order: 0,
  });

  await category.save();
  return NextResponse.json({ success: true, category });
}
