import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, photo, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and role are required",
        },
        { status: 400 },
      );
    }

    if (!["supporter", "creator"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role",
        },
        { status: 400 },
      );
    }

    const db = client.db(process.env.DB_NAME);

    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 },
      );
    }

    const credits = role === "supporter" ? 50 : 20;

    const newUser = {
      name,
      email,
      photo: photo || "",
      role,
      credits,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User profile created successfully",
        userId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
