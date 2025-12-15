# Detective Marketplace MVP
匿名投稿 → 探偵が応札 → 比較して1社と契約（MVP）

## 環境変数
- `.env.local` に `MONGODB_URI=` を設定

## ローカル起動
```bash
npm i
cp .env.local.example .env.local
# .env.local を編集して MongoDB 接続文字列を設定
npm run dev
```

## Vercel デプロイ
1. このリポジトリを GitHub にPush
2. Vercel で New Project → Import
3. Project Settings → Environment Variables に MONGODB_URI を追加
4. Deploy（Build & Run Command はデフォルトのまま）
5. 環境に応じて NEXT_PUBLIC_BASE_URL を（必要なら）設定