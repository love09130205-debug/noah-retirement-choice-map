import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase-server";
import AdminDashboard from "@/components/AdminDashboard";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName())?.value;
  if (!isValidAdminSession(token)) redirect("/admin/login");

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(300);
  if (error) throw new Error("無法讀取名單。");

  return <AdminDashboard initialLeads={(data || []) as Lead[]} />;
}
