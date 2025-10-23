import { NextResponse } from "next/server";
import LegalRequest from "@/models/legalConsultation";

export const getAllLegalRequests = async () => {
  try {
    const requests = await LegalRequest.find();
    return NextResponse.json(requests);
  } catch (error) {
    console.log("Error fetching legal requests:", error);
    return NextResponse.json(
      { message: "Error fetching legal requests" },
      { status: 500 }
    );
  }
};

export const getLegalRequestById = async (id: string) => {
  try {
    const request = await LegalRequest.findById(id);
    console.log(request);
    return NextResponse.json(request);
  } catch (error) {
    console.log("Error fetching legal request:", error);
    return NextResponse.json(
      { message: "Error fetching legal request" },
      { status: 500 }
    );
  }
};

export const createLegalRequest = async (req: Request) => {
  const { name, lastName, phone, description, email, type } = await req.json();
  try {
    const request = new LegalRequest({
      name,
      lastName,
      phone,
      description,
      email,
      type,
    });
    await request.save();
    return NextResponse.json(request);
  } catch (error) {
    console.log("Error creating legal request:", error);
    return NextResponse.json(
      { message: "Error creating legal request" },
      { status: 500 }
    );
  }
};

export const updateLegalRequest = async (req: Request) => {
  const { _id, name, lastName, phone, description, email, type } =
    await req.json();
  if (!_id) {
    return NextResponse.json({ message: "Id is required" }, { status: 500 });
  }
  try {
    const request = await LegalRequest.findByIdAndUpdate(
      _id,
      {
        name,
        lastName,
        phone,
        description,
        email,
        type,
      },
      { new: true }
    );
    return NextResponse.json(request);
  } catch (error) {
    console.log("Error updating legal request:", error);
    return NextResponse.json(
      { message: "Error updating legal request" },
      { status: 500 }
    );
  }
};

export const deleteLegalRequest = async (req: Request) => {
  const { _id } = await req.json();
  try {
    const request = await LegalRequest.findByIdAndDelete(_id);
    return NextResponse.json(request);
  } catch (error) {
    console.log("Error deleting legal request:", error);
    return NextResponse.json(
      { message: "Error deleting legal request" },
      { status: 500 }
    );
  }
};
