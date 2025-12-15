import { NextRequest, NextResponse } from "next/server";

// モック入札データ - 全案件に対応
const mockBids = [
  // 案件1: 配偶者の浮気調査
  {
    _id: "bid1-1",
    jobId: "1",
    agencyName: "東京総合探偵事務所",
    licenseNumber: "東京都公安委員会 第30120001号",
    quote: 250000,
    days: 7,
    proposal: "浮気調査の実績が豊富です。GPSを使った追跡と写真・動画による証拠収集を行います。料金は明確で追加費用は一切ございません。24時間体制でサポートし、法廷でも通用する詳細な報告書を作成いたします。",
    contactEmail: "contact@tokyo-detective.com",
    createdAt: "2024-10-11T09:00:00.000Z"
  },
  {
    _id: "bid1-2",
    jobId: "1",
    agencyName: "首都圏リサーチ",
    licenseNumber: "東京都公安委員会 第30120002号",
    quote: 280000,
    days: 10,
    proposal: "30年の実績があります。確実な証拠収集をお約束いたします。法廷でも通用する詳細な報告書を作成いたします。アフターサポートも充実しており、ご相談は無料です。",
    contactEmail: "info@shutoken-research.jp",
    createdAt: "2024-10-11T14:30:00.000Z"
  },
  {
    _id: "bid1-3",
    jobId: "1",
    agencyName: "プライベート調査室",
    licenseNumber: "東京都公安委員会 第30120003号",
    quote: 200000,
    days: 5,
    proposal: "迅速な対応が自慢です。最新機材を使用した調査を実施します。24時間体制でサポートいたします。お客様のプライバシーを最優先に考えた調査を行います。",
    contactEmail: "private@investigation.co.jp",
    createdAt: "2024-10-12T10:15:00.000Z"
  },

  // 案件2: ストーカー被害
  {
    _id: "bid2-1",
    jobId: "2",
    agencyName: "都市型探偵サービス",
    licenseNumber: "東京都公安委員会 第30120004号",
    quote: 220000,
    days: 14,
    proposal: "ストーカー対策専門チームがあります。法的手続きのサポートも行います。アフターケアも充実しており、24時間緊急対応可能です。",
    contactEmail: "support@urban-detective.net",
    createdAt: "2024-10-10T11:00:00.000Z"
  },
  {
    _id: "bid2-2",
    jobId: "2",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 240000,
    days: 12,
    proposal: "ストーカー事案の解決実績多数。警察との連携も可能です。被害者の安全を最優先に考えた調査プランをご提案いたします。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-10-10T16:30:00.000Z"
  },

  // 案件3: 投資詐欺
  {
    _id: "bid3-1",
    jobId: "3",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 450000,
    days: 21,
    proposal: "詐欺事案に特化した専門チームです。金融関係の調査実績が豊富で、複雑な資金の流れも追跡可能です。弁護士との連携もサポートします。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-10-09T10:00:00.000Z"
  },
  {
    _id: "bid3-2",
    jobId: "3",
    agencyName: "信頼調査事務所",
    licenseNumber: "東京都公安委員会 第30120006号",
    quote: 380000,
    days: 18,
    proposal: "投資詐欺の被害回復支援も行います。証券取引等監視委員会への報告書作成もサポートいたします。",
    contactEmail: "trust@research-office.net",
    createdAt: "2024-10-09T15:45:00.000Z"
  },

  // 案件4: 企業信用調査
  {
    _id: "bid4-1",
    jobId: "4",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 350000,
    days: 15,
    proposal: "企業調査に特化した専門チームです。詳細な背景調査を実施します。機密保持を徹底しており、企業間取引のリスク評価が得意です。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-10-08T09:30:00.000Z"
  },
  {
    _id: "bid4-2",
    jobId: "4",
    agencyName: "首都圏リサーチ",
    licenseNumber: "東京都公安委員会 第30120002号",
    quote: 320000,
    days: 12,
    proposal: "企業調査30年の実績があります。財務状況、代表者の素行、取引先関係まで詳細に調査いたします。",
    contactEmail: "info@shutoken-research.jp",
    createdAt: "2024-10-08T14:20:00.000Z"
  },

  // 案件5: 行方不明者
  {
    _id: "bid5-1",
    jobId: "5",
    agencyName: "東京総合探偵事務所",
    licenseNumber: "東京都公安委員会 第30120001号",
    quote: 480000,
    days: 30,
    proposal: "人探し専門チームがございます。全国ネットワークを活用し、3年の空白期間でも諦めません。成功報酬制もご相談可能です。",
    contactEmail: "contact@tokyo-detective.com",
    createdAt: "2024-10-07T10:15:00.000Z"
  },
  {
    _id: "bid5-2",
    jobId: "5",
    agencyName: "信頼調査事務所",
    licenseNumber: "東京都公安委員会 第30120006号",
    quote: 520000,
    days: 28,
    proposal: "長期間の行方不明案件に強みがあります。住民票、戸籍等の公的書類調査から開始し、段階的にアプローチします。",
    contactEmail: "trust@research-office.net",
    createdAt: "2024-10-07T13:45:00.000Z"
  },

  // 案件6: 社内不正
  {
    _id: "bid6-1",
    jobId: "6",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 320000,
    days: 14,
    proposal: "企業内部の不正調査を専門としています。従業員の行動監視、証拠収集を秘密裏に実施します。労務問題にも精通しています。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-10-06T09:00:00.000Z"
  },

  // 案件7: 婚約者素行
  {
    _id: "bid7-1",
    jobId: "7",
    agencyName: "プライベート調査室",
    licenseNumber: "東京都公安委員会 第30120003号",
    quote: 180000,
    days: 7,
    proposal: "結婚前調査の実績が豊富です。相手の日常生活、交友関係、金銭面まで総合的に調査いたします。プライバシーに配慮した調査を行います。",
    contactEmail: "private@investigation.co.jp",
    createdAt: "2024-10-05T11:30:00.000Z"
  },
  {
    _id: "bid7-2",
    jobId: "7",
    agencyName: "東京総合探偵事務所",
    licenseNumber: "東京都公安委員会 第30120001号",
    quote: 160000,
    days: 5,
    proposal: "婚前調査は慎重に行います。相手を傷つけることなく、必要な情報のみを収集いたします。結果は詳細な報告書でお渡しします。",
    contactEmail: "contact@tokyo-detective.com",
    createdAt: "2024-10-05T15:00:00.000Z"
  },

  // 案件8: 近隣トラブル
  {
    _id: "bid8-1",
    jobId: "8",
    agencyName: "都市型探偵サービス",
    licenseNumber: "東京都公安委員会 第30120004号",
    quote: 150000,
    days: 10,
    proposal: "近隣トラブルの証拠収集が得意です。24時間監視体制で嫌がらせの瞬間を記録します。法的対応のアドバイスも可能です。",
    contactEmail: "support@urban-detective.net",
    createdAt: "2024-10-04T12:00:00.000Z"
  },

  // 案件9: オンライン詐欺
  {
    _id: "bid9-1",
    jobId: "9",
    agencyName: "信頼調査事務所",
    licenseNumber: "東京都公安委員会 第30120006号",
    quote: 200000,
    days: 14,
    proposal: "SNS詐欺、オンライン詐欺の調査に強みがあります。デジタルフォレンジック技術を活用し、相手の特定を行います。",
    contactEmail: "trust@research-office.net",
    createdAt: "2024-10-03T10:30:00.000Z"
  },
  {
    _id: "bid9-2",
    jobId: "9",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 240000,
    days: 12,
    proposal: "サイバー犯罪対策チームがあります。警察への被害届提出もサポートし、被害回復に向けて全力で取り組みます。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-10-03T16:15:00.000Z"
  },

  // 案件10: 競合調査
  {
    _id: "bid10-1",
    jobId: "10",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 280000,
    days: 21,
    proposal: "企業調査のプロフェッショナルです。競合他社の動向調査、新商品情報の収集を合法的に実施します。機密保持契約も締結可能です。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-10-02T09:45:00.000Z"
  },

  // 他の案件にも同様に入札データを追加...
  // 案件11-20にも各1-2件の入札を追加
  {
    _id: "bid11-1",
    jobId: "11",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 400000,
    days: 18,
    proposal: "情報漏洩調査の専門チームです。元従業員の行動追跡、接触先の調査を行います。企業の機密保持をサポートします。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-10-01T11:00:00.000Z"
  },
  {
    _id: "bid12-1",
    jobId: "12",
    agencyName: "東京総合探偵事務所",
    licenseNumber: "東京都公安委員会 第30120001号",
    quote: 250000,
    days: 8,
    proposal: "金銭トラブルの調査実績があります。借金の実態、隠し資産の有無まで詳細に調査いたします。家族問題に配慮した調査を行います。",
    contactEmail: "contact@tokyo-detective.com",
    createdAt: "2024-09-30T10:30:00.000Z"
  },
  {
    _id: "bid13-1",
    jobId: "13",
    agencyName: "信頼調査事務所",
    licenseNumber: "東京都公安委員会 第30120006号",
    quote: 140000,
    days: 7,
    proposal: "SNS誹謗中傷の調査が得意です。IPアドレス追跡、アカウント特定を行います。法的措置のサポートも可能です。",
    contactEmail: "trust@research-office.net",
    createdAt: "2024-09-29T14:15:00.000Z"
  },
  {
    _id: "bid14-1",
    jobId: "14",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 350000,
    days: 16,
    proposal: "保険金詐欺の調査に特化しています。医療関係者との連携も可能で、専門的な調査を実施します。証拠収集力に自信があります。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-09-28T09:20:00.000Z"
  },
  {
    _id: "bid15-1",
    jobId: "15",
    agencyName: "プライベート調査室",
    licenseNumber: "東京都公安委員会 第30120003号",
    quote: 120000,
    days: 5,
    proposal: "お子様の調査は慎重に行います。教育機関との連携も可能で、家族の絆を大切にした調査を心がけています。",
    contactEmail: "private@investigation.co.jp",
    createdAt: "2024-09-27T13:45:00.000Z"
  },
  {
    _id: "bid16-1",
    jobId: "16",
    agencyName: "東京総合探偵事務所",
    licenseNumber: "東京都公安委員会 第30120001号",
    quote: 170000,
    days: 6,
    proposal: "婚活相手の身元調査は豊富な実績があります。学歴、職歴、家族構成まで詳細に調査し、安心できる結婚をサポートします。",
    contactEmail: "contact@tokyo-detective.com",
    createdAt: "2024-09-26T10:00:00.000Z"
  },
  {
    _id: "bid17-1",
    jobId: "17",
    agencyName: "都市型探偵サービス",
    licenseNumber: "東京都公安委員会 第30120004号",
    quote: 220000,
    days: 12,
    proposal: "職場でのパワハラ証拠収集を専門としています。労働基準監督署への報告書作成もサポートし、働きやすい環境作りをお手伝いします。",
    contactEmail: "support@urban-detective.net",
    createdAt: "2024-09-25T15:30:00.000Z"
  },
  {
    _id: "bid18-1",
    jobId: "18",
    agencyName: "信頼調査事務所",
    licenseNumber: "東京都公安委員会 第30120006号",
    quote: 280000,
    days: 15,
    proposal: "投資セミナー詐欺の調査実績が多数あります。主催者の背景、過去の実績、参加者の被害状況まで総合的に調査します。",
    contactEmail: "trust@research-office.net",
    createdAt: "2024-09-24T11:15:00.000Z"
  },
  {
    _id: "bid19-1",
    jobId: "19",
    agencyName: "都市型探偵サービス",
    licenseNumber: "東京都公安委員会 第30120004号",
    quote: 190000,
    days: 10,
    proposal: "ストーカー被害の専門チームです。相手の行動パターンを分析し、被害者の安全を確保します。法的措置のアドバイスも可能です。",
    contactEmail: "support@urban-detective.net",
    createdAt: "2024-09-23T12:30:00.000Z"
  },
  {
    _id: "bid20-1",
    jobId: "20",
    agencyName: "東京総合探偵事務所",
    licenseNumber: "東京都公安委員会 第30120001号",
    quote: 260000,
    days: 20,
    proposal: "相続人調査の専門チームがあります。戸籍調査、住民票調査を駆使し、全国どこでも相続人の所在を特定します。司法書士との連携も可能です。",
    contactEmail: "contact@tokyo-detective.com",
    createdAt: "2024-09-22T09:45:00.000Z"
  },
  // 新カテゴリの案件への入札
  {
    _id: "bid21-1",
    jobId: "21",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 140000,
    days: 2,
    proposal: "盗聴器・盗撮器発見のプロフェッショナルです。最新の電波探知機器を使用し、徹底的に調査します。企業の機密保持も万全です。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-09-20T15:00:00.000Z"
  },
  {
    _id: "bid22-1",
    jobId: "22",
    agencyName: "信頼調査事務所",
    licenseNumber: "東京都公安委員会 第30120006号",
    quote: 160000,
    days: 7,
    proposal: "採用前調査・素行調査に特化しています。学歴詐称、経歴詐称、犯罪歴まで詳細に調査し、人事部門をサポートします。",
    contactEmail: "trust@research-office.net",
    createdAt: "2024-09-19T16:30:00.000Z"
  },
  {
    _id: "bid23-1",
    jobId: "23",
    agencyName: "プライベート調査室",
    licenseNumber: "東京都公安委員会 第30120003号",
    quote: 100000,
    days: 1,
    proposal: "個人宅の盗聴器・盗撮器調査を得意としています。プライバシーに配慮し、迅速かつ丁寧に調査いたします。アフターサポートも万全です。",
    contactEmail: "private@investigation.co.jp",
    createdAt: "2024-09-18T14:15:00.000Z"
  },
  {
    _id: "bid24-1",
    jobId: "24",
    agencyName: "東京総合探偵事務所",
    licenseNumber: "東京都公安委員会 第30120001号",
    quote: 180000,
    days: 10,
    proposal: "家族関係の素行調査は慎重に行います。お子様を傷つけることなく、必要な情報を収集し、家族の絆を大切にしたアドバイスも可能です。",
    contactEmail: "contact@tokyo-detective.com",
    createdAt: "2024-09-17T18:00:00.000Z"
  },
  {
    _id: "bid25-1",
    jobId: "25",
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 90000,
    days: 1,
    proposal: "企業向け盗聴器調査のエキスパートです。会議室、役員室、重要施設の調査実績が豊富です。緊急対応も可能で、機密保持を徹底します。",
    contactEmail: "corp@security-bureau.com",
    createdAt: "2024-09-16T12:30:00.000Z"
  }
];

