import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Bid from "@/models/Bid";
import Message from "@/models/Message";
import mongoose from "mongoose";

// GET: Get bids submitted by the current user (for agencies)
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = JSON.parse(session.value);

    if (sessionData.userType !== "agency") {
      return NextResponse.json({ error: "Only agencies can access this" }, { status: 403 });
    }

    await connectDB();

    // Convert userId to ObjectId for proper query
    const userObjectId = new mongoose.Types.ObjectId(sessionData.userId);

    // Get bids submitted by this user
    const bids = await Bid.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean();

    // Get job details and message counts for each bid
    const bidsWithDetails = await Promise.all(
      bids.map(async (bid: any) => {
        const job = await Job.findById(bid.jobId).lean();
        const messageCount = await Message.countDocuments({ bidId: bid._id });
        const unreadCount = await Message.countDocuments({
          bidId: bid._id,
          senderType: "client",
          read: false
        });
        return {
          ...bid,
          job,
          messageCount,
          unreadCount
        };
      })
    );

    return NextResponse.json(bidsWithDetails);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
  }
}
