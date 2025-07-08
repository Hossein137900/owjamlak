import { NextRequest } from 'next/server';
import connect from "@/lib/data";
import { createPoster, deletePoster, getAllPosters, updatePoster } from "@/middlewares/poster";

export async function POST(req: NextRequest) {
    await connect();
    return await createPoster(req);
}

export async function GET() {
    await connect();
    return await getAllPosters();
}

export async function PATCH(req: NextRequest) {
    await connect();
    return await updatePoster(req);
}

export async function DELETE(req: NextRequest) {
    await connect();
    return await deletePoster(req);
}