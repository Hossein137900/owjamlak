import { NextRequest, NextResponse } from "next/server";
import ConsultantChampion from "@/models/consultantChampion";

export const createConsultant = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const consultant = new ConsultantChampion({
      name: body.name,
      title: body.title,
      description: body.description,
      avatar: body.avatar,
      rating: body.rating || 0,
      totalSales: body.totalSales || 0,
      experience: body.experience || 0,
      phone: body.phone,
      email: body.email,
      isTopConsultant: body.isTopConsultant || false,
      isActive: body.isActive || true,
    });

    await consultant.save();

    return NextResponse.json(
      { message: "Consultant created successfully", consultant },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating consultant:", error);
    return NextResponse.json(
      { message: "Error creating consultant", error },
      { status: 500 }
    );
  }
};

export const getAllConsultants = async (request: NextRequest) => {
  try {
    // Check if getting single consultant by ID from headers
    const consultantId = request.headers.get("id");

    if (consultantId) {
      const consultant = await ConsultantChampion.findById(consultantId);

      if (!consultant) {
        return NextResponse.json(
          { message: "Consultant not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ consultant }, { status: 200 });
    }

    // Get all consultants with optional filters
    const isActive = request.headers.get("isActive");
    const isTopConsultant = request.headers.get("isTopConsultant");
    const limit = request.headers.get("limit");
    const page = request.headers.get("page");

    let query: any = {};

    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    if (isTopConsultant !== null) {
      query.isTopConsultant = isTopConsultant === "true";
    }

    let consultantsQuery = ConsultantChampion.find(query).sort({
      createdAt: -1,
    });

    // Handle pagination
    if (limit) {
      const limitNum = parseInt(limit);
      const pageNum = page ? parseInt(page) : 1;
      const skip = (pageNum - 1) * limitNum;

      consultantsQuery = consultantsQuery.skip(skip).limit(limitNum);
    }

    const consultants = await consultantsQuery;
    const total = await ConsultantChampion.countDocuments(query);

    return NextResponse.json(
      {
        consultants,
        total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching consultants:", error);
    return NextResponse.json(
      { message: "Error fetching consultants", error },
      { status: 500 }
    );
  }
};

export const updateConsultant = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const id = request.headers.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Consultant ID is required in headers" },
        { status: 400 }
      );
    }

    const consultant = await ConsultantChampion.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!consultant) {
      return NextResponse.json(
        { message: "Consultant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Consultant updated successfully", consultant },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating consultant:", error);
    return NextResponse.json(
      { message: "Error updating consultant", error },
      { status: 500 }
    );
  }
};

export const deleteConsultant = async (request: NextRequest) => {
  try {
    const id = request.headers.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Consultant ID is required in headers" },
        { status: 400 }
      );
    }

    const consultant = await ConsultantChampion.findByIdAndDelete(id);

    if (!consultant) {
      return NextResponse.json(
        { message: "Consultant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Consultant deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting consultant:", error);
    return NextResponse.json(
      { message: "Error deleting consultant", error },
      { status: 500 }
    );
  }
};
