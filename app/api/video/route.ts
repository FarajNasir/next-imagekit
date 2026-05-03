import { error } from 'console';
import { connectDB } from "@/lib/db";
import Video, { IVideo } from "@/models/video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { request } from 'http';


export async function GET() {
    try {
        await connectDB()
        const videos = await Video.find({}).sort({ createdAt: -1 })
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

    } catch (error) {
        return NextResponse.json(
            { error: "fetch to failed " },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                { error: "unauthorized " },
                { status: 401 }
            )
        }
        await connectDB()
        const body: IVideo = await request.json()
        if (!body.title || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json(
                { error: "missing required field " },
                { status: 400 }
            )
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transmation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100,
            }
        }
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json(
            { error: "failed to create video " },
            { status: 500 }
        )
    }
}