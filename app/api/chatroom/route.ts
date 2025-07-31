import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/data";

const ChatRoom = require("@/models/room");

// GET: Get all or one chatroom entry
export const GET = async (req: NextRequest) => {
  await connect();

  const id = req.headers.get("id");

  if (id) {
    try {
      const chatRoom = await ChatRoom.findById(id)
        .populate('userId')
        .populate('adminId')
        .populate('posterId')
        .populate('messages.senderId')
        .populate('messages.receiverId');
      if (!chatRoom) {
        return NextResponse.json(
          { error: "ChatRoom not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ chatRoom });
    } catch (error) {
      return NextResponse.json(
        { error: "An error occurred: " + error },
        { status: 500 }
      );
    }
  }

  try {
    const chatRooms = await ChatRoom.find()
      .populate('userId')
      .populate('adminId')
      .populate('posterId')
      .populate('messages.senderId')
      .populate('messages.receiverId');
    return NextResponse.json({ chatRooms });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred: " + error },
      { status: 500 }
    );
  }
};

// POST: Create a chatroom entry
export const POST = async (req: NextRequest) => {
  await connect();

  try {
    const body = await req.json();
    
    // Parse messages if it's a string
    if (typeof body.messages === 'string') {
      body.messages = JSON.parse(body.messages);
    }
    
    const chatRoom = await ChatRoom.create(body);
    return NextResponse.json({ chatRoom }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred: " + error },
      { status: 500 }
    );
  }
};

// PATCH: Update a chatroom entry
export const PATCH = async (req: NextRequest) => {
  await connect();

  const id = req.headers.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID is required in headers" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    
    // Parse messages if it's a string
    if (typeof body.messages === 'string') {
      body.messages = JSON.parse(body.messages);
    }
    
    const chatRoom = await ChatRoom.findByIdAndUpdate(id, body, { new: true });
    if (!chatRoom) {
      return NextResponse.json(
        { error: "ChatRoom not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ chatRoom });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred: " + error },
      { status: 500 }
    );
  }
};

// DELETE: Delete a chatroom entry
export const DELETE = async (req: NextRequest) => {
  await connect();

  const id = req.headers.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID is required in headers" },
      { status: 400 }
    );
  }

  try {
    const chatRoom = await ChatRoom.findByIdAndDelete(id);
    if (!chatRoom) {
      return NextResponse.json(
        { error: "ChatRoom not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "ChatRoom deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred: " + error },
      { status: 500 }
    );
  }
};