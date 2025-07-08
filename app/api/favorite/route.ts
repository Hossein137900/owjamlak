import { NextRequest } from 'next/server';
import connect from "@/lib/data";
import { createFavorite, deleteFavorite, getAllFavorites, updateFavorite } from "@/middlewares/favorite";

export async function POST(req: NextRequest) {
    await connect();
    return await createFavorite(req);
}

export async function GET() {
    await connect();
    return await getAllFavorites();
}

export async function PATCH(req: NextRequest) {
    await connect();
    return await updateFavorite(req);
}

export async function DELETE(req: NextRequest) {
    await connect();
    return await deleteFavorite(req);
}