"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    // ハッシュがある場合、該当セクションにスクロール
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">DOCOTANについて</h1>
        <p className="text-gray-600">
          安心・安全な探偵マッチングサービスをご提供します
        </p>
      </div>

      {/* Navigation */}
      <div className="card bg-gray-50">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <a href="#anonymous" className="text-sm text-blue-600 hover:underline">匿名相談</a>
          <a href="#compare" className="text-sm text-blue-600 hover:underline">見積もり比較</a>
          <a href="#license" className="text-sm text-blue-600 hover:underline">届出番号確認</a>
          <a href="#privacy" className="text-sm text-blue-600 hover:underline">個人情報保護</a>
          <a href="#prohibited" className="text-sm text-blue-600 hover:underline">禁止事項</a>
          <a href="#security" className="text-sm text-blue-600 hover:underline">SSL暗号化</a>
        </div>
      </div>

      {/* 完全匿名での相談 */}
      <section id="anonymous" className="card scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">完全匿名での相談が可能</h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>
            DOCOTANでは、ご相談内容を完全に匿名で投稿することができます。
            お名前や連絡先などの個人情報を探偵事務所に公開することなく、安心してご相談いただけます。
          </p>
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">匿名相談の仕組み</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                相談投稿時に個人情報の入力は不要
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                探偵事務所には相談内容のみが公開されます
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                正式依頼時まで連絡先の交換は不要
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                プラットフォーム内でのチャット機能で安全にやり取り
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 複数の見積もりを比較 */}
      <section id="compare" className="card scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">複数の見積もりを比較</h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>
            一つの相談に対して、複数の探偵事務所から見積もりを受け取ることができます。
            金額だけでなく、提案内容や対応の丁寧さなども比較して、最適な探偵事務所をお選びいただけます。
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">平均5件</div>
              <div className="text-sm text-gray-600">1相談あたりの入札数</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">24時間</div>
              <div className="text-sm text-gray-600">最初の入札までの時間</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-1">無料</div>
              <div className="text-sm text-gray-600">相談・見積もり比較</div>
            </div>
          </div>
        </div>
      </section>

      {/* 届出番号確認済みの探偵 */}
      <section id="license" className="card scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">届出番号確認済みの探偵</h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>
            DOCOTANに登録している全ての探偵事務所は、探偵業法に基づく届出を行っている正規の事業者です。
            届出番号を確認済みの事務所のみがサービスを利用できます。
          </p>
          <div className="bg-amber-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">探偵業届出制度とは</h3>
            <p className="text-sm mb-3">
              探偵業を営むには、営業所の所在地を管轄する都道府県公安委員会への届出が法律で義務付けられています。
              届出を行った事業者には「探偵業届出証明書」が交付され、届出番号が付与されます。
            </p>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>届出番号は各入札に表示されます</span>
            </div>
          </div>
        </div>
      </section>

      {/* 個人情報は非公開 */}
      <section id="privacy" className="card scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">個人情報は非公開</h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>
            お客様の個人情報は厳重に管理され、ご本人の同意なく第三者に公開されることはありません。
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <svg className="w-6 h-6 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-medium">相談投稿時</h4>
                <p className="text-sm text-gray-600">氏名・住所・電話番号は探偵事務所に公開されません</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <svg className="w-6 h-6 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-medium">チャット機能</h4>
                <p className="text-sm text-gray-600">プラットフォーム内で完結。外部への連絡先交換は任意です</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <svg className="w-6 h-6 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-medium">データ管理</h4>
                <p className="text-sm text-gray-600">暗号化されたデータベースで安全に管理</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 違法行為は禁止 */}
      <section id="prohibited" className="card scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">違法行為は禁止</h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>
            DOCOTANでは、法律に違反する調査依頼を固く禁止しています。
            違法な依頼は即座に削除され、悪質な場合はアカウント停止となります。
          </p>
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-red-800">禁止される調査依頼の例</h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                ストーカー行為を目的とした調査
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                差別を目的とした身元調査
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                DV加害者による被害者の居場所特定
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                犯罪行為の支援を目的とした調査
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            探偵業法第9条により、探偵事務所は違法または不当な行為のために調査結果を使用しないよう、
            依頼者に対して説明・書面交付を行う義務があります。
          </p>
        </div>
      </section>

      {/* SSL暗号化通信 */}
      <section id="security" className="card scroll-mt-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">SSL暗号化通信</h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p>
            DOCOTANでは、お客様の通信内容を保護するため、SSL/TLS暗号化通信を採用しています。
            入力された情報は全て暗号化されて送信されるため、第三者による盗聴を防止します。
          </p>
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">セキュリティ対策</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                256ビットSSL/TLS暗号化通信
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                パスワードのハッシュ化保存
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                定期的なセキュリティ監査
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                不正アクセス検知システム
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>ブラウザのアドレスバーに鍵マークが表示されていることをご確認ください</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="card bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200 text-center">
        <h2 className="text-xl font-bold mb-2">今すぐ匿名で相談する</h2>
        <p className="text-gray-600 mb-4">無料で見積もりを受け取れます</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/jobs/new" className="btn btn-primary">
            相談を投稿する
          </Link>
          <Link href="/jobs" className="btn btn-secondary">
            案件を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
