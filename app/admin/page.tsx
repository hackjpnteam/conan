"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

type Stats = {
  counts: {
    totalUsers: number;
    clientCount: number;
    agencyCount: number;
    totalJobs: number;
    openJobs: number;
    closedJobs: number;
    totalBids: number;
    totalMessages: number;
  };
  today: {
    users: number;
    jobs: number;
    bids: number;
  };
  recent: {
    users: any[];
    jobs: any[];
    bids: any[];
  };
};

type User = {
  _id: string;
  email: string;
  userType: "client" | "agency";
  role: string;
  name?: string;
  companyName?: string;
  phone: string;
  licenseNumber?: string;
  createdAt: string;
};

type Job = {
  _id: string;
  title: string;
  category: string;
  area: string;
  budgetMax: number;
  status: string;
  createdAt: string;
  user?: User;
  bidCount: number;
};

type Bid = {
  _id: string;
  agencyName: string;
  quote: number;
  days: number;
  createdAt: string;
  job?: Job;
  user?: User;
  messageCount: number;
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "jobs" | "bids">("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [userTypeFilter, setUserTypeFilter] = useState<string>("");
  const [jobStatusFilter, setJobStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "superadmin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "superadmin") {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      if (activeTab === "dashboard") {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } else if (activeTab === "users") {
        const params = new URLSearchParams();
        if (userTypeFilter) params.set("userType", userTypeFilter);
        if (searchTerm) params.set("search", searchTerm);
        const res = await fetch(`/api/admin/users?${params}`);
        const data = await res.json();
        setUsers(data);
      } else if (activeTab === "jobs") {
        const params = new URLSearchParams();
        if (jobStatusFilter) params.set("status", jobStatusFilter);
        if (searchTerm) params.set("search", searchTerm);
        const res = await fetch(`/api/admin/jobs?${params}`);
        const data = await res.json();
        setJobs(data);
      } else if (activeTab === "bids") {
        const params = new URLSearchParams();
        if (searchTerm) params.set("search", searchTerm);
        const res = await fetch(`/api/admin/bids?${params}`);
        const data = await res.json();
        setBids(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("このユーザーを削除しますか？")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "削除に失敗しました");
      }
    } catch (error) {
      alert("削除に失敗しました");
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("この案件と関連する入札・メッセージをすべて削除しますか？")) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter((j) => j._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "削除に失敗しました");
      }
    } catch (error) {
      alert("削除に失敗しました");
    }
  };

  const handleDeleteBid = async (id: string) => {
    if (!confirm("この入札と関連するメッセージをすべて削除しますか？")) return;
    try {
      const res = await fetch(`/api/admin/bids/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBids(bids.filter((b) => b._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "削除に失敗しました");
      }
    } catch (error) {
      alert("削除に失敗しました");
    }
  };

  const handleCloseJob = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" })
      });
      if (res.ok) {
        setJobs(jobs.map((j) => (j._id === id ? { ...j, status: "closed" } : j)));
      }
    } catch (error) {
      alert("更新に失敗しました");
    }
  };

  const handleReopenJob = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "open" })
      });
      if (res.ok) {
        setJobs(jobs.map((j) => (j._id === id ? { ...j, status: "open" } : j)));
      }
    } catch (error) {
      alert("更新に失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "superadmin") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          管理者ダッシュボード
        </h1>
        <p className="text-gray-600 text-sm mt-1">スーパーアドミンとしてログイン中</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: "dashboard", label: "概要", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { key: "users", label: "ユーザー", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
          { key: "jobs", label: "案件", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          { key: "bids", label: "入札", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card bg-blue-50 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">総ユーザー</div>
              <div className="text-3xl font-bold text-blue-700">{stats.counts.totalUsers}</div>
              <div className="text-xs text-blue-500 mt-1">
                依頼者: {stats.counts.clientCount} / 探偵: {stats.counts.agencyCount}
              </div>
            </div>
            <div className="card bg-emerald-50 border border-emerald-200">
              <div className="text-sm text-emerald-600 font-medium">総案件</div>
              <div className="text-3xl font-bold text-emerald-700">{stats.counts.totalJobs}</div>
              <div className="text-xs text-emerald-500 mt-1">
                受付中: {stats.counts.openJobs} / 終了: {stats.counts.closedJobs}
              </div>
            </div>
            <div className="card bg-amber-50 border border-amber-200">
              <div className="text-sm text-amber-600 font-medium">総入札</div>
              <div className="text-3xl font-bold text-amber-700">{stats.counts.totalBids}</div>
            </div>
            <div className="card bg-purple-50 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">総メッセージ</div>
              <div className="text-3xl font-bold text-purple-700">{stats.counts.totalMessages}</div>
            </div>
          </div>

          {/* Today's Activity */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">本日のアクティビティ</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{stats.today.users}</div>
                <div className="text-xs text-gray-500">新規ユーザー</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{stats.today.jobs}</div>
                <div className="text-xs text-gray-500">新規案件</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{stats.today.bids}</div>
                <div className="text-xs text-gray-500">新規入札</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-3">最近のユーザー</h3>
              <div className="space-y-2">
                {stats.recent.users.map((u: any) => (
                  <div key={u._id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{u.name || u.companyName}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      u.userType === "client" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                    }`}>
                      {u.userType === "client" ? "依頼者" : "探偵"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-3">最近の案件</h3>
              <div className="space-y-2">
                {stats.recent.jobs.map((j: any) => (
                  <div key={j._id} className="text-sm p-2 bg-gray-50 rounded">
                    <div className="font-medium truncate">{j.title}</div>
                    <div className="text-xs text-gray-500">{j.category} / {j.area}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-3">最近の入札</h3>
              <div className="space-y-2">
                {stats.recent.bids.map((b: any) => (
                  <div key={b._id} className="text-sm p-2 bg-gray-50 rounded">
                    <div className="font-medium">{b.agencyName}</div>
                    <div className="text-xs text-gray-500">¥{b.quote.toLocaleString()} / {b.days}日</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="input py-2 w-auto"
            >
              <option value="">全てのユーザー</option>
              <option value="client">依頼者のみ</option>
              <option value="agency">探偵のみ</option>
            </select>
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input py-2 w-64"
            />
            <button onClick={fetchData} className="btn btn-secondary py-2">
              検索
            </button>
          </div>

          {dataLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">ユーザー</th>
                    <th className="text-left py-3 px-2">種別</th>
                    <th className="text-left py-3 px-2">メール</th>
                    <th className="text-left py-3 px-2">電話</th>
                    <th className="text-left py-3 px-2">登録日</th>
                    <th className="text-left py-3 px-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium">{u.name || u.companyName}</div>
                        {u.licenseNumber && (
                          <div className="text-xs text-gray-500">届出番号: {u.licenseNumber}</div>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          u.userType === "client" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                        }`}>
                          {u.userType === "client" ? "依頼者" : "探偵"}
                        </span>
                        {u.role === "superadmin" && (
                          <span className="ml-1 px-2 py-0.5 rounded text-xs bg-red-100 text-red-600">Admin</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-600">{u.email}</td>
                      <td className="py-3 px-2 text-gray-600">{u.phone}</td>
                      <td className="py-3 px-2 text-gray-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("ja-JP")}
                      </td>
                      <td className="py-3 px-2">
                        {u.role !== "superadmin" && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            削除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">ユーザーが見つかりません</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value)}
              className="input py-2 w-auto"
            >
              <option value="">全てのステータス</option>
              <option value="open">受付中</option>
              <option value="closed">終了</option>
            </select>
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input py-2 w-64"
            />
            <button onClick={fetchData} className="btn btn-secondary py-2">
              検索
            </button>
          </div>

          {dataLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job._id} className="card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/jobs/${job._id}`} className="font-semibold text-gray-800 hover:text-blue-600">
                          {job.title}
                        </Link>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          job.status === "open" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        }`}>
                          {job.status === "open" ? "受付中" : "終了"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {job.category} / {job.area} / 予算: ¥{job.budgetMax.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        投稿者: {job.user?.name || job.user?.companyName || "不明"} ({job.user?.email})
                        <span className="mx-2">|</span>
                        入札数: {job.bidCount}
                        <span className="mx-2">|</span>
                        {new Date(job.createdAt).toLocaleDateString("ja-JP")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {job.status === "open" ? (
                        <button
                          onClick={() => handleCloseJob(job._id)}
                          className="text-amber-600 hover:text-amber-800 text-xs px-2 py-1 border border-amber-300 rounded"
                        >
                          終了にする
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReopenJob(job._id)}
                          className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border border-green-300 rounded"
                        >
                          再開する
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-300 rounded"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="text-center py-8 text-gray-500 card">案件が見つかりません</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bids Tab */}
      {activeTab === "bids" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input py-2 w-64"
            />
            <button onClick={fetchData} className="btn btn-secondary py-2">
              検索
            </button>
          </div>

          {dataLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((bid) => (
                <div key={bid._id} className="card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 mb-1">{bid.agencyName}</div>
                      <div className="text-sm text-gray-600">
                        見積: ¥{bid.quote.toLocaleString()} / {bid.days}日
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        案件: {bid.job?.title || "削除済み"}
                        <span className="mx-2">|</span>
                        メッセージ数: {bid.messageCount}
                        <span className="mx-2">|</span>
                        {new Date(bid.createdAt).toLocaleDateString("ja-JP")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {bid.job && (
                        <Link
                          href={`/chat/${bid._id}`}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded"
                        >
                          チャット確認
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteBid(bid._id)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-300 rounded"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {bids.length === 0 && (
                <div className="text-center py-8 text-gray-500 card">入札が見つかりません</div>
              )}
            </div>
          )}
        </div>
      )}

      {dataLoading && activeTab === "dashboard" && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