export async function GET(req: NextRequest) {
  try {
    const { connectDB } = await import("@/lib/db");
    const Bid = (await import("@/models/Bid")).default;
    const { Types } = await import("mongoose");

    await connectDB();

    const bidId = req.nextUrl.searchParams.get("bidId");
    const jobId = req.nextUrl.searchParams.get("jobId");

    // bidIdで検索
    if (bidId && Types.ObjectId.isValid(bidId)) {
      const bid = await Bid.findById(bidId).lean();
      return NextResponse.json(bid ? [bid] : []);
    }

    // jobIdで検索
    if (!jobId || !Types.ObjectId.isValid(jobId)) return NextResponse.json([]);
    const items = await Bid.find({ jobId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error: any) {
    console.warn("MongoDB接続失敗、モックデータを使用:", error?.message);
    const bidId = req.nextUrl.searchParams.get("bidId");
    const jobId = req.nextUrl.searchParams.get("jobId");

    if (bidId) {
      const bid = mockBids.find(b => b._id === bidId);
      return NextResponse.json(bid ? [bid] : []);
    }

    const bidsForJob = mockBids.filter(bid => bid.jobId === jobId);
    return NextResponse.json(bidsForJob);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { connectDB } = await import("@/lib/db");
    const Bid = (await import("@/models/Bid")).default;
    const { Types } = await import("mongoose");
    const { cookies } = await import("next/headers");

    await connectDB();

    // Get userId from session
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    let userId = null;
    if (session) {
      try {
        const sessionData = JSON.parse(session.value);
        if (sessionData.userId && Types.ObjectId.isValid(sessionData.userId)) {
          userId = new Types.ObjectId(sessionData.userId);
        }
      } catch (e) {
        console.error("Session parse error:", e);
      }
    }

    const body = await req.json();
    const required = ["jobId","agencyName","licenseNumber","quote","days","proposal","contactEmail"];
    for (const k of required) if (!body[k]) return NextResponse.json({ error: `missing ${k}` }, { status: 400 });
    if (!Types.ObjectId.isValid(body.jobId)) return NextResponse.json({ error: "invalid jobId" }, { status: 400 });

    const doc = await Bid.create({
      jobId: body.jobId,
      userId: userId,
      agencyName: String(body.agencyName).slice(0,120),
      licenseNumber: String(body.licenseNumber).slice(0,80),
      quote: Number(body.quote),
      days: Number(body.days),
      proposal: String(body.proposal).slice(0,4000),
      contactEmail: String(body.contactEmail).slice(0,200)
    });
    return NextResponse.json(doc);
  } catch (error: any) {
    console.warn("MongoDB接続失敗、モック入札として処理:", error?.message);
    const body = await req.json();
    const mockBid = {
      _id: Date.now().toString(),
      jobId: body.jobId,
      agencyName: body.agencyName,
      licenseNumber: body.licenseNumber,
      quote: body.quote,
      days: body.days,
      proposal: body.proposal,
      contactEmail: body.contactEmail,
      createdAt: new Date().toISOString()
    };
    return NextResponse.json(mockBid);
  }
}