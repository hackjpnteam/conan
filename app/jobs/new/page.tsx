"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function NewJobPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    category: "",
    area: "",
    budgetMax: 200000,
    desiredOutcome: "",
    description: "",
    contactEmail: ""
  });

  // Redirect if not logged in as client
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/jobs/new");
    }
    if (!authLoading && user && user.userType !== "client") {
      router.push("/jobs");
    }
    // Pre-fill email from user
    if (user?.email) {
      setForm(f => ({ ...f, contactEmail: user.email }));
    }
  }, [user, authLoading, router]);

  const categories = [
    { value: "浮気", label: "浮気・不倫調査", icon: "💔" },
    { value: "ストーカー", label: "ストーカー対策", icon: "🚨" },
    { value: "詐欺", label: "詐欺被害調査", icon: "⚠️" },
    { value: "企業調査", label: "企業信用調査", icon: "🏢" },
    { value: "人探し", label: "人探し・行方調査", icon: "🔍" },
    { value: "盗聴器発見", label: "盗聴器発見", icon: "📡" },
    { value: "素行調査", label: "素行調査", icon: "👤" },
    { value: "その他", label: "その他", icon: "📝" }
  ];

  const outcomes = [
    "写真・動画での証拠収集",
    "対象者の行動確認",
    "接触・面会の確認",
    "所在地の特定",
    "背景調査・身元確認",
    "その他"
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userId: user?.userId
        })
      });

      if (res.ok) {
        const job = await res.json();
        setSuccess(true);
        setTimeout(() => {
          router.push(`/jobs/${job._id}`);
        }, 2000);
      } else {
        alert("投稿に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      alert("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!form.category || !form.area || !form.budgetMax)) {
      alert("すべての項目を入力してください");
      return;
    }
    if (step === 2 && (!form.title || !form.desiredOutcome)) {
      alert("すべての項目を入力してください");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="text-center py-20">
        <div className="loading-spinner w-10 h-10 mx-auto border-4"></div>
        <p className="text-gray-500 mt-4">読み込み中...</p>
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!user || user.userType !== "client") {
    return (
      <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">ログインが必要です</h2>
        <p className="text-gray-600 mb-6">相談を投稿するには依頼者としてログインしてください</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login?redirect=/jobs/new" className="btn btn-primary">
            ログイン
          </Link>
          <Link href="/register" className="btn btn-secondary">
            新規登録
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-white animate-bounce">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">投稿が完了しました！</h2>
        <p className="text-gray-600">案件詳細ページへ移動します...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">匿名で相談を投稿</h1>
        <p className="text-sm sm:text-base text-gray-600">個人情報は一切公開されません</p>
      </div>

      {/* プログレスバー */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base ${
              step >= s ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 text-gray-400'
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-12 sm:w-20 h-1 mx-1 sm:mx-2 transition-all ${
                step > s ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="card">
        {/* Step 1: 基本情報 */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-lg sm:text-xl font-bold mb-4">ステップ1: 基本情報</h2>

            <div>
              <label className="label">相談カテゴリー</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm({...form, category: cat.value})}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                      form.category === cat.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs sm:text-sm font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">市区町村（公開情報）</label>
                <input
                  className="input"
                  placeholder="例: 渋谷区"
                  value={form.area}
                  onChange={e => setForm({...form, area: e.target.value})}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">詳細な住所は公開されません</p>
              </div>
              <div>
                <label className="label">予算上限（円）</label>
                <input
                  type="number"
                  className="input"
                  value={form.budgetMax}
                  onChange={e => setForm({...form, budgetMax: Number(e.target.value)})}
                  required
                  min="10000"
                  step="10000"
                />
                <p className="text-xs text-gray-500 mt-1">目安: 10万円〜50万円</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={nextStep} className="btn btn-primary">
                次へ進む
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 詳細情報 */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-lg sm:text-xl font-bold mb-4">ステップ2: 相談内容</h2>

            <div>
              <label className="label">相談タイトル（公開情報）</label>
              <input
                className="input"
                placeholder="例: 配偶者の浮気調査をお願いしたい"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="label">望む成果（公開情報）</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {outcomes.map(outcome => (
                  <button
                    key={outcome}
                    type="button"
                    onClick={() => setForm({...form, desiredOutcome: outcome})}
                    className={`p-2 sm:p-3 rounded-lg border text-left transition-all ${
                      form.desiredOutcome === outcome
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{outcome}</span>
                  </button>
                ))}
              </div>
              {form.desiredOutcome === "その他" && (
                <input
                  className="input"
                  placeholder="具体的に記入してください"
                  value={form.desiredOutcome === "その他" ? "" : form.desiredOutcome}
                  onChange={e => setForm({...form, desiredOutcome: e.target.value})}
                  required
                />
              )}
            </div>

            <div>
              <label className="label">詳細説明（非公開）</label>
              <textarea
                className="input min-h-[120px] sm:min-h-[150px] resize-none"
                placeholder="対象者の情報、調査したい期間、その他要望など&#10;この情報は公開されません"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                この内容は探偵事務所にのみ開示されます
              </p>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="btn btn-secondary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                戻る
              </button>
              <button type="button" onClick={nextStep} className="btn btn-primary">
                次へ進む
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 連絡先 */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-lg sm:text-xl font-bold mb-4">ステップ3: 連絡先情報</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-xs sm:text-sm text-amber-800">
                  <p className="font-semibold mb-1">プライバシー保護について</p>
                  <p>メールアドレスは探偵事務所からの連絡にのみ使用され、第三者に公開されることはありません。</p>
                </div>
              </div>
            </div>

            <div>
              <label className="label">連絡先メールアドレス（非公開）</label>
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
                value={form.contactEmail}
                onChange={e => setForm({...form, contactEmail: e.target.value})}
                required
              />
              <p className="text-xs text-gray-500 mt-1">探偵事務所からの見積もりはこちらに届きます</p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3 text-sm sm:text-base">投稿内容の確認</h3>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">カテゴリー:</span>
                  <span className="font-medium">{form.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">地域:</span>
                  <span className="font-medium">{form.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">予算上限:</span>
                  <span className="font-medium">¥{form.budgetMax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">望む成果:</span>
                  <span className="font-medium">{form.desiredOutcome}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 mb-4">
              <input type="checkbox" id="agree" required className="mt-1" />
              <label htmlFor="agree" className="text-xs sm:text-sm text-gray-600">
                利用規約に同意し、違法行為の依頼ではないことを確認しました
              </label>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="btn btn-secondary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                戻る
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary min-w-[120px] sm:min-w-[150px]"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner mr-2"></span>
                    投稿中...
                  </>
                ) : (
                  <>
                    投稿する
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
