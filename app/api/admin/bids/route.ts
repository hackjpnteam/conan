import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import Bid from "@/models/Bid";
import Job from "@/models/Job";
import User from "@/models/User";
import Message from "@/models/Message";

// Admin check middleware
async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  const sessionData = JSON.parse(session.value);

  if (sessionData.role !== "superadmin") {
    return { error: "Forbidden: Admin access required", status: 403 };
  }

  return { sessionData };
}

// GET: Get all bids with job and user info
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const search = searchParams.get("search");

    const query: any = {};
    if (jobId) query.jobId = jobId;
    if (search) {
      query.$or = [
        { agencyName: { $regex: search, $options: "i" } },
        { proposal: { $regex: search, $options: "i" } }
      ];
    }

    const bids = await Bid.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Get job and user info for each bid
    const bidsWithDetails = await Promise.all(
      bids.map(async (bid: any) => {
        const job = await Job.findById(bid.jobId).lean();
        const user = bid.userId ? await User.findById(bid.userId).select("-password").lean() : null;
        const messageCount = await Message.countDocuments({ bidId: bid._id });
        return {
          ...bid,
          job,
          user,
          messageCount
        };
      })
    );

    return NextResponse.json(bidsWithDetails);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 });
  }
}
