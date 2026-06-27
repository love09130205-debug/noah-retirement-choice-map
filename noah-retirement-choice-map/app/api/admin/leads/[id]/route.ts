import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { adminCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase-server";

const bodySchema = z.object({ status: z.enum(["新進", "已聯繫", "已完成"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName())?.value;
  if (!isValidAdminSession(token)) return NextResponse.json({ error: "未授權" }, { status: 401 });

  try {
    const { id } = await params;
    const { status } = bodySchema.parse(await request.json());
    const supabase = createServiceClient();
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "更新失敗" }, { status: 400 });
  }
}
