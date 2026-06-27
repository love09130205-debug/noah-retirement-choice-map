import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase-server";

const schema = z.object({
  name: z.string().trim().min(1, "請填寫姓名").max(50),
  phone: z.string().trim().min(6, "請填寫有效手機").max(30),
  lineId: z.string().trim().max(80).optional().or(z.literal("")),
  contactTime: z.string().trim().max(60).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "請先同意個資告知" }) }),
  website: z.string().max(0).optional(),
  startedAt: z.number().finite(),
  answers: z.object({
    ageGroup: z.string().min(1),
    retirementAge: z.string().min(1),
    monthlyBudget: z.string().min(1),
    incomeSources: z.array(z.string()).min(1),
    concern: z.string().min(1),
  }),
  result: z.object({
    type: z.enum(["cashflow", "health", "overall"]),
    title: z.string().min(1),
    summary: z.string().min(1),
    nextStep: z.string().min(1),
  }),
  utm: z.object({
    source: z.string().max(120).optional(),
    medium: z.string().max(120).optional(),
    campaign: z.string().max(120).optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const data = schema.parse(raw);

    // Basic bot defence: hidden honeypot + minimum 2 seconds on form page.
    if (data.website || Date.now() - data.startedAt < 2000) {
      return NextResponse.json({ error: "無法送出，請稍後再試。" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      line_id: data.lineId || null,
      contact_time: data.contactTime || null,
      consent: data.consent,
      age_group: data.answers.ageGroup,
      retirement_age: data.answers.retirementAge,
      monthly_budget: data.answers.monthlyBudget,
      income_sources: data.answers.incomeSources,
      concern: data.answers.concern,
      result_type: data.result.type,
      result_title: data.result.title,
      result_summary: data.result.summary,
      utm_source: data.utm.source || null,
      utm_medium: data.utm.medium || null,
      utm_campaign: data.utm.campaign || null,
    });

    if (error) {
      console.error("Supabase insert failed", error);
      return NextResponse.json({ error: "資料暫時無法送出，請稍後再試。" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues[0]?.message : "資料格式有誤，請檢查後再試。";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
