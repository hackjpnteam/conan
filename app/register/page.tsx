"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserType = "client" | "agency" | null;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Client fields
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Agency fields
  const [licenseNumber, setLicenseNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);

    try {
      const body: any = {
        email,
        password,
        userType,
        phone
      };

      if (userType === "client") {
        body.name = isAnonymous ? "匿名" : name;
        body.isAnonymous = isAnonymous;
      } else {
        body.licenseNumber = licenseNumber;
        body.companyName = companyName;
        body.contactPerson = contactPerson;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Auto login after registration
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      router.push(userType === "client" ? "/jobs/new" : "/jobs");
      router.refresh();
    } catch (err) {
      setError("登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">新規登録</h1>
        <p className="text-sm sm:text-base text-gray-600">
          {step === 1 ? "ご登録の種類を選択してください" : "必要事項を入力してください"}
        </p>
      </div>

      {/* Step 1: Select User Type */}
      {step === 1 && (
        <div className="space-y-4">
          <button
            onClick={() => { setUserType("client"); setStep(2); }}
            className="card w-full text-left hover:border-blue-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">依頼者として登録</h3>
                <p className="text-sm text-gray-600">探偵に調査を依頼したい方</p>
                <p className="text-xs text-gray-500 mt-2">匿名での登録も可能です</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => { setUserType("agency"); setStep(2); }}
            className="card w-full text-left hover:border-emerald-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-600 transition-colors">探偵事務所として登録</h3>
                <p className="text-sm text-gray-600">案件を受注したい探偵事務所の方</p>
                <p className="text-xs text-gray-500 mt-2">届出番号等の情報が必要です</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              既にアカウントをお持ちの方は
              <Link href="/login" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="card">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              userType === "client" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
            }`}>
              {userType === "client" ? "依頼者登録" : "探偵事務所登録"}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Common fields */}
            <div>
              <label className="label">メールアドレス <span className="text-red-500">*</span></label>
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
              <label className="label">電話番号 <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
                placeholder="090-1234-5678"
                required
              />
            </div>

            <div>
              <label className="label">パスワード <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="6文字以上"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="label">パスワード（確認） <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="パスワードを再入力"
                required
              />
            </div>

            {/* Client-specific fields */}
            {userType === "client" && (
              <>
                <div className="pt-4 border-t">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">匿名で登録する</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="label">お名前 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      placeholder="山田 太郎"
                      required={!isAnonymous}
                    />
                  </div>
                )}
              </>
            )}

            {/* Agency-specific fields */}
            {userType === "agency" && (
              <>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-4">探偵業届出情報</p>
                </div>

                <div>
                  <label className="label">探偵業届出番号 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="input"
                    placeholder="第12345678号"
                    required
                  />
                </div>

                <div>
                  <label className="label">法人名（事務所名） <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="input"
                    placeholder="株式会社〇〇探偵事務所"
                    required
                  />
                </div>

                <div>
                  <label className="label">担当者名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="input"
                    placeholder="担当 太郎"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`btn w-full py-3 mt-6 ${
                userType === "client" ? "btn-primary" : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                "登録する"
              )}
            </button>
          </div>

          <div className="text-center pt-4 mt-4 border-t">
            <p className="text-sm text-gray-600">
              既にアカウントをお持ちの方は
              <Link href="/login" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
                ログイン
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
