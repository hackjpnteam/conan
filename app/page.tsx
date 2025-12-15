"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: "shield", title: "完全匿名", desc: "個人情報は一切公開されません", color: "blue" },
    { icon: "wallet", title: "無料相談", desc: "見積もり比較まで完全無料", color: "emerald" },
    { icon: "check", title: "安心保証", desc: "届出番号確認済みの探偵のみ", color: "amber" }
  ];

  const steps = [
    { num: "01", title: "相談内容を投稿", desc: "匿名で依頼内容を記入" },
    { num: "02", title: "見積もりを受取", desc: "複数の探偵から提案が届く" },
    { num: "03", title: "比較して選択", desc: "最適な探偵事務所を選ぶ" }
  ];

  const getIcon = (name: string, color: string) => {
    const colorClass = color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : 'text-amber-600';
    switch(name) {
      case 'shield':
        return (
          <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'wallet':
        return (
          <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'check':
        return (
          <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-12 sm:space-y-20 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="relative py-8 sm:py-16 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-transparent rounded-3xl"></div>

        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-100">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
          </svg>
          完全匿名・無料で相談できます
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900 px-2">
          探偵への相談を、
          <br />
          <span className="text-blue-600">もっと身近に</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
          完全匿名で複数の探偵事務所から見積もりを取得。
          <br className="hidden sm:block" />
          あなたに最適な探偵を見つけましょう。
        </p>
        <div className="flex gap-3 sm:gap-4 justify-center flex-col sm:flex-row px-4">
          <Link href="/jobs/new" className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            無料で相談を始める
          </Link>
          <Link href="/jobs" className="btn btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
            探偵の方はこちら
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 text-xs sm:text-sm text-gray-500 flex-wrap px-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
            </svg>
            SSL暗号化
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
            </svg>
            個人情報保護
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
            </svg>
            24時間対応
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="card text-center group animate-slide-up"
            style={{animationDelay: `${i * 100}ms`}}
          >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center ${
              feature.color === 'blue' ? 'bg-blue-50' :
              feature.color === 'emerald' ? 'bg-emerald-50' : 'bg-amber-50'
            }`}>
              {getIcon(feature.icon, feature.color)}
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Steps Section */}
      <section className="py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-gray-900">かんたん3ステップ</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">シンプルな手順で最適な探偵を見つけられます</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative animate-slide-up" style={{animationDelay: `${i * 150}ms`}}>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 -translate-x-1/2 bg-gradient-to-r from-blue-200 to-transparent" />
              )}
              <div className="text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 trust-gradient rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                  {step.num}
                </div>
                <h3 className="font-bold mb-1 sm:mb-2 text-gray-800 text-base sm:text-lg">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden trust-gradient rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-center text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 relative">今すぐ無料で相談を始めましょう</h2>
        <p className="mb-6 sm:mb-8 opacity-90 relative text-sm sm:text-base">24時間365日、いつでも匿名で相談可能です</p>
        <Link href="/jobs/new" className="btn bg-white text-blue-600 hover:bg-gray-50 px-6 sm:px-10 py-3 sm:py-4 font-bold text-base sm:text-lg relative shadow-lg">
          無料相談を開始
        </Link>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-gray-900">実績</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">多くのお客様のお悩みを解決してきました</p>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <div className="card text-center py-4 sm:py-6">
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-1 sm:mb-2">1,250+</div>
            <div className="text-gray-600 text-xs sm:text-base">成功件数</div>
          </div>
          <div className="card text-center py-4 sm:py-6">
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-emerald-600 mb-1 sm:mb-2">96.8%</div>
            <div className="text-gray-600 text-xs sm:text-base">顧客満足度</div>
          </div>
          <div className="card text-center py-4 sm:py-6">
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-amber-600 mb-1 sm:mb-2">15年</div>
            <div className="text-gray-600 text-xs sm:text-base">平均営業年数</div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { category: "浮気・不倫調査", count: "420件", success: "98.2%" },
            { category: "企業信用調査", count: "280件", success: "97.5%" },
            { category: "人探し・行方調査", count: "180件", success: "89.4%" },
            { category: "詐欺被害調査", count: "150件", success: "94.7%" },
            { category: "ストーカー対策", count: "120件", success: "96.7%" },
            { category: "素行調査", count: "85件", success: "99.1%" },
            { category: "盗聴器発見", count: "65件", success: "100%" },
            { category: "その他", count: "50件", success: "95.0%" }
          ].map((item, i) => (
            <div key={i} className="card text-center py-4 sm:py-5 animate-slide-up" style={{animationDelay: `${i * 50}ms`}}>
              <div className="font-semibold text-gray-700 mb-1 sm:mb-2 text-xs sm:text-sm">{item.category}</div>
              <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-0.5 sm:mb-1">{item.count}</div>
              <div className="text-xs text-gray-500">成功率 {item.success}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-gray-900">対応可能な相談内容</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">どのようなお悩みでもお気軽にご相談ください</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { name: "浮気・不倫調査", filter: "浮気", desc: "配偶者・恋人の浮気調査" },
            { name: "人探し・行方調査", filter: "人探し", desc: "家族・知人の所在調査" },
            { name: "ストーカー対策", filter: "ストーカー", desc: "つきまとい・嫌がらせ対策" },
            { name: "企業信用調査", filter: "企業調査", desc: "取引先・競合他社調査" },
            { name: "詐欺被害調査", filter: "詐欺", desc: "投資・オンライン詐欺調査" },
            { name: "盗聴器発見", filter: "盗聴器発見", desc: "盗聴・盗撮機器の発見" },
            { name: "素行調査", filter: "素行調査", desc: "身元・素行の詳細調査" },
            { name: "その他", filter: "その他", desc: "パワハラ・相続人調査など" }
          ].map((cat, i) => (
            <Link
              key={i}
              href={`/jobs?category=${encodeURIComponent(cat.filter)}`}
              className="card text-center py-4 sm:py-6 cursor-pointer group animate-slide-up"
              style={{animationDelay: `${i * 50}ms`}}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-all group-hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-800 mb-0.5 sm:mb-1">{cat.name}</div>
              <div className="text-xs text-gray-500 hidden sm:block">{cat.desc}</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8 sm:mt-10">
          <Link href="/jobs/new" className="btn btn-primary">
            無料で相談を開始
          </Link>
        </div>
      </section>
    </div>
  );
}
