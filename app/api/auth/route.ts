import connect from "@/lib/data";
import { 
  signup, 
  getAllUsers, 
  updateUserRole, 
  deleteUser, 
  editUser 
} from "@/hooks/middlewares/auth";

export async function POST(request: Request) {
  await connect();
  return await signup(request);
}

export async function GET(request: Request) {
  return await getAllUsers(request);
}

export async function PATCH(request: Request) {
  await connect();
  return await editUser(request);
}

export async function PUT(request: Request) {
  await connect();
  return await updateUserRole(request);
}

export async function DELETE(request: Request) {
  await connect();
  return await deleteUser(request);
}
