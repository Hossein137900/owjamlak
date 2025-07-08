import { NextResponse } from "next/server";
import Employ from "@/models/employRequest";

export const getAllRequests = async () => {
  try {
    const requests = await Employ.find();
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { message: "Error fetching requests" },
      { status: 500 }
    );
  }
};

export const getRequestById = async (id: string) => {
  try {
    const request = await Employ.findById(id);
    return NextResponse.json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { message: "Error fetching request" },
      { status: 500 }
    );
  }
};

export const createRequest = async (req: Request) => {
  const { name, lastName, phone, description, file, email, type, education } =
    await req.json();
  try {
    const request = new Employ({
      name,
      lastName,
      phone,
      description,
      file,
      email,
      type,
      education,
    });
    await request.save();
    return NextResponse.json(request);
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { message: "Error creating request" },
      { status: 500 }
    );
  }
};

export const updateRequest = async (req: Request) => {
  const {
    id,
    name,
    lastName,
    phone,
    description,
    file,
    email,
    type,
    education,
  } = await req.json();
  try {
    const request = await Employ.findByIdAndUpdate(
      id,
      {
        name,
        lastName,
        phone,
        description,
        file,
        email,
        type,
        education,
      },
      { new: true }
    );
    return NextResponse.json(request);
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { message: "Error updating request" },
      { status: 500 }
    );
  }
};

export const deleteRequest = async (req: Request) => {
  const { id } = await req.json();
  try {
    const request = await Employ.findByIdAndDelete(id);
    return NextResponse.json(request);
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { message: "Error deleting request" },
      { status: 500 }
    );
  }
};
