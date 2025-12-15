"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  jobId: string;
  onSuccess?: () => void;
};

export default function BidForm({ jobId, onSuccess }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    agencyName: "",
    licenseNumber: "",
    quote: 200000,
    days: 3,
    proposal: "",
    contactEmail: ""
  });

  // Pre-fill form with user data
  useEffect(() => {
    if (user && user.userType === "agency") {
      setForm(f => ({
        ...f,
        agencyName: user.companyName || "",
        licenseNumber: user.licenseNumber || "",
        contactEmail: user.email
      }));
    }
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          jobId,
          userId: user?.userId
        })
      });

      if (res.ok) {
        setSuccess(true);
        setShowForm(false);
        if (onSuccess) onSuccess();

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        alert("送信に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      alert("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-center py-6 sm:py-8 animate-slide-up">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-emerald-500 rounded-full flex items-center justify-center text-white">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-emerald-900 mb-1">入札が完了しました！</h3>
        <p className="text-xs sm:text-sm text-emerald-700">依頼者からの連絡をお待ちください</p>
      </div>
    );
  }

  // Show login prompt for non-logged-in users or clients
  if (!authLoading && (!user || user.userType !== "agency")) {
    return (
      <div className="card bg-gradient-to-r from-gray-50 to-emerald-50 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-xl bg-emerald-50 flex items-center justify-center">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-bold mb-2">探偵事務所の方へ</h2>
        <p className="text-sm text-gray-600 mb-4">この案件に入札するには探偵事務所としてログインしてください</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/login?redirect=/jobs/${jobId}`} className="btn bg-emerald-600 text-white hover:bg-emerald-700">
            ログイン
          </Link>
          <Link href="/register" className="btn btn-secondary">
            新規登録
          </Link>
        </div>
      </div>
    );
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="card text-center py-8">
        <div className="loading-spinner w-8 h-8 mx-auto border-4"></div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="card bg-gradient-to-r from-gray-50 to-emerald-50 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            探偵
          </div>
          <span className="text-sm text-gray-700">{user?.companyName}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold mb-2">この案件に入札する</h2>
        <p className="text-sm text-gray-600 mb-4">入札して新規顧客を獲得しましょう</p>
        <button
          onClick={() => setShowForm(true)}
          className="btn bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          入札フォームを開く
        </button>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">入札フォーム</h2>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">事務所名</label>
            <input
              className="input bg-gray-50"
              value={form.agencyName}
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">登録情報から自動入力</p>
          </div>
          <div>
            <label className="label">探偵業届出番号</label>
            <input
              className="input bg-gray-50"
              value={form.licenseNumber}
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">登録情報から自動入力</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label">見積金額（円）</label>
            <input
              type="number"
              className="input"
              value={form.quote}
              onChange={e => setForm({...form, quote: Number(e.target.value)})}
              required
              min="10000"
              step="10000"
            />
          </div>
          <div>
            <label className="label">想定調査日数</label>
            <input
              type="number"
              className="input"
              value={form.days}
              onChange={e => setForm({...form, days: Number(e.target.value)})}
              required
              min="1"
            />
          </div>
          <div>
            <label className="label">連絡先メール</label>
            <input
              type="email"
              className="input bg-gray-50"
              value={form.contactEmail}
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="label">提案内容</label>
          <textarea
            className="input min-h-[100px] sm:min-h-[120px] resize-none"
            placeholder="調査方法、実績、強みなどをアピールしてください"
            value={form.proposal}
            onChange={e => setForm({...form, proposal: e.target.value})}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            依頼者に選ばれるよう、具体的で魅力的な提案を記載してください
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs text-amber-800">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            入札後の変更・取消はできません。内容をよくご確認ください。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="btn btn-secondary order-2 sm:order-1"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn bg-emerald-600 text-white hover:bg-emerald-700 min-w-[120px] sm:min-w-[150px] order-1 sm:order-2"
          >
            {loading ? (
              <>
                <span className="loading-spinner mr-2"></span>
                送信中...
              </>
            ) : (
              <>
                入札を送信
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
