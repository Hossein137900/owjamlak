import connect from "@/lib/data";
import { getLegalRequestById } from "@/middlewares/legalConsultation";

//works with url or paramsId
export async function GET(req: Request) {
    const {id} = await req.json();
    await connect();
    return await getLegalRequestById(id);
}