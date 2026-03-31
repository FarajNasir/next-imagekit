import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { error } from "console";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password is required " },
                { status: 400 }
            )
        }
        await connectDB()
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: "User already registerd" },
                { status: 400 }
            )
        }

        const user = await User.create({
            email,
            password,
        })
        return NextResponse.json(
            { message: "User registerd successfully ", user },
            { status: 200 },
        )
    } catch (error) {
        console.log("Registeration error", error)
        return NextResponse.json(
            { error: "Failed to register " },
            { status: 400 }
        )
    }
}

