"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error("密碼不正確");
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗");
    } finally { setLoading(false); }
  }

  return (
    <main className="shell"><section className="hero"><div className="card">
      <p className="eyebrow">NOAH｜管理入口</p><h2>退休選擇權盤點</h2>
      <form onSubmit={login}>
        <label>管理密碼<input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={loading}>{loading ? "登入中…" : "登入"}</button>
      </form>
    </div></section></main>
  );
}
