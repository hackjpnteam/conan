import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
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

// GET: Get a specific bid with messages
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

    const bid = await Bid.findById(id).lean();
    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    const messages = await Message.find({ bidId: id }).sort({ createdAt: 1 }).lean();

    return NextResponse.json({ ...bid, messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bid" }, { status: 500 });
  }
}

// PUT: Update a bid
export async function PUT(
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
    const body = await req.json();

    const bid = await Bid.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).lean();

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    return NextResponse.json(bid);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update bid" }, { status: 500 });
  }
}

// DELETE: Delete a bid and related messages
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

    const bid = await Bid.findById(id);
    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    // Delete related messages
    await Message.deleteMany({ bidId: id });
    await Bid.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Bid and related messages deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete bid" }, { status: 500 });
  }
}
