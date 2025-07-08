import connect from "@/lib/data";
import Category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";

// app/api/categories/reorder/route.ts
export async function PATCH(req: NextRequest) {
  await connect();
  const updates = await req.json(); // Array of { _id, order }

  for (const { _id, order } of updates) {
    await Category.findByIdAndUpdate(_id, { order });
  }

  return NextResponse.json({ success: true });
}
