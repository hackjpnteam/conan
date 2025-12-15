import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

// GET: メッセージ一覧取得
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const bidId = searchParams.get("bidId");

    if (!bidId) {
      return NextResponse.json({ error: "bidId is required" }, { status: 400 });
    }

    const messages = await Message.find({ bidId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST: 新規メッセージ送信
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { jobId, bidId, senderType, content } = body;

    if (!jobId || !bidId || !senderType || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const message = await Message.create({
      jobId,
      bidId,
      senderType,
      content
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
