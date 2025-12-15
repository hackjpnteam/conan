import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Job from "@/models/Job";
import Bid from "@/models/Bid";
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

// GET: Get admin dashboard stats
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectDB();

    // Get counts
    const totalUsers = await User.countDocuments();
    const clientCount = await User.countDocuments({ userType: "client" });
    const agencyCount = await User.countDocuments({ userType: "agency" });

    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: "open" });
    const closedJobs = await Job.countDocuments({ status: "closed" });

    const totalBids = await Bid.countDocuments();
    const totalMessages = await Message.countDocuments();

    // Recent activity
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentBids = await Bid.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get today's counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsers = await User.countDocuments({ createdAt: { $gte: today } });
    const todayJobs = await Job.countDocuments({ createdAt: { $gte: today } });
    const todayBids = await Bid.countDocuments({ createdAt: { $gte: today } });

    return NextResponse.json({
      counts: {
        totalUsers,
        clientCount,
        agencyCount,
        totalJobs,
        openJobs,
        closedJobs,
        totalBids,
        totalMessages
      },
      today: {
        users: todayUsers,
        jobs: todayJobs,
        bids: todayBids
      },
      recent: {
        users: recentUsers,
        jobs: recentJobs,
        bids: recentBids
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
