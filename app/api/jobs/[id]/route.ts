import { NextRequest, NextResponse } from "next/server";

// モックデータ
const mockJob = {
  _id: "1",
  title: "配偶者の浮気調査をお願いします",
  category: "浮気",
  area: "渋谷区",
  budgetMax: 300000,
  desiredOutcome: "写真・動画での証拠収集",
  status: "open",
  createdAt: "2024-10-10T10:00:00.000Z"
};

export async function GET(_: NextRequest, { params }: { params: { id: string }}) {
  try {
    const { connectDB } = await import("@/lib/db");
    const Job = (await import("@/models/Job")).default;
    const { Types } = await import("mongoose");
    
    await connectDB();
    const { id } = params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });
    const j = await Job.findById(id, { description: 0, contactEmail: 0 }).lean();
    if (!j) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(j);
  } catch (error: any) {
    console.warn("MongoDB接続失敗、モックデータを使用:", error?.message);
    return NextResponse.json(mockJob);
  }
}