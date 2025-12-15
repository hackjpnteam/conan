"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Message = {
  _id: string;
  jobId: string;
  bidId: string;
  senderType: "client" | "agency";
  content: string;
  read: boolean;
  createdAt: string;
};

type BidInfo = {
  _id: string;
  jobId: string;
  agencyName: string;
  quote: number;
  days: number;
};

type JobInfo = {
  _id: string;
  title: string;
  category: string;
};

type User = {
  userId: string;
  userType: "client" | "agency";
  name?: string;
  companyName?: string;
};

export default function ChatPage({ params }: { params: { bidId: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [bid, setBid] = useState<BidInfo | null>(null);
  const [job, setJob] = useState<JobInfo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    fetchUser();
    fetchBidAndJob();
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [params.bidId]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        // セッションAPIは { user: sessionData } を返す
        if (data.user && data.user.userId) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    // 初回ロード時または新しいメッセージが追加された時のみスクロール
    if (isInitialLoadRef.current && messages.length > 0) {
      scrollToBottom();
      isInitialLoadRef.current = false;
      prevMessageCountRef.current = messages.length;
    } else if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
      prevMessageCountRef.current = messages.length;
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const fetchBidAndJob = async () => {
    try {
      const bidsRes = await fetch(`/api/bids?bidId=${params.bidId}`);
      if (bidsRes.ok) {
        const bidsData = await bidsRes.json();
        if (bidsData.length > 0) {
          setBid(bidsData[0]);
          const jobRes = await fetch(`/api/jobs/${bidsData[0].jobId}`);
          if (jobRes.ok) {
            setJob(await jobRes.json());
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?bidId=${params.bidId}`);
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !bid || !user) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: bid.jobId,
          bidId: params.bidId,
          senderType: user.userType,
          content: newMessage.trim()
        })
      });

      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleOrder = async () => {
    if (!bid || !user) return;

    setOrdering(true);
    try {
      // TODO: Stripe決済を実装予定
      // 現時点では決済画面へのリダイレクトのプレースホルダー
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidId: bid._id,
          jobId: bid.jobId,
          amount: bid.quote
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          // Stripe決済画面へリダイレクト
          window.location.href = data.checkoutUrl;
        } else {
          alert("依頼が完了しました");
          setShowOrderModal(false);
        }
      } else {
        const error = await res.json();
        alert(error.error || "依頼に失敗しました");
      }
    } catch (error) {
      console.error(error);
      alert("依頼に失敗しました");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 sm:py-20">
        <div className="loading-spinner w-8 h-8 sm:w-10 sm:h-10 mx-auto border-4"></div>
        <p className="text-gray-500 mt-4 sm:mt-6 text-sm sm:text-base">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div className="card mb-3 sm:mb-4 shrink-0">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link href={job ? `/jobs/${job._id}` : "/jobs"} className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm mb-1 sm:mb-2 inline-flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              案件に戻る
            </Link>
            <h1 className="text-base sm:text-xl font-bold text-gray-800 truncate">
              {bid?.agencyName || "探偵事務所"} とのチャット
            </h1>
            {job && (
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">案件: {job.title}</p>
            )}
          </div>
          {bid && (
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-500">見積金額</div>
              <div className="text-lg sm:text-xl font-bold text-blue-600">¥{bid.quote.toLocaleString()}</div>
              <div className="text-xs text-gray-400">{bid.days}日間</div>
            </div>
          )}
        </div>
        {/* 依頼ボタン（依頼者のみ表示） */}
        {user?.userType === "client" && bid && (
          <div className="mt-3 pt-3 border-t">
            <button
              onClick={() => setShowOrderModal(true)}
              className="w-full btn bg-emerald-600 text-white hover:bg-emerald-700 py-3"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              この探偵に依頼する
            </button>
          </div>
        )}
      </div>

      {/* 依頼確認モーダル */}
      {showOrderModal && bid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">依頼の確認</h2>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">探偵事務所</span>
                <span className="font-semibold">{bid.agencyName}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">見積金額</span>
                <span className="font-bold text-xl text-blue-600">¥{bid.quote.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">想定期間</span>
                <span className="font-semibold">{bid.days}日間</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              上記の内容で依頼を確定します。決済画面に進みます。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={ordering}
              >
                キャンセル
              </button>
              <button
                onClick={handleOrder}
                className="flex-1 btn bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={ordering}
              >
                {ordering ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    決済に進む
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="card mb-3 sm:mb-4 flex-1 overflow-hidden flex flex-col min-h-0 p-0 relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto chat-scroll px-4 sm:px-6"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 py-12">
              <div className="text-center">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm sm:text-base">まだメッセージはありません</p>
                <p className="text-xs sm:text-sm mt-1">最初のメッセージを送信してください</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((msg, index) => {
                const isOwn = msg.senderType === user?.userType;
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showDateSeparator = index === 0 ||
                  (prevMessage && new Date(msg.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString());

                return (
                  <div key={msg._id}>
                    {showDateSeparator && (
                      <div className="flex justify-center my-4">
                        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                          {new Date(msg.createdAt).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-3 shadow-sm ${
                          isOwn
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        <div className={`text-xs mb-1 font-medium ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                          {msg.senderType === "client" ? "依頼者" : bid?.agencyName || "探偵"}
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                        <div className={`text-xs mt-2 text-right ${isOwn ? "text-blue-200" : "text-gray-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString("ja-JP", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
            aria-label="最新メッセージへ"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="card shrink-0">
        {userLoading ? (
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="読み込み中..."
              className="input flex-1 text-base"
              disabled
            />
            <button
              type="submit"
              disabled
              className="btn btn-primary px-4 sm:px-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        ) : !user ? (
          <div className="text-center text-gray-500 text-sm py-2">
            メッセージを送信するには<a href="/login" className="text-blue-600 hover:underline">ログイン</a>してください
          </div>
        ) : (
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="input flex-1 text-base"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="btn btn-primary px-4 sm:px-6"
            >
              {sending ? (
                <span className="loading-spinner"></span>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
