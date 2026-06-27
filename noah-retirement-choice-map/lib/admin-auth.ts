import crypto from "crypto";

const COOKIE_NAME = "noah_admin_session";

function sessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET.");
  return crypto.createHmac("sha256", secret).update("noah-retirement-admin").digest("hex");
}

export function adminCookieName() {
  return COOKIE_NAME;
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
  const expected = sessionToken();
  if (value.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function isValidAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Missing ADMIN_PASSWORD.");
  if (password.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expected));
}

export function getAdminSessionToken() {
  return sessionToken();
}
