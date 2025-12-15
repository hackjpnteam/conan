import { NextRequest, NextResponse } from "next/server";

// モックデータ
const mockJobs = [
  {
    _id: "1",
    title: "配偶者の浮気調査をお願いします",
    category: "浮気",
    area: "渋谷区",
    budgetMax: 300000,
    desiredOutcome: "写真・動画での証拠収集",
    status: "open",
    createdAt: "2024-10-10T10:00:00.000Z"
  },
  {
    _id: "2",
    title: "ストーカー被害の調査と対策",
    category: "ストーカー",
    area: "新宿区",
    budgetMax: 250000,
    desiredOutcome: "対象者の行動確認",
    status: "open",
    createdAt: "2024-10-09T14:30:00.000Z"
  },
  {
    _id: "3",
    title: "投資詐欺の調査",
    category: "詐欺",
    area: "港区",
    budgetMax: 500000,
    desiredOutcome: "背景調査・身元確認",
    status: "open",
    createdAt: "2024-10-08T09:15:00.000Z"
  },
  {
    _id: "4",
    title: "取引先企業の信用調査",
    category: "企業調査",
    area: "千代田区",
    budgetMax: 400000,
    desiredOutcome: "背景調査・身元確認",
    status: "open",
    createdAt: "2024-10-07T16:45:00.000Z"
  },
  {
    _id: "5",
    title: "行方不明の家族を探してください",
    category: "人探し",
    area: "世田谷区",
    budgetMax: 600000,
    desiredOutcome: "所在地の特定",
    status: "open",
    createdAt: "2024-10-06T11:20:00.000Z"
  },
  {
    _id: "6",
    title: "社内不正の調査",
    category: "企業調査",
    area: "品川区",
    budgetMax: 350000,
    desiredOutcome: "写真・動画での証拠収集",
    status: "open",
    createdAt: "2024-10-05T13:10:00.000Z"
  },
  {
    _id: "7",
    title: "婚約者の素行調査",
    category: "浮気",
    area: "目黒区",
    budgetMax: 200000,
    desiredOutcome: "対象者の行動確認",
    status: "open",
    createdAt: "2024-10-04T08:30:00.000Z"
  },
  {
    _id: "8",
    title: "近隣住民からの嫌がらせ調査",
    category: "ストーカー",
    area: "大田区",
    budgetMax: 180000,
    desiredOutcome: "写真・動画での証拠収集",
    status: "open",
    createdAt: "2024-10-03T15:45:00.000Z"
  },
  {
    _id: "9",
    title: "オンライン詐欺の調査",
    category: "詐欺",
    area: "中野区",
    budgetMax: 220000,
    desiredOutcome: "背景調査・身元確認",
    status: "open",
    createdAt: "2024-10-02T12:00:00.000Z"
  },
  {
    _id: "10",
    title: "競合他社の動向調査",
    category: "企業調査",
    area: "杉並区",
    budgetMax: 320000,
    desiredOutcome: "背景調査・身元確認",
    status: "open",
    createdAt: "2024-10-01T17:30:00.000Z"
  },
  {
    _id: "11",
    title: "元従業員の情報漏洩調査",
    category: "企業調査",
    area: "豊島区",
    budgetMax: 450000,
    desiredOutcome: "写真・動画での証拠収集",
    status: "open",
    createdAt: "2024-09-30T09:45:00.000Z"
  },
  {
    _id: "12",
    title: "配偶者の金銭トラブル調査",
    category: "浮気",
    area: "北区",
    budgetMax: 280000,
    desiredOutcome: "対象者の行動確認",
    status: "open",
    createdAt: "2024-09-29T14:15:00.000Z"
  },
  {
    _id: "13",
    title: "SNSでの誹謗中傷者特定",
    category: "ストーカー",
    area: "荒川区",
    budgetMax: 160000,
    desiredOutcome: "背景調査・身元確認",
    status: "open",
    createdAt: "2024-09-28T10:30:00.000Z"
  },
  {
    _id: "14",
    title: "保険金詐欺の調査",
    category: "詐欺",
    area: "板橋区",
    budgetMax: 380000,
    desiredOutcome: "写真・動画での証拠収集",
    status: "open",
    createdAt: "2024-09-27T16:00:00.000Z"
  },
  {
    _id: "15",
    title: "子どもの交友関係調査",
    category: "その他",
    area: "練馬区",
    budgetMax: 150000,
    desiredOutcome: "対象者の行動確認",
    status: "open",
    createdAt: "2024-09-26T11:45:00.000Z"
  },
  {
    _id: "16",
    title: "婚活相手の身元調査",
    category: "浮気",
    area: "足立区",
    budgetMax: 190000,
    desiredOutcome: "背景調査・身元確認",
    status: "open",
    createdAt: "2024-09-25T13:20:00.000Z"
  },
  {
    _id: "17",
    title: "職場でのパワハラ証拠収集",
    category: "その他",
    area: "葛飾区",
    budgetMax: 240000,
    desiredOutcome: "写真・動画での証拠収集",
    status: "open",
    createdAt: "2024-09-24T08:15:00.000Z"
  },
  {
    _id: "18",
    title: "投資セミナー詐欺の調査",
    category: "詐欺",
    area: "江戸川区",
    budgetMax: 300000,
    desiredOutcome: "背景調査・身元確認",
    status: "open",
    createdAt: "2024-09-23T15:30:00.000Z"
  },
  {
    _id: "19",
    title: "元カレからの付きまとい調査",
    category: "ストーカー",
    area: "武蔵野市",
    budgetMax: 210000,
    desiredOutcome: "対象者の行動確認",
    status: "open",
    createdAt: "2024-09-22T12:45:00.000Z"
  },
  {
    _id: "20",
    title: "相続人の所在調査",
    category: "人探し",
    area: "立川市",
    budgetMax: 280000,
    desiredOutcome: "所在地の特定",
    status: "open",
    createdAt: "2024-09-21T09:00:00.000Z"
  },
  // 追加案件（新カテゴリ対応）
  {
    _id: "21",
    title: "オフィス内の盗聴器調査",
    category: "盗聴器発見",
    area: "千代田区",
    budgetMax: 150000,
    desiredOutcome: "盗聴・盗撮機器の発見",
    status: "open",
    createdAt: "2024-09-20T10:30:00.000Z"
  },
  {
    _id: "22",
    title: "新入社員の素行調査",
    category: "素行調査",
    area: "港区",
    budgetMax: 180000,
    desiredOutcome: "背景調査・身元確認",
    status: "open",
    createdAt: "2024-09-19T14:15:00.000Z"
  },
  {
    _id: "23",
    title: "自宅の盗聴器・盗撮器調査",
    category: "盗聴器発見",
    area: "新宿区",
    budgetMax: 120000,
    desiredOutcome: "盗聴・盗撮機器の発見",
    status: "open",
    createdAt: "2024-09-18T11:00:00.000Z"
  },
  {
    _id: "24",
    title: "息子の交際相手の素行調査",
    category: "素行調査",
    area: "渋谷区",
    budgetMax: 200000,
    desiredOutcome: "対象者の行動確認",
    status: "open",
    createdAt: "2024-09-17T16:30:00.000Z"
  },
  {
    _id: "25",
    title: "会議室の盗聴器検査",
    category: "盗聴器発見",
    area: "中央区",
    budgetMax: 100000,
    desiredOutcome: "盗聴・盗撮機器の発見",
    status: "open",
    createdAt: "2024-09-16T09:45:00.000Z"
  }
];

