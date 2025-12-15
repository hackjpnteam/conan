"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type JobLite = {
  _id: string;
  title: string;
  category: string;
  area: string;
  budgetMax: number;
  desiredOutcome: string;
  createdAt: string;
  status?: string;
};

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<JobLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilter(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = filter
    ? jobs.filter(j => j.category === filter)
    : jobs;

  const categories = ["浮気", "ストーカー", "詐欺", "企業調査", "人探し", "盗聴器発見", "素行調査", "その他"];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 text-gray-900">公開中の相談案件</h1>
        <p className="text-sm sm:text-base text-gray-600">探偵事務所の方は、下記案件に入札できます</p>
      </div>

      {/* Filter */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 pb-2 sm:flex-wrap sm:justify-center mb-6 sm:mb-8 min-w-max sm:min-w-0">
          <button
            onClick={() => setFilter("")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              !filter
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            すべて
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 sm:py-20">
          <div className="loading-spinner w-8 h-8 sm:w-10 sm:h-10 mx-auto border-4"></div>
          <p className="text-gray-500 mt-4 sm:mt-6 text-sm sm:text-base">読み込み中...</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredJobs.map((job, i) => (
            <Link
              key={job._id}
              href={`/jobs/${job._id}`}
              className="card group animate-slide-up"
              style={{animationDelay: `${i * 50}ms`}}
            >
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors flex-1 line-clamp-2">
                    {job.title}
                  </h2>
                  {job.status === "open" && (
                    <span className="badge badge-success text-xs shrink-0">募集中</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="badge badge-primary text-xs">{job.category}</span>
                  <span className="badge badge-warning text-xs">
                    <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.area}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">予算上限</div>
                    <div className="text-xl font-bold text-blue-600">
                      ¥{job.budgetMax.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-blue-600">
                    詳細
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h2>
                    {job.status === "open" && (
                      <span className="badge badge-success text-xs">募集中</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="badge badge-primary">{job.category}</span>
                    <span className="badge badge-warning">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.area}
                    </span>
                    <span className="text-sm text-gray-500">
                      希望成果: {job.desiredOutcome}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    投稿日: {new Date(job.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">予算上限</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ¥{job.budgetMax.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-3 flex items-center justify-end gap-1 group-hover:text-blue-600 transition-colors">
                    詳細を見る
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {filteredJobs.length === 0 && (
            <div className="card text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl flex items-center justify-center bg-blue-50">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-2 text-sm sm:text-base">
                {filter ? `「${filter}」の案件はありません` : "まだ案件がありません"}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">最初の相談を投稿してみましょう</p>
              <Link href="/jobs/new" className="btn btn-primary">
                相談を投稿する
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
