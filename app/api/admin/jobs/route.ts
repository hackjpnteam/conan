import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import User from "@/models/User";
import Bid from "@/models/Bid";

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

// GET: Get all jobs with user info
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } }
      ];
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Get user info and bid counts for each job
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job: any) => {
        const user = job.userId ? await User.findById(job.userId).select("-password").lean() : null;
        const bidCount = await Bid.countDocuments({ jobId: job._id });
        return {
          ...job,
          user,
          bidCount
        };
      })
    );

    return NextResponse.json(jobsWithDetails);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
