import connect from "@/lib/data";
import { getRealStateRequestById } from "@/middlewares/realStateConsultation";

//works with url or paramsId
export async function GET(req: Request) {
    const { id } = await req.json();
    await connect();
    return await getRealStateRequestById(id);
}