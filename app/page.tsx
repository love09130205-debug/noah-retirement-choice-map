"use client";

import { useMemo, useState } from "react";
import { computeResult, questions } from "@/lib/questions";
import type { QuizAnswers, QuizResult } from "@/lib/types";

const emptyAnswers: QuizAnswers = {
  ageGroup: "",
  retirementAge: "",
  monthlyBudget: "",
  incomeSources: [],
  concern: "",
};

type Step = "home" | "quiz" | "result" | "booking" | "done";

export default function HomePage() {
  const [step, setStep] = useState<Step>("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(emptyAnswers);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [formError, setFormError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const pdfUrl = process.env.NEXT_PUBLIC_QUICK_CHECK_PDF_URL || "";
  const current = questions[questionIndex];
  const progress = ((questionIndex + 1) / questions.length) * 100;
  const answerReady = current.type === "multi"
    ? answers.incomeSources.length > 0
    : Boolean(answers[current.key as keyof QuizAnswers]);

  const summaryText = useMemo(() => {
    if (!result) return "";
    return [
      "我的退休選擇權初步盤點",
      `年齡區間：${answers.ageGroup}`,
      `預計退休：${answers.retirementAge}`,
      `每月生活費期待：${answers.monthlyBudget}`,
      `已有收入／準備：${answers.incomeSources.join("、")}`,
      `最沒把握：${answers.concern}`,
      "",
      `初步方向：${result.title}`,
      result.summary,
    ].join("\n");
  }, [answers, result]);

  function startQuiz() {
    setStep("quiz");
    setQuestionIndex(0);
  }

  function selectSingle(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  }

  function toggleMulti(value: string) {
    setAnswers((prev) => {
      const active = prev.incomeSources.includes(value);
      return {
        ...prev,
        incomeSources: active
          ? prev.incomeSources.filter((item) => item !== value)
          : [...prev.incomeSources, value],
      };
    });
  }

  function nextQuestion() {
    if (!answerReady) return;
    if (questionIndex === questions.length - 1) {
      setResult(computeResult(answers));
      setStep("result");
      return;
    }
    setQuestionIndex((value) => value + 1);
  }

  function copySummary() {
    navigator.clipboard?.writeText(summaryText);
    alert("已複製你的盤點摘要");
  }

  async function submitBooking(formData: FormData) {
    setFormError("");
    setIsSending(true);
    try {
      const payload = {
        name: String(formData.get("name") || ""),
        phone: String(formData.get("phone") || ""),
        lineId: String(formData.get("lineId") || ""),
        contactTime: String(formData.get("contactTime") || ""),
        consent: formData.get("consent") === "on",
        website: String(formData.get("website") || ""),
        startedAt: Number(formData.get("startedAt") || Date.now()),
        answers,
        result,
        utm: {
          source: new URLSearchParams(window.location.search).get("utm_source") || "",
          medium: new URLSearchParams(window.location.search).get("utm_medium") || "",
          campaign: new URLSearchParams(window.location.search).get("utm_campaign") || "",
        },
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "送出失敗，請稍後再試。");
      setStep("done");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "送出失敗，請稍後再試。");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="shell">
      <p className="brand">NOAH｜健康風險管理</p>

      {step === "home" && (
        <section className="hero">
          <p className="eyebrow">退休選擇權盤點</p>
          <h1>
            退休不是一個數字<br />
            是未來還有沒有<span className="gold">選擇權</span>
          </h1>
          <p className="lead">3 分鐘，先看清退休後的生活、收入與可能打亂計畫的風險。</p>
          <button className="btn" onClick={startQuiz}>開始我的退休選擇權盤點</button>
          {pdfUrl && (
            <a className="btn secondary" href={pdfUrl} target="_blank" rel="noreferrer">
              先看 3 分鐘快速盤點 PDF
            </a>
          )}
          <p className="note">這是初步盤點，不代表投資、保險、醫療或個人財務建議。</p>
        </section>
      )}

      {step === "quiz" && (
        <section>
          <div className="progress-wrap">
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>
            <span className="note">{questionIndex + 1} / {questions.length}</span>
          </div>
          <div className="card">
            <p className="eyebrow">退休選擇權盤點</p>
            <h2>{current.title}</h2>
            {"helper" in current && <p className="note">{current.helper}</p>}
            <div>
              {current.options.map((option) => {
                const active = current.type === "multi"
                  ? answers.incomeSources.includes(option)
                  : answers[current.key as keyof QuizAnswers] === option;
                return (
                  <button
                    type="button"
                    key={option}
                    className={`option ${current.type === "multi" ? "multi" : ""} ${active ? "active" : ""}`}
                    onClick={() => current.type === "multi" ? toggleMulti(option) : selectSingle(option)}
                  >
                    <span className="mark" />
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
            <div className="actions">
              <button className="btn secondary" disabled={questionIndex === 0} onClick={() => setQuestionIndex((value) => Math.max(0, value - 1))}>上一步</button>
              <button className="btn" disabled={!answerReady} onClick={nextQuestion}>{questionIndex === questions.length - 1 ? "看我的初步方向" : "下一題"}</button>
            </div>
          </div>
        </section>
      )}

      {step === "result" && result && (
        <section>
          <div className="card">
            <span className="result-pill">你的初步盤點結果</span>
            <h2 style={{ marginTop: 16 }}>{result.title}</h2>
            <p>{result.summary}</p>
            <div className="card">
              <h3>下一步可以先做什麼？</h3>
              <p>{result.nextStep}</p>
            </div>
            <button className="btn" onClick={() => setStep("booking")}>預約 15 分鐘退休選擇權地圖</button>
            <button className="btn secondary" onClick={copySummary}>複製我的盤點摘要</button>
            {pdfUrl && <a className="btn secondary" href={pdfUrl} target="_blank" rel="noreferrer">查看快速盤點 PDF</a>}
            <p className="note">本結果僅供初步了解；完整評估需依個人資料與專業意見進行。</p>
          </div>
        </section>
      )}

      {step === "booking" && result && (
        <section>
          <div className="card">
            <p className="eyebrow">下一步</p>
            <h2>讓我幫你整理成<br /><span className="gold">退休選擇權地圖</span></h2>
            <p>不是先談商品，而是先把生活需求、已知收入、健康與照顧風險放在同一張圖。</p>
            <form action={submitBooking}>
              <input type="hidden" name="startedAt" value={Date.now()} />
              <input className="hidden-field" name="website" tabIndex={-1} autoComplete="off" />
              <label>姓名<input className="input" name="name" required maxLength={50} /></label>
              <label>手機<input className="input" name="phone" required inputMode="tel" maxLength={30} /></label>
              <label>LINE ID（選填）<input className="input" name="lineId" maxLength={80} /></label>
              <label>方便聯繫時段
                <select name="contactTime" defaultValue="">
                  <option value="">請選擇</option>
                  <option value="平日上午">平日上午</option>
                  <option value="平日下午">平日下午</option>
                  <option value="平日晚上">平日晚上</option>
                  <option value="週末">週末</option>
                  <option value="其他，請先以LINE聯絡">其他，請先以LINE聯絡</option>
                </select>
              </label>
              <label className="check">
                <input type="checkbox" name="consent" required />
                <span>我同意優夠好有限公司為聯繫與安排「退休選擇權初步盤點」之目的，蒐集、處理及利用本表資料。</span>
              </label>
              {formError && <p className="error">{formError}</p>}
              <button className="btn" disabled={isSending}>{isSending ? "送出中…" : "送出我的初步盤點"}</button>
              <p className="note">請勿填寫病歷、健檢、基因或其他敏感健康資料。</p>
            </form>
          </div>
        </section>
      )}

      {step === "done" && (
        <section className="hero">
          <p className="eyebrow">已收到</p>
          <h1>你的盤點<br />已經送出</h1>
          <p className="lead">Noah 會依你選擇的時段聯繫，先陪你把退休後真正需要準備的方向看清楚。</p>
          <button className="btn secondary" onClick={() => setStep("result")}>回到我的初步結果</button>
        </section>
      )}
    </main>
  );
}
