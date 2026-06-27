"use client";

import { useState } from "react";
import type { Lead } from "@/lib/types";

export default function AdminDashboard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: Lead["status"]) {
    setSavingId(id);
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead));
    } catch {
      alert("更新失敗，請重新整理再試。");
    } finally {
      setSavingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="shell" style={{ maxWidth: 1400 }}>
      <div className="admin-header">
        <div>
          <p className="brand">NOAH｜健康風險管理</p>
          <h2>退休選擇權盤點名單</h2>
          <p className="note">共 {leads.length} 筆</p>
        </div>
        <button className="btn secondary" style={{ width: "auto", padding: "0 18px" }} onClick={logout}>登出</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>建立時間</th><th>姓名／電話</th><th>盤點結果</th><th>最沒把握</th><th>收入準備</th><th>來源</th><th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{new Date(lead.created_at).toLocaleString("zh-TW")}</td>
                <td><strong>{lead.name}</strong><br />{lead.phone}<br />{lead.line_id || "—"}<br />{lead.contact_time || "—"}</td>
                <td><strong>{lead.result_title}</strong><br /><span className="note">{lead.monthly_budget}／{lead.retirement_age}</span></td>
                <td>{lead.concern}</td>
                <td>{Array.isArray(lead.income_sources) ? lead.income_sources.join("、") : "—"}</td>
                <td>{lead.utm_source || "direct"}<br /><span className="note">{lead.utm_medium || "—"} / {lead.utm_campaign || "—"}</span></td>
                <td>
                  <select className="status" disabled={savingId === lead.id} value={lead.status} onChange={(event) => updateStatus(lead.id, event.target.value as Lead["status"])}>
                    <option value="新進">新進</option><option value="已聯繫">已聯繫</option><option value="已完成">已完成</option>
                  </select>
                </td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td colSpan={7}>目前還沒有名單。</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
