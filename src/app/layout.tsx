import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { supabase } from "@/lib/supabase";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let seo: {
    frontendUrl: string;
    title: string;
    description: string;
    keywords: string;
    image: string;
  } | null = null;

  try {
    const { data: row } = await supabase.from("SEO").select("*").limit(1).single();
    if (row) {
      seo = {
        frontendUrl: row.frontendUrl || "",
        title: row.title || "PropertiHub - Temukan Hunian Impian Anda",
        description: row.description || "Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.",
        keywords: row.keywords || "properti, rumah, apartemen, jual rumah, beli rumah, propertihub",
        image: row.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      };
    }
  } catch {
    // fallback to defaults
  }

  const title = seo?.title || "PropertiHub - Temukan Hunian Impian Anda";
  const description = seo?.description || "Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.";
  const url = seo?.frontendUrl?.replace(/\/+$/, "") || "";
  const image = seo?.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
  const keywords = seo?.keywords || "properti, rumah, apartemen, jual rumah, beli rumah, propertihub";

  return {
    title,
    description,
    keywords: keywords.split(",").map((k) => k.trim()),
    icons: {
      icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: "PropertiHub",
      title,
      description,
      ...(url && { url }),
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(url && {
      alternates: {
        canonical: url,
      },
    }),
    other: {
      "fb:app_id": "",
      "og:site_name": "PropertiHub",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta property="fb:app_id" content="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
