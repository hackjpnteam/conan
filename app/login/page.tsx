"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || "ログインに失敗しました");
      setLoading(false);
      return;
    }

    router.push(redirect as any);
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">ログイン</h1>
        <p className="text-sm sm:text-base text-gray-600">
          アカウントにログインしてください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="label">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="label">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="パスワードを入力"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3"
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              "ログイン"
            )}
          </button>
        </div>

        <div className="text-center pt-4 mt-4 border-t">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない方は
            <Link href="/register" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
              新規登録
            </Link>
          </p>
        </div>
      </form>

      {/* User type info */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="card text-center py-4">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">依頼者の方</p>
          <p className="text-xs text-gray-500">相談を投稿できます</p>
        </div>
        <div className="card text-center py-4">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-xs text-gray-600">探偵事務所の方</p>
          <p className="text-xs text-gray-500">案件に入札できます</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16 sm:py-20">
        <div className="loading-spinner w-8 h-8 sm:w-10 sm:h-10 mx-auto border-4"></div>
        <p className="text-gray-500 mt-4 sm:mt-6 text-sm sm:text-base">読み込み中...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
