import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/lib/data";

// Existing signup function
export const signup = async (req: Request) => {
  const body = await req.json();
  if (!body.name || !body.password || !body.phone) {
    throw new Error("قسمت های مورد نظر را وارد کنید");
  }
  const user = await User.findOne({ phone: body.phone });
  if (user) {
    return NextResponse.json({ message: "کاربر تکراری است", status: 400 });
  }
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const newUser = new User({
    name: body.name,
    password: hashedPassword,
    phone: body.phone,
  });
  await newUser.save();
  return NextResponse.json({ message: "کاربر با موفقیت ثبت شد", status: 201 });
};

// Login function from app/api/auth/login/route.ts
export const login = async (request: NextRequest) => {
  await connect();
  try {
    const { phone, password } = await request.json();

    // Add validation logging
    console.log("Login attempt for:", phone);

    if (!phone || !password) {
      console.log("Missing credentials");
      return NextResponse.json(
        { message: "Phone number and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ phone });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    console.log("User found:", user);
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log("Invalid password");
      return NextResponse.json(
        { message: " رمز عبور اشتباه" },
        { status: 401 }
      );
    }

    const tokenSecret = process.env.JWT_SECRET;

    if (!tokenSecret) {
      console.log("JWT_SECRET missing");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
        phoneNumber: user.phone,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "12h" }
    );

    console.log("Login successful");
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

// Check admin access from app/api/auth/login/route.ts GET
export const checkAdminAccess = async (request: NextRequest) => {
  await connect();
  const token = request.headers.get("token");
  if (!token) {
    return NextResponse.json({ message: "Token missing" }, { status: 401 });
  }
  try {
    interface JwtCustomPayload {
      id: string;
      name: string;
      phoneNumber: string;
      role: string;
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtCustomPayload;
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    if (user.role !== "admin" && user.role !== "superadmin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json(
      { message: "Admin access granted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

// Get all users from app/api/auth/route.ts GET
// Update the getAllUsers function to support pagination
export const getAllUsers = async (request: Request) => {
  try {
    await connect();
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "hos") as {
      id: string;
      role: string;
    };

    // Check if user has admin privileges
    if (decodedToken.role === "ddd") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Get URL parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";
    const status = url.searchParams.get("status") || "";

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Add role filter
    if (role && role !== "all") {
      query.role = role;
    }

    // Add status filter (if you have status field in your schema)
    if (status && status !== "all") {
      query.status = status;
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get users with pagination
    const users = await User.find(query)
      .select("+password") // Include password field
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        users: users,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalUsers: totalUsers,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching users" },
      { status: 500 }
    );
  }
};

// Update user role from app/api/auth/route.ts PATCH
export const updateUserRole = async (request: Request) => {
  try {
    await connect();
    const id = request.headers.get("id");
    const body = await request.json();
    const user = await User.findByIdAndUpdate(
      id,
      {
        role: body.role,
      },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
};

// Get user by token from app/api/auth/id/route.ts GET
export const getUserByToken = async (request: NextRequest) => {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "connection failed" });
  }
  try {
    const token = await request.headers.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET! || "msl");
    if (!decodedToken || typeof decodedToken !== "object") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decodedToken.id;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      username: user.name,
      phoneNumber: user.phone,
      id: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Update user by token from app/api/auth/id/route.ts PATCH
export const updateUserByToken = async (request: NextRequest) => {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "connection failed" });
  }
  try {
    const body = await request.json();
    const token = request.headers.get("token");
    const decodedToken = jwt.verify(token!, process.env.JWT_SECRET!);
    if (!decodedToken || typeof decodedToken !== "object") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const id = decodedToken.id;
    const user = await User.findById(id);
    let newUser: {
      username?: string;
      phoneNumber?: string;
      password?: string;
    } = {};
    if (body.password && body.password.trim() !== "") {
      newUser = {
        username: body.username,
        phoneNumber: body.phoneNumber,
        password: body.password,
      };
    } else {
      newUser = {
        username: body.username,
        phoneNumber: body.phoneNumber,
      };
    }
    // If password is provided, hash it and add to update
    if (body.password && body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      newUser.password = hashedPassword;
    }

    await User.findByIdAndUpdate(id, newUser);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Add this function to your existing auth middleware file

export const deleteUser = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId } = body;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "شناسه کاربر الزامی است" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return NextResponse.json(
        { success: false, message: "کاربر مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // Prevent deletion of superadmin users (optional security measure)
    if (userToDelete.role === "superadmin") {
      return NextResponse.json(
        { success: false, message: "امکان حذف مدیر کل وجود ندارد" },
        { status: 403 }
      );
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "خطا در حذف کاربر" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "کاربر با موفقیت حذف شد",
        deletedUser: {
          _id: deletedUser._id,
          name: deletedUser.name,
          phone: deletedUser.phone,
          role: deletedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);

    return NextResponse.json(
      { success: false, message: "خطای داخلی سرور در حذف کاربر" },
      { status: 500 }
    );
  }
};
// Add this function to your existing auth middleware file
export const editUser = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, name, phone, password, role } = body;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "شناسه کاربر الزامی است" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !phone || !role) {
      return NextResponse.json(
        { success: false, message: "نام، شماره تلفن و نقش الزامی است" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "کاربر مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // Check if phone number is already taken by another user
    const phoneExists = await User.findOne({
      phone: phone.trim(),
      _id: { $ne: userId },
    });

    if (phoneExists) {
      return NextResponse.json(
        { success: false, message: "این شماره تلفن قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    // Prepare update object
    const updateData: any = {
      name: name.trim(),
      phone: phone.trim(),
      role: role,
    };

    // Hash password if provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password.trim(), 10);
      updateData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "خطا در به‌روزرسانی کاربر" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "کاربر با موفقیت به‌روزرسانی شد",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          phone: updatedUser.phone,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error editing user:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          message: messages[0] || "اطلاعات وارد شده معتبر نیست",
        },
        { status: 400 }
      );
    }

    // Handle invalid ObjectId error
    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "شناسه کاربر نامعتبر است" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "خطای داخلی سرور در ویرایش کاربر" },
      { status: 500 }
    );
  }
};
