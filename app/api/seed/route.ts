import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import Bid from "@/models/Bid";

const sampleJobs = [
  {
    title: "配偶者の浮気調査をお願いします",
    category: "浮気",
    area: "渋谷区",
    budgetMax: 300000,
    desiredOutcome: "写真・動画での証拠収集",
    description: "最近配偶者の行動が怪しく、週3回ほど遅い帰宅が続いています。確実な証拠を掴みたいです。",
    contactEmail: "client1@example.com"
  },
  {
    title: "ストーカー被害の調査と対策",
    category: "ストーカー",
    area: "新宿区",
    budgetMax: 250000,
    desiredOutcome: "対象者の行動確認",
    description: "元恋人からのストーカー行為が続いており、証拠収集と対策をお願いしたいです。",
    contactEmail: "client2@example.com"
  },
  {
    title: "投資詐欺の調査",
    category: "詐欺",
    area: "港区",
    budgetMax: 500000,
    desiredOutcome: "背景調査・身元確認",
    description: "投資話を持ちかけられましたが、相手の素性を調べてほしいです。",
    contactEmail: "client3@example.com"
  },
  {
    title: "取引先企業の信用調査",
    category: "企業調査",
    area: "千代田区",
    budgetMax: 400000,
    desiredOutcome: "背景調査・身元確認",
    description: "新規取引を検討している企業の信用状況を調査してください。",
    contactEmail: "client4@example.com"
  },
  {
    title: "行方不明の家族を探してください",
    category: "その他",
    area: "世田谷区",
    budgetMax: 600000,
    desiredOutcome: "所在地の特定",
    description: "3年前から連絡が取れない兄の居場所を探しています。",
    contactEmail: "client5@example.com"
  },
  {
    title: "社内不正の調査",
    category: "企業調査",
    area: "品川区",
    budgetMax: 350000,
    desiredOutcome: "写真・動画での証拠収集",
    description: "社員による横領が疑われており、証拠を掴みたいです。",
    contactEmail: "client6@example.com"
  },
  {
    title: "婚約者の素行調査",
    category: "浮気",
    area: "目黒区",
    budgetMax: 200000,
    desiredOutcome: "対象者の行動確認",
    description: "結婚を控えているため、相手の普段の行動を確認したいです。",
    contactEmail: "client7@example.com"
  },
  {
    title: "近隣住民からの嫌がらせ調査",
    category: "ストーカー",
    area: "大田区",
    budgetMax: 180000,
    desiredOutcome: "写真・動画での証拠収集",
    description: "近所の住民から嫌がらせを受けており、証拠を集めたいです。",
    contactEmail: "client8@example.com"
  },
  {
    title: "オンライン詐欺の調査",
    category: "詐欺",
    area: "中野区",
    budgetMax: 220000,
    desiredOutcome: "背景調査・身元確認",
    description: "SNSで知り合った人物からお金を騙し取られました。犯人を特定したいです。",
    contactEmail: "client9@example.com"
  },
  {
    title: "競合他社の動向調査",
    category: "企業調査",
    area: "杉並区",
    budgetMax: 320000,
    desiredOutcome: "背景調査・身元確認",
    description: "競合他社の新商品開発状況を調査してください。",
    contactEmail: "client10@example.com"
  },
  {
    title: "元従業員の情報漏洩調査",
    category: "企業調査",
    area: "豊島区",
    budgetMax: 450000,
    desiredOutcome: "写真・動画での証拠収集",
    description: "退職した元従業員による機密情報の漏洩が疑われます。",
    contactEmail: "client11@example.com"
  },
  {
    title: "配偶者の金銭トラブル調査",
    category: "浮気",
    area: "北区",
    budgetMax: 280000,
    desiredOutcome: "対象者の行動確認",
    description: "夫が借金をしているようで、詳細を調べてほしいです。",
    contactEmail: "client12@example.com"
  },
  {
    title: "SNSでの誹謗中傷者特定",
    category: "ストーカー",
    area: "荒川区",
    budgetMax: 160000,
    desiredOutcome: "背景調査・身元確認",
    description: "SNSで誹謗中傷を繰り返している相手を特定したいです。",
    contactEmail: "client13@example.com"
  },
  {
    title: "保険金詐欺の調査",
    category: "詐欺",
    area: "板橋区",
    budgetMax: 380000,
    desiredOutcome: "写真・動画での証拠収集",
    description: "従業員の労災申請に不審な点があり、調査をお願いします。",
    contactEmail: "client14@example.com"
  },
  {
    title: "子どもの交友関係調査",
    category: "その他",
    area: "練馬区",
    budgetMax: 150000,
    desiredOutcome: "対象者の行動確認",
    description: "高校生の子どもが最近帰りが遅く、交友関係を調べたいです。",
    contactEmail: "client15@example.com"
  },
  {
    title: "婚活相手の身元調査",
    category: "浮気",
    area: "足立区",
    budgetMax: 190000,
    desiredOutcome: "背景調査・身元確認",
    description: "婚活アプリで知り合った相手の経歴に疑問があります。",
    contactEmail: "client16@example.com"
  },
  {
    title: "職場でのパワハラ証拠収集",
    category: "その他",
    area: "葛飾区",
    budgetMax: 240000,
    desiredOutcome: "写真・動画での証拠収集",
    description: "上司からのパワハラの証拠を集めたいです。",
    contactEmail: "client17@example.com"
  },
  {
    title: "投資セミナー詐欺の調査",
    category: "詐欺",
    area: "江戸川区",
    budgetMax: 300000,
    desiredOutcome: "背景調査・身元確認",
    description: "怪しい投資セミナーの主催者について調べてください。",
    contactEmail: "client18@example.com"
  },
  {
    title: "元カレからの付きまとい調査",
    category: "ストーカー",
    area: "武蔵野市",
    budgetMax: 210000,
    desiredOutcome: "対象者の行動確認",
    description: "別れた元恋人が職場付近にいることが多く、不安です。",
    contactEmail: "client19@example.com"
  },
  {
    title: "相続人の所在調査",
    category: "その他",
    area: "立川市",
    budgetMax: 280000,
    desiredOutcome: "所在地の特定",
    description: "相続手続きのため、連絡の取れない相続人を探しています。",
    contactEmail: "client20@example.com"
  }
];

