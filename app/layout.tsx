import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "退休選擇權盤點｜Noah 健康風險管理",
  description: "3 分鐘，先看清退休後的生活、收入與風險。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
