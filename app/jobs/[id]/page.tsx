"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BidForm from "./parts/BidForm";

type JobDetail = {
  _id: string;
  title: string;
  category: string;
  area: string;
  budgetMax: number;
  desiredOutcome: string;
  status: string;
  createdAt: string;
};

type Bid = {
  _id: string;
  jobId: string;
  agencyName: string;
  licenseNumber: string;
  quote: number;
  days: number;
  proposal: string;
  createdAt: string;
  userId?: string;
};

type User = {
  userId: string;
  email: string;
  userType: "client" | "agency";
  role?: string;
};

export default function JobPage({ params }: { params: { id: string }}) {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
    fetchUser();
  }, [params.id, refreshKey]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        // セッションAPIは { user: sessionData } を返す
        if (data.user && data.user.userId) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const [jobRes, bidsRes] = await Promise.all([
        fetch(`/api/jobs/${params.id}`),
        fetch(`/api/bids?jobId=${params.id}`)
      ]);

      if (jobRes.ok) {
        setJob(await jobRes.json());
      }
      if (bidsRes.ok) {
        setBids(await bidsRes.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 sm:py-20">
        <div className="loading-spinner w-8 h-8 sm:w-10 sm:h-10 mx-auto border-4"></div>
        <p className="text-gray-500 mt-4 text-sm sm:text-base">読み込み中...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16 sm:py-20">
        <h2 className="text-lg sm:text-xl font-bold mb-2">案件が見つかりません</h2>
        <a href="/jobs" className="btn btn-primary mt-4">案件一覧へ戻る</a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
      {/* ヘッダー情報 */}
      <div className="card bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start sm:items-center gap-2 mb-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold">{job.title}</h1>
              {job.status === "open" && (
                <span className="badge badge-success">募集中</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {job.category}
              </span>
              <span className="badge badge-warning">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.area}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">
                <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                望む成果: {job.desiredOutcome}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-center flex sm:block items-center justify-between border-t sm:border-t-0 pt-3 sm:pt-0">
            <div className="text-xs sm:text-sm text-gray-600 mb-0 sm:mb-1">予算上限</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              ¥{job.budgetMax.toLocaleString()}
            </div>
            <div className="hidden sm:block text-xs text-gray-500 mt-1">
              投稿: {new Date(job.createdAt).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>
      </div>

      {/* 入札一覧 */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold">
                入札一覧 ({bids.length}件)
              </h2>
              <button
                onClick={() => setRefreshKey(k => k + 1)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                更新
              </button>
            </div>

            {bids.length === 0 ? (
              <div className="text-center py-10 sm:py-12 bg-gray-50 rounded-xl">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 mb-2 text-sm sm:text-base">まだ入札がありません</p>
                <p className="text-xs sm:text-sm text-gray-400">探偵事務所からの提案をお待ちください</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bids.map((bid, i) => (
                  <div
                    key={bid._id}
                    onClick={() => setSelectedBid(selectedBid === bid._id ? null : bid._id)}
                    className={`border rounded-xl p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md animate-slide-up ${
                      selectedBid === bid._id ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'
                    }`}
                    style={{animationDelay: `${i * 50}ms`}}
                  >
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div>
                        <div className="font-semibold text-base sm:text-lg">{bid.agencyName}</div>
                        <div className="text-xs text-gray-600 mt-0.5 sm:mt-1">
                          届出番号: {bid.licenseNumber}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600">見積金額</div>
                        <div className="text-lg sm:text-xl font-bold text-blue-600">
                          ¥{bid.quote.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                          想定 {bid.days}日間
                        </div>
                      </div>
                    </div>

                    <div className={`overflow-hidden transition-all ${
                      selectedBid === bid._id ? 'max-h-96' : 'max-h-16 sm:max-h-20'
                    }`}>
                      <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {bid.proposal}
                      </div>
                      {selectedBid === bid._id && (
                        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <span className="text-xs text-gray-500">
                            入札日: {new Date(bid.createdAt).toLocaleDateString('ja-JP')}
                          </span>
                          <Link
                            href={`/chat/${bid._id}`}
                            className="btn btn-primary text-sm w-full sm:w-auto justify-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {user?.userType === "agency" ? "依頼者とチャット" : "この探偵に連絡する"}
                          </Link>
                        </div>
                      )}
                    </div>

                    {selectedBid !== bid._id && (
                      <div className="text-xs text-blue-600 mt-2">
                        クリックして詳細を見る →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-4">
          {/* 統計情報 */}
          <div className="card bg-gradient-to-br from-blue-50 to-sky-50">
            <h3 className="font-semibold mb-3 text-sm sm:text-base">入札状況</h3>
            <div className="space-y-2">
              {bids.length > 0 && (
                <>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">平均見積額:</span>
                    <span className="font-semibold">
                      ¥{Math.round(bids.reduce((a, b) => a + b.quote, 0) / bids.length).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">最低見積額:</span>
                    <span className="font-semibold text-green-600">
                      ¥{Math.min(...bids.map(b => b.quote)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">平均想定日数:</span>
                    <span className="font-semibold">
                      {Math.round(bids.reduce((a, b) => a + b.days, 0) / bids.length)}日
                    </span>
                  </div>
                </>
              )}
              <div className="pt-2 mt-2 border-t">
                <div className="text-xs text-gray-500">
                  <svg className="w-3 h-3 inline mr-1 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  より多くの提案を受けるために、詳細な情報を記載することをお勧めします
                </div>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="card border-amber-200 bg-amber-50">
            <h3 className="font-semibold mb-2 text-amber-900 text-sm sm:text-base">ご注意</h3>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• 探偵との契約は慎重に行ってください</li>
              <li>• 届出番号の確認をお勧めします</li>
              <li>• 違法な調査依頼は禁止されています</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 探偵向け入札フォーム */}
      <BidForm jobId={job._id} onSuccess={() => setRefreshKey(k => k + 1)} />
    </div>
  );
}
