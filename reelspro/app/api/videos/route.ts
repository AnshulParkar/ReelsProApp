import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Video, { IVideo } from "@/models/Video";
import { getServerSession as nextAuthGetServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


export async function GET() {
    try {
        await connectToDatabase();
        const videos = await Video.find().sort({ createdAt: -1 }).exec();
        if(!videos || videos.length === 0) {
            return NextResponse.json({ message: 'No videos found' }, { status: 404 });
        } 
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Error connecting to database:', error);
        return NextResponse.json({ error: 'Failed to connect to database' }, { status: 500 });
    }

}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await connectToDatabase();
        const body: IVideo = await request.json();
        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json({ error: 'Title, description, videoUrl, and thumbnailUrl are required' }, { status: 400 });
        }
        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.video?.quality ?? 100
            }
        }
        const newVideo = await Video.create(videoData);
        return NextResponse.json(newVideo, { status: 201 });
    } catch (error) {
        console.error('Error creating video:', error);
        return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }
}

async function getServerSession(authOptions: any) {
    return await nextAuthGetServerSession(authOptions);
}
