import { NextResponse } from "next/server";
import { adminCookieName, getAdminSessionToken, isValidAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (typeof password !== "string" || !isValidAdminPassword(password)) {
      return NextResponse.json({ error: "密碼不正確" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: adminCookieName(),
      value: getAdminSessionToken(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "無法登入" }, { status: 400 });
  }
}
