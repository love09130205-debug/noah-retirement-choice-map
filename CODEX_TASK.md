# 給 Codex 的第一段任務指令

請先完整閱讀此專案與 README.md，不要從零重做，也不要換技術架構。

這是 Noah｜健康風險管理的「退休選擇權盤點」導流網站。目標是讓社群留言「退休」的人點入網站後，完成 5 題初步盤點、看到初步方向並留下聯絡方式；管理者可在 `/admin` 看名單與更新狀態。

請依以下順序工作：

1. 先執行 `npm install` 與 `npm run build`，修正所有編譯或型別錯誤。
2. 不要改視覺風格。保留黑底、高對比、白字＋金色重點字、手機優先版面。
3. 先檢查 `supabase/schema.sql` 是否能在全新 Supabase 專案成功執行。
4. 檢查安全性：
   - service role key 不可出現在任何 `NEXT_PUBLIC_` 變數或瀏覽器程式碼。
   - `leads` 不得有匿名 SELECT、UPDATE、DELETE 權限。
   - 前台只能透過 `/api/leads` 送資料。
   - `/admin` 必須透過 HttpOnly session cookie 驗證，不可把後台密碼寫入前端。
5. 檢查表單完整流程：首頁 → 5 題 → 結果 → 留資料 → 成功頁。
6. 確認 UTM 的 `utm_source`、`utm_medium`、`utm_campaign` 有寫入 leads。
7. 若 `NEXT_PUBLIC_QUICK_CHECK_PDF_URL` 是空的，PDF 入口必須完全不顯示。
8. 補上最少的測試或清楚的手動測試清單。
9. 完成後只回覆：
   - 已修正／確認的項目
   - 還需要我提供的環境變數
   - 部署到 Vercel 的最短步驟

重要限制：
- 不蒐集病歷、健檢、基因或其他敏感健康資料。
- 不做投資報酬、保證退休金或醫療效果宣稱。
- 不新增會員系統、LINE 串接、CRM、寄信或複雜功能；先完成可安全發布的 MVP。
