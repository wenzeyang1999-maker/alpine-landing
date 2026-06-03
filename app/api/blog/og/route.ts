import { NextRequest, NextResponse } from "next/server";

// Attempts to extract OpenGraph metadata from a URL.
// LinkedIn often blocks scrapers; we return partial data gracefully.
export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ title: "", description: "", image: "" });
    }

    const html = await res.text();

    const get = (prop: string) => {
      const m = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i"))
        ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, "i"));
      return m?.[1] ?? "";
    };

    return NextResponse.json({
      title: get("title"),
      description: get("description"),
      image: get("image"),
    });
  } catch {
    return NextResponse.json({ title: "", description: "", image: "" });
  }
}
