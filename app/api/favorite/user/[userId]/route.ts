import { NextRequest, NextResponse } from 'next/server';
import connect from "@/lib/data";
import { getFavoritesByUser } from "@/middlewares/favorite";

export async function GET(req: NextRequest) {
    await connect();
    try{
        const userId = req.url.split('/').pop(); // Extract the user ID from the URL
        if (!userId) {
            return NextResponse.json(
              { message: "User ID is required" },
              { status: 400 }
            );
        }
       return await getFavoritesByUser(userId);  
    }
    catch(error){
        console.error("Error fetching favorites by user:", error);
        return NextResponse.json(
          { message: "Error fetching favorites by user" },
          { status: 500 }
        );
    }
}