import { NextResponse } from "next/server";
import RealStateRequest from "@/models/realStateConsultation";

export const getAllRealStateRequests = async () => {
  try {
    const requests = await RealStateRequest.find();
    return NextResponse.json(requests);
  } catch (error) {
    console.log("Error fetching real state requests:", error);
    return NextResponse.json(
      { message: "Error fetching real state requests" },
      { status: 500 }
    );
  }
}

export const getRealStateRequestById = async (id: string) => {
  try {
    const request = await RealStateRequest.findById(id);
    return NextResponse.json(request);
  } catch (error) {
    console.log("Error fetching real state request:", error);
    return NextResponse.json(
      { message: "Error fetching real state request" },
      { status: 500 }
    );
  }
}

export const createRealStateRequest = async (req: Request) => {
  const { name, lastName, phone, description, email, type, serviceType, budget } = await req.json();
  try {
    const request = new RealStateRequest({ 
      name, 
      lastName, 
      phone, 
      description, 
      email,
      type,
      serviceType,
      budget
    });
    await request.save();
    return NextResponse.json(request);
  } catch (error) {
    console.log("Error creating real state request:", error);
    return NextResponse.json(
      { message: "Error creating real state request" },
      { status: 500 }
    );
  }
}

export const updateRealStateRequest = async (req: Request) => {
  const { id, name, lastName, phone, description, email, type, serviceType, budget } = await req.json();
  try {
    const request = await RealStateRequest.findByIdAndUpdate(
      id,
      { 
        name,
        lastName,
        phone,
        description,
        email,
        type,
        serviceType,
        budget
      },
      { new: true }
    );
    return NextResponse.json(request);
  } catch (error) {
    console.log("Error updating real state request:", error);
    return NextResponse.json(
      { message: "Error updating real state request" },
      { status: 500 }
    );
  }
}

export const deleteRealStateRequest = async (req: Request) => {
  const { id } = await req.json();
  try {
    const request = await RealStateRequest.findByIdAndDelete(id);
    return NextResponse.json(request);
  } catch (error) {
    console.log("Error deleting real state request:", error);
    return NextResponse.json(
      { message: "Error deleting real state request" },
      { status: 500 }
    );
  }
}