export type QuizAnswers = {
  ageGroup: string;
  retirementAge: string;
  monthlyBudget: string;
  incomeSources: string[];
  concern: string;
};

export type ResultType = "cashflow" | "health" | "overall";

export type QuizResult = {
  type: ResultType;
  title: string;
  summary: string;
  nextStep: string;
};

export type Lead = {
  id: string;
  created_at: string;
  status: "新進" | "已聯繫" | "已完成";
  name: string;
  phone: string;
  line_id: string | null;
  contact_time: string | null;
  consent: boolean;
  age_group: string;
  retirement_age: string;
  monthly_budget: string;
  income_sources: string[];
  concern: string;
  result_type: ResultType;
  result_title: string;
  result_summary: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};
