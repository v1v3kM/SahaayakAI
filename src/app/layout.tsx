import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sahaayak AI - India's AI-Powered Citizen Safety Platform",
  description: "Multi-Agent Agentic AI System for Disaster Response, Fake News Detection & Citizen Safety across India. सहायक AI deploys 6 autonomous AI agents for real-time disaster management covering 28 states & 8 UTs.",
  keywords: ["Sahaayak", "AI", "Disaster Response", "India", "Fake News Detection", "Multi-Agent", "Agentic AI", "Citizen Safety", "NDRF", "Credibility Scoring"],
  authors: [{ name: "Sahaayak AI Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
