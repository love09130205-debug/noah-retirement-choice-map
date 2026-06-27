# Noah｜退休選擇權盤點

手機優先的退休盤點導流頁：

> 社群留言「退休」 → 點連結 → 5 題盤點 → 看到初步方向 → 留資料預約 → Noah 後台查看名單

## 技術組合
- Next.js
- Supabase（名單資料庫）
- Vercel 或其他支援 Next.js 的平台部署

## 功能
- 首頁 CTA
- 五題單題式退休盤點＋進度條
- 結果頁：現金流／健康照顧／整體盤點三種初步方向
- 留資料表單：姓名、手機、LINE（選填）、聯絡時段、個資同意
- UTM 來源記錄：utm_source、utm_medium、utm_campaign
- 後台：`/admin`（以環境變數的密碼登入）
- PDF 按鈕僅在 `NEXT_PUBLIC_QUICK_CHECK_PDF_URL` 有值時出現

## 1. 建立 Supabase 專案與資料表
1. 到 Supabase 建立新 project。
2. 在 SQL Editor 執行 `supabase/schema.sql`。
3. 到 Project Settings → API，複製 URL 與 `service_role` key。
4. 請把 key 放在部署平台的環境變數；不要放在前端或 GitHub。

## 2. 本機啟動
```bash
cp .env.example .env.local
npm install
npm run dev
```

## 3. 部署到 Vercel
1. 推到 GitHub。
2. 到 Vercel 匯入 GitHub repository。
3. 在 Vercel 的 Environment Variables 加入 `.env.example` 裡的四個變數。
4. Deploy。

## 4. 發布前測試
1. 無痕開首頁。
2. 走完五題。
3. 填測試資料、送出。
4. 到 `/admin` 用 `ADMIN_PASSWORD` 登入，確認名單、問卷摘要、UTM 是否寫入。
5. 用這種 URL 測來源紀錄：
   `https://your-domain.com/?utm_source=instagram&utm_medium=dm&utm_campaign=retirement`

## 隱私與安全
- 本專案不蒐集病歷、健檢、基因資料或其他敏感健康資料。
- `leads` 資料表已啟用 RLS，沒有公開 SELECT／UPDATE／DELETE policy。
- 前台不直接接觸 Supabase service role key；表單走 Next.js server route。
- `ADMIN_PASSWORD` 與 `ADMIN_SESSION_SECRET` 必須設為強密碼／亂數，且只放在部署平台環境變數。

## ManyChat 按鈕文字
`開始我的退休選擇權盤點`

## 建議連結格式
`https://your-domain.com/?utm_source=instagram&utm_medium=dm&utm_campaign=retirement`
