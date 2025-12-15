import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Bid from "@/models/Bid";
import mongoose from "mongoose";

// GET: Get jobs posted by the current user (for clients)
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = JSON.parse(session.value);

    if (sessionData.userType !== "client") {
      return NextResponse.json({ error: "Only clients can access this" }, { status: 403 });
    }

    await connectDB();

    // Convert userId to ObjectId for proper query
    const userObjectId = new mongoose.Types.ObjectId(sessionData.userId);

    // Get jobs posted by this user
    const jobs = await Job.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean();

    // Get bid counts for each job
    const jobsWithBids = await Promise.all(
      jobs.map(async (job: any) => {
        const bidCount = await Bid.countDocuments({ jobId: job._id });
        const bids = await Bid.find({ jobId: job._id })
          .sort({ createdAt: -1 })
          .limit(3)
          .lean();
        return {
          ...job,
          bidCount,
          recentBids: bids
        };
      })
    );

    return NextResponse.json(jobsWithBids);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
