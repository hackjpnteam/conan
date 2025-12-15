import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Bid from "@/models/Bid";
import Job from "@/models/Job";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get user from session
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    let sessionData;
    try {
      sessionData = JSON.parse(session.value);
    } catch {
      return NextResponse.json({ error: "セッションが無効です" }, { status: 401 });
    }

    if (sessionData.userType !== "client") {
      return NextResponse.json({ error: "依頼者のみ注文できます" }, { status: 403 });
    }

    const body = await req.json();
    const { bidId, jobId, amount } = body;

    if (!bidId || !jobId || !amount) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    // Verify bid exists
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return NextResponse.json({ error: "入札が見つかりません" }, { status: 404 });
    }

    // Verify job exists and belongs to the client
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "案件が見つかりません" }, { status: 404 });
    }

    // Check if order already exists for this bid
    const existingOrder = await Order.findOne({ bidId: bid._id });
    if (existingOrder) {
      return NextResponse.json({ error: "この入札に対する注文は既に存在します" }, { status: 400 });
    }

    // Create order
    const order = await Order.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      bidId: new mongoose.Types.ObjectId(bidId),
      clientId: new mongoose.Types.ObjectId(sessionData.userId),
      agencyId: bid.userId,
      amount: amount,
      status: "pending"
    });

    // TODO: Stripe決済を実装
    // 現時点ではStripeなしで注文を作成するだけ
    // 将来的には以下のようにStripe Checkoutセッションを作成:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const checkoutSession = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: 'jpy',
    //       product_data: { name: `探偵依頼: ${job.title}` },
    //       unit_amount: amount,
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order._id}/success`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${bidId}`,
    //   metadata: { orderId: order._id.toString() }
    // });
    //
    // await Order.updateOne({ _id: order._id }, { stripeSessionId: checkoutSession.id });
    // return NextResponse.json({ checkoutUrl: checkoutSession.url });

    // 仮: 注文を即座に「paid」にする（テスト用）
    await Order.updateOne({ _id: order._id }, { status: "paid", paidAt: new Date() });

    // Update job status
    await Job.updateOne({ _id: jobId }, { status: "in_progress" });

    // Update bid status
    await Bid.updateOne({ _id: bidId }, { status: "accepted" });

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: "依頼が完了しました"
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "注文の作成に失敗しました" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    let sessionData;
    try {
      sessionData = JSON.parse(session.value);
    } catch {
      return NextResponse.json({ error: "セッションが無効です" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(sessionData.userId);

    let orders;
    if (sessionData.userType === "client") {
      orders = await Order.find({ clientId: userId })
        .populate("jobId", "title category")
        .populate("bidId", "agencyName quote days")
        .sort({ createdAt: -1 })
        .lean();
    } else {
      orders = await Order.find({ agencyId: userId })
        .populate("jobId", "title category")
        .populate("bidId", "agencyName quote days")
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "注文の取得に失敗しました" }, { status: 500 });
  }
}
