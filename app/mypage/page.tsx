"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type JobWithBids = {
  _id: string;
  title: string;
  category: string;
  area: string;
  budgetMax: number;
  status: string;
  createdAt: string;
  bidCount: number;
  recentBids: Array<{
    _id: string;
    agencyName: string;
    quote: number;
  }>;
};

type BidWithJob = {
  _id: string;
  jobId: string;
  agencyName: string;
  quote: number;
  days: number;
  createdAt: string;
  job: {
    _id: string;
    title: string;
    category: string;
    status: string;
  };
  messageCount: number;
  unreadCount: number;
};

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<JobWithBids[]>([]);
  const [bids, setBids] = useState<BidWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/mypage");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user?.userType === "client") {
        const res = await fetch("/api/users/jobs");
        if (res.ok) {
          setJobs(await res.json());
        }
      } else if (user?.userType === "agency") {
        const res = await fetch("/api/users/bids");
        if (res.ok) {
          setBids(await res.json());
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="text-center py-16 sm:py-20">
        <div className="loading-spinner w-8 h-8 sm:w-10 sm:h-10 mx-auto border-4"></div>
        <p className="text-gray-500 mt-4 text-sm sm:text-base">読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="card mb-6 bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center ${
            user.userType === "client" ? "bg-blue-100" : "bg-emerald-100"
          }`}>
            {user.userType === "client" ? (
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold">マイページ</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                user.userType === "client" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {user.userType === "client" ? "依頼者" : "探偵"}
              </span>
              {user.role === "superadmin" && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  管理者
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-gray-600">{user.name || user.companyName}</p>
          </div>
          {user.role === "superadmin" && (
            <Link
              href="/admin"
              className="btn bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              管理者ダッシュボード
            </Link>
          )}
        </div>
      </div>

      {/* Client View: My Jobs */}
      {user.userType === "client" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">投稿した相談 ({jobs.length}件)</h2>
            <Link href="/jobs/new" className="btn btn-primary text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規相談
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">まだ相談を投稿していません</p>
              <p className="text-sm text-gray-500 mb-4">匿名で探偵に相談してみましょう</p>
              <Link href="/jobs/new" className="btn btn-primary">
                相談を投稿する
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, i) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="card block group animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "open"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {job.status === "open" ? "募集中" : "終了"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="badge badge-primary">{job.category}</span>
                        <span>{job.area}</span>
                        <span>予算: ¥{job.budgetMax.toLocaleString()}</span>
                        <span>{new Date(job.createdAt).toLocaleDateString("ja-JP")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{job.bidCount}</div>
                        <div className="text-xs text-gray-500">件の入札</div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {job.bidCount > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">最新の入札:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.recentBids.map((bid) => (
                          <div key={bid._id} className="bg-gray-50 rounded-lg px-3 py-1.5 text-xs">
                            <span className="font-medium">{bid.agencyName}</span>
                            <span className="text-gray-500 ml-2">¥{bid.quote.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Agency View: My Bids */}
      {user.userType === "agency" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold">入札した案件 ({bids.length}件)</h2>
            <Link href="/jobs" className="btn btn-secondary text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              案件を探す
            </Link>
          </div>

          {bids.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">まだ入札していません</p>
              <p className="text-sm text-gray-500 mb-4">案件を探して入札してみましょう</p>
              <Link href="/jobs" className="btn bg-emerald-600 text-white hover:bg-emerald-700">
                案件を探す
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((bid, i) => (
                <div
                  key={bid._id}
                  className="card animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/jobs/${bid.job?._id}`}
                          className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
                        >
                          {bid.job?.title || "案件が削除されました"}
                        </Link>
                        {bid.job && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            bid.job.status === "open"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {bid.job.status === "open" ? "募集中" : "終了"}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                        {bid.job && (
                          <span className="badge badge-primary">{bid.job.category}</span>
                        )}
                        <span>入札日: {new Date(bid.createdAt).toLocaleDateString("ja-JP")}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">見積金額:</span>
                          <span className="font-semibold text-emerald-600 ml-1">¥{bid.quote.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">想定日数:</span>
                          <span className="font-semibold ml-1">{bid.days}日</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {bid.messageCount > 0 && (
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-sm font-medium">{bid.messageCount}</span>
                          </div>
                          {bid.unreadCount > 0 && (
                            <span className="text-xs text-red-500">{bid.unreadCount}件未読</span>
                          )}
                        </div>
                      )}
                      <Link
                        href={`/chat/${bid._id}`}
                        className="btn bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        チャット
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {user.userType === "client" ? (
          <>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
              <div className="text-xs text-gray-500">投稿した相談</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-emerald-600">
                {jobs.filter(j => j.status === "open").length}
              </div>
              <div className="text-xs text-gray-500">募集中</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-amber-600">
                {jobs.reduce((sum, j) => sum + j.bidCount, 0)}
              </div>
              <div className="text-xs text-gray-500">総入札数</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-gray-600">
                {jobs.filter(j => j.status !== "open").length}
              </div>
              <div className="text-xs text-gray-500">終了</div>
            </div>
          </>
        ) : (
          <>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-emerald-600">{bids.length}</div>
              <div className="text-xs text-gray-500">入札した案件</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-blue-600">
                {bids.filter(b => b.job?.status === "open").length}
              </div>
              <div className="text-xs text-gray-500">進行中</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-amber-600">
                {bids.reduce((sum, b) => sum + b.messageCount, 0)}
              </div>
              <div className="text-xs text-gray-500">総メッセージ</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-red-500">
                {bids.reduce((sum, b) => sum + b.unreadCount, 0)}
              </div>
              <div className="text-xs text-gray-500">未読</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
