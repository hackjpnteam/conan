import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Job from "@/models/Job";
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

// GET: Get a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's jobs count and bids count
    const jobsCount = await Job.countDocuments({ userId: id });
    const bidsCount = await Bid.countDocuments({ userId: id });

    return NextResponse.json({ ...user, jobsCount, bidsCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// DELETE: Delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ("error" in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectDB();
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting superadmin users
    if (user.role === "superadmin") {
      return NextResponse.json({ error: "Cannot delete superadmin users" }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
