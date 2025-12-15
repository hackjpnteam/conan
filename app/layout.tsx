"use client";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function Header() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/docotan-logo.png"
            alt="DOCOTAN"
            width={180}
            height={60}
            className="h-10 sm:h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-3">
          <Link className="btn btn-secondary text-sm" href="/jobs">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            案件を見る
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  {user.userType === "client" && (
                    <Link className="btn btn-primary text-sm" href="/jobs/new">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      相談を投稿
                    </Link>
                  )}
                  <Link className="btn btn-secondary text-sm" href="/mypage">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    マイページ
                  </Link>
                  {user.role === "superadmin" && (
                    <Link className="btn text-sm bg-red-600 text-white hover:bg-red-700" href="/admin">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      管理者
                    </Link>
                  )}
                  <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.userType === "client" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {user.userType === "client" ? "依頼者" : "探偵"}
                    </div>
                    <span className="text-sm text-gray-700 max-w-[120px] truncate">
                      {user.name || user.companyName}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                    >
                      ログアウト
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link className="btn btn-secondary text-sm" href="/login">
                    ログイン
                  </Link>
                  <Link className="btn btn-primary text-sm" href="/register">
                    新規登録
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="メニュー"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          <nav className="container py-4 flex flex-col gap-3">
            {!loading && user && (
              <div className="flex items-center gap-2 pb-3 mb-1 border-b border-gray-100">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.userType === "client" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {user.userType === "client" ? "依頼者" : "探偵"}
                </div>
                <span className="text-sm text-gray-700 truncate flex-1">
                  {user.name || user.companyName}
                </span>
              </div>
            )}

            <Link
              className="btn btn-secondary justify-center"
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              案件を見る
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    {user.userType === "client" && (
                      <Link
                        className="btn btn-primary justify-center"
                        href="/jobs/new"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        相談を投稿
                      </Link>
                    )}
                    <Link
                      className="btn btn-secondary justify-center"
                      href="/mypage"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      マイページ
                    </Link>
                    {user.role === "superadmin" && (
                      <Link
                        className="btn justify-center bg-red-600 text-white hover:bg-red-700"
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        管理者ダッシュボード
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="btn btn-secondary justify-center text-gray-600"
                    >
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      className="btn btn-secondary justify-center"
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link
                      className="btn btn-primary justify-center"
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      新規登録
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>DOCOTAN 案件入札 - 安心の匿名相談</title>
        <meta name="description" content="匿名で探偵に相談。複数の見積もりを比較して最適な探偵事務所を選べます。" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main className="container py-8 pt-20 sm:pt-24 animate-fade-in min-h-screen">{children}</main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="container py-8 sm:py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
                <div className="col-span-2 md:col-span-1">
                  <div className="mb-4">
                    <Image
                      src="/docotan-logo.png"
                      alt="DOCOTAN"
                      width={140}
                      height={45}
                      className="h-8 sm:h-10 w-auto"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    匿名で安心の探偵相談サービス。
                    複数の見積もりを比較して、
                    最適な探偵事務所を選べます。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                    サービス
                  </h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-2">
                    <li>
                      <Link href="/about#anonymous" className="hover:text-blue-600 transition-colors">
                        完全匿名での相談が可能
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#compare" className="hover:text-blue-600 transition-colors">
                        複数の見積もりを比較
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#license" className="hover:text-blue-600 transition-colors">
                        届出番号確認済みの探偵
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                    安心・安全
                  </h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-2">
                    <li>
                      <Link href="/about#privacy" className="hover:text-emerald-600 transition-colors">
                        個人情報は非公開
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#prohibited" className="hover:text-emerald-600 transition-colors">
                        違法行為は禁止
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#security" className="hover:text-emerald-600 transition-colors">
                        SSL暗号化通信
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                    実績
                  </h3>
                  <div className="flex sm:flex-col gap-4 sm:gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">1,250+</span>
                      <span className="text-xs text-gray-500">成功件数</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-emerald-600">96.8%</span>
                      <span className="text-xs text-gray-500">満足度</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-gray-200 gap-3">
                <div className="text-xs text-gray-500 text-center sm:text-left">
                  © 2024 Detective Market. All rights reserved.
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">24時間365日受付</span>
                  <span className="text-xs text-gray-600">support@detective-market.jp</span>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
