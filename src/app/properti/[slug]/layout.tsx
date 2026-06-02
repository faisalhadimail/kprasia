import type { Metadata } from "next";
import { getDocument, getCollection } from '@/lib/firestore'
import { COLLECTIONS } from '@/lib/firebase'

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { slug } = await params;

  let seo: {
    frontendUrl: string;
    image: string;
  } | null = null;

  try {
    const seoData = await getDocument(COLLECTIONS.SEO, 'seo-1')
    if (seoData) {
      seo = {
        frontendUrl: seoData.frontendUrl || "",
        image: seoData.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      };
    }
  } catch {
    // fallback
  }

  const baseUrl = seo?.frontendUrl?.replace(/\/+$/, "") || "https://propertihub.com";
  const defaultImage = seo?.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

  let prop: {
    title: string;
    seoTitle: string;
    seoDesc: string;
    seoKeywords: string;
    images: unknown;
    price: number;
    kabupaten: string;
    kecamatan: string;
    type: string;
  } | null = null;

  try {
    // Query property by permalink
    const properties = await getCollection(COLLECTIONS.PROPERTIES)
    const property = properties.find(p => p.permalink === slug)

    if (property) {
      prop = {
        title: property.title || '',
        seoTitle: property.seoTitle || '',
        seoDesc: property.seoDesc || '',
        seoKeywords: property.seoKeywords || '',
        images: property.images || [],
        price: property.price || 0,
        kabupaten: property.kabupaten || '',
        kecamatan: property.kecamatan || '',
        type: property.type || '',
      }
    }
  } catch {
    // not found
  }

  if (!prop) {
    return {
      title: "Properti Tidak Ditemukan - PropertiHub",
      description: "Properti yang Anda cari tidak ditemukan.",
    };
  }

  const ogTitle = prop.seoTitle || `${prop.title} - PropertiHub`;
  const ogDesc = prop.seoDesc || `Dijual ${prop.type.toLowerCase()} ${prop.title} di ${prop.kecamatan ? `${prop.kecamatan}, ` : ""}${prop.kabupaten}. Temukan penawaran terbaik hanya di PropertiHub.`;

  // Use first image from property, fallback to global OG image
  let ogImage = defaultImage;
  try {
    const imgs = Array.isArray(prop.images) ? prop.images : (typeof prop.images === "string" ? JSON.parse(prop.images) : []);
    if (imgs.length > 0) {
      ogImage = imgs[0];
    }
  } catch {
    // use default
  }

  const url = `${baseUrl}/properti/${slug}`;

  return {
    title: ogTitle,
    description: ogDesc,
    keywords: prop.seoKeywords
      ? prop.seoKeywords.split(",").map((k) => k.trim())
      : [prop.title.toLowerCase(), prop.type.toLowerCase(), prop.kabupaten.toLowerCase(), "propertihub"],
    openGraph: {
      type: "article",
      locale: "id_ID",
      siteName: "PropertiHub",
      title: ogTitle,
      description: ogDesc,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: prop.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    other: {
      "og:site_name": "PropertiHub",
    },
  };
}

export default function PropertiSlugLayout({ children }: Props) {
  return children;
}