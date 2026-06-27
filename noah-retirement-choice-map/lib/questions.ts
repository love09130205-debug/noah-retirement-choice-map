import type { QuizAnswers, QuizResult } from "@/lib/types";

export const questions = [
  {
    key: "ageGroup",
    title: "你目前的年齡區間？",
    type: "single" as const,
    options: ["30歲以下", "31–40歲", "41–50歲", "51歲以上"],
  },
  {
    key: "retirementAge",
    title: "你希望幾歲開始退休？",
    type: "single" as const,
    options: ["55歲", "60歲", "65歲", "70歲以上", "還沒想過"],
  },
  {
    key: "monthlyBudget",
    title: "退休後，你希望每月有多少生活費？",
    type: "single" as const,
    options: ["3萬以下", "3–5萬", "5–8萬", "8–10萬", "10萬以上"],
  },
  {
    key: "incomeSources",
    title: "你現在確定有的退休收入或準備？",
    helper: "可複選",
    type: "multi" as const,
    options: [
      "勞保或國民年金",
      "勞退專戶",
      "存款或投資資產",
      "租金或被動收入",
      "保險或其他安排",
      "目前還沒盤點",
    ],
  },
  {
    key: "concern",
    title: "你現在最沒把握的是哪一塊？",
    type: "single" as const,
    options: [
      "退休後生活費",
      "退休收入來源",
      "活得久錢不夠",
      "健康或照顧支出",
      "不想造成家人負擔",
    ],
  },
] as const;

export function computeResult(answers: QuizAnswers): QuizResult {
  const noPlan = answers.incomeSources.includes("目前還沒盤點");

  if (answers.concern === "健康或照顧支出" || answers.concern === "不想造成家人負擔") {
    return {
      type: "health",
      title: "健康與照顧預備，值得先放進退休設計",
      summary:
        "退休不只是在算一筆錢。健康、照顧安排與家庭責任，會直接影響未來生活是否還有選擇權。",
      nextStep: "先把可能的健康與照顧支出，放進退休生活的整體盤點。",
    };
  }

  if (
    noPlan ||
    answers.concern === "退休後生活費" ||
    answers.concern === "退休收入來源" ||
    answers.concern === "活得久錢不夠"
  ) {
    return {
      type: "cashflow",
      title: "先看每月生活費與已知收入的差距",
      summary:
        "你現在最值得先做的，不是急著決定工具，而是先把退休後想過的生活、確定收入與可能缺口拆開來看。",
      nextStep: "先整理每月生活費、已知收入來源與時間長度，找出最需要優先準備的一塊。",
    };
  }

  return {
    type: "overall",
    title: "先做一張完整的退休選擇權地圖",
    summary:
      "你已經有部分準備方向。下一步不是再塞更多選項，而是把退休年齡、收入來源、生活需求與家庭責任放在同一張圖。",
    nextStep: "先確認優先順序，避免每一塊都碰到，但真正重要的風險還沒有被看見。",
  };
}