export async function GET() {
  // MongoDB接続を試行し、失敗した場合はモックデータを返す
  try {
    const { connectDB } = await import("@/lib/db");
    const Job = (await import("@/models/Job")).default;
    
    await connectDB();
    const items = await Job.find({}, { description: 0, contactEmail: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error: any) {
    console.warn("MongoDB接続失敗、モックデータを使用:", error?.message);
    return NextResponse.json(mockJobs);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { connectDB } = await import("@/lib/db");
    const Job = (await import("@/models/Job")).default;
    const { cookies } = await import("next/headers");
    const { Types } = await import("mongoose");

    await connectDB();

    // Get userId from session
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    let userId = null;
    console.log("Session cookie:", session ? "exists" : "not found");
    if (session) {
      try {
        const sessionData = JSON.parse(session.value);
        console.log("Session data:", JSON.stringify(sessionData));
        console.log("UserId from session:", sessionData.userId);
        if (sessionData.userId && Types.ObjectId.isValid(sessionData.userId)) {
          userId = new Types.ObjectId(sessionData.userId);
          console.log("Created ObjectId:", userId);
        }
      } catch (e) {
        console.error("Session parse error:", e);
      }
    }

    const body = await req.json();
    const required = ["title","category","area","budgetMax","desiredOutcome","description","contactEmail"];
    for (const k of required) if (!body[k]) return NextResponse.json({ error: `missing ${k}` }, { status: 400 });

    const doc = await Job.create({
      title: String(body.title).slice(0,120),
      category: String(body.category).slice(0,40),
      area: String(body.area).slice(0,80),
      budgetMax: Number(body.budgetMax),
      desiredOutcome: String(body.desiredOutcome).slice(0,120),
      description: String(body.description).slice(0,4000),
      contactEmail: String(body.contactEmail).slice(0,200),
      status: "open",
      userId: userId
    });
    return NextResponse.json(doc);
  } catch (error: any) {
    console.warn("MongoDB接続失敗、モック投稿として処理:", error?.message);
    const body = await req.json();
    const mockJob = {
      _id: Date.now().toString(),
      title: body.title,
      category: body.category,
      area: body.area,
      budgetMax: body.budgetMax,
      desiredOutcome: body.desiredOutcome,
      status: "open",
      createdAt: new Date().toISOString()
    };
    return NextResponse.json(mockJob);
  }
}