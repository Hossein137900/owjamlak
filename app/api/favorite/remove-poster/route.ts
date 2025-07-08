import { NextRequest } from 'next/server';
import connect from "@/lib/data";
import { removePosterFromFavorite } from "@/middlewares/favorite";

export async function PATCH(req: NextRequest) {
    await connect();
    return await removePosterFromFavorite(req);
}