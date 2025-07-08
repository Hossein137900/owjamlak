import connect from "@/lib/data";
import { getRequestById } from "@/middlewares/employRequest";

//works with url or paramsId
export async function GET(req: Request) {
    const {id} = await req.json();
    await connect();
    return await getRequestById(id);
}