const sampleBids = [
  {
    agencyName: "東京総合探偵事務所",
    licenseNumber: "東京都公安委員会 第30120001号",
    quote: 250000,
    days: 7,
    proposal: "浮気調査の実績が豊富です。GPSを使った追跡と写真・動画による証拠収集を行います。料金は明確で追加費用は一切ございません。",
    contactEmail: "contact@tokyo-detective.com"
  },
  {
    agencyName: "首都圏リサーチ",
    licenseNumber: "東京都公安委員会 第30120002号", 
    quote: 280000,
    days: 10,
    proposal: "30年の実績があります。確実な証拠収集をお約束いたします。法廷でも通用する詳細な報告書を作成いたします。",
    contactEmail: "info@shutoken-research.jp"
  },
  {
    agencyName: "プライベート調査室",
    licenseNumber: "東京都公安委員会 第30120003号",
    quote: 200000,
    days: 5,
    proposal: "迅速な対応が自慢です。最新機材を使用した調査を実施します。24時間体制でサポートいたします。",
    contactEmail: "private@investigation.co.jp"
  },
  {
    agencyName: "都市型探偵サービス",
    licenseNumber: "東京都公安委員会 第30120004号",
    quote: 320000,
    days: 14,
    proposal: "ストーカー対策専門チームがあります。法的手続きのサポートも行います。アフターケアも充実しています。",
    contactEmail: "support@urban-detective.net"
  },
  {
    agencyName: "セキュリティ探偵局",
    licenseNumber: "東京都公安委員会 第30120005号",
    quote: 450000,
    days: 21,
    proposal: "企業調査に特化した専門チームです。詳細な背景調査を実施します。機密保持を徹底しております。",
    contactEmail: "corp@security-bureau.com"
  },
  {
    agencyName: "信頼調査事務所",
    licenseNumber: "東京都公安委員会 第30120006号",
    quote: 180000,
    days: 3,
    proposal: "スピード重視の調査が得意です。短期間で結果をお出しします。費用対効果を重視したプランをご提案します。",
    contactEmail: "trust@research-office.net"
  }
];

export async function POST() {
  try {
    await connectDB();

    // 既存データをクリア
    await Job.deleteMany({});
    await Bid.deleteMany({});

    // 案件データを挿入
    const jobs = await Job.insertMany(sampleJobs.map(job => ({
      ...job,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // 過去30日以内
    })));

    // 各案件にランダムで入札を追加
    let bidCount = 0;
    for (const job of jobs) {
      const numBids = Math.floor(Math.random() * 4) + 1; // 1-4件の入札
      
      for (let i = 0; i < numBids; i++) {
        const bidTemplate = sampleBids[i % sampleBids.length];
        if (!bidTemplate) continue;
        const bid = {
          ...bidTemplate,
          jobId: job._id,
          quote: Math.round((bidTemplate.quote + (Math.random() * 100000 - 50000)) / 10000) * 10000, // ±5万円の変動、1万円単位
          days: Math.max(1, bidTemplate.days + Math.floor(Math.random() * 7 - 3)), // ±3日の変動
          createdAt: new Date(job.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // 案件投稿後7日以内
        };

        await Bid.create(bid);
        bidCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${jobs.length}件の案件と${bidCount}件の入札を投入しました` 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "データ投入に失敗しました" }, { status: 500 });
  }
}