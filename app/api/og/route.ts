import { NextRequest, NextResponse } from "next/server";

type OgResult = {
  title: string;
  description: string;
  image: string;
  url: string;
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'");
}

function extractMetaTags(html: string): Record<string, string> {
  const metaTags: Record<string, string> = {};
  const metaRegex = /<meta\s+[^>]*>/gi;

  for (const tag of html.match(metaRegex) ?? []) {
    const propertyMatch = tag.match(/(?:property|name)=["']([^"']+)["']/i);
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    if (propertyMatch && contentMatch) {
      metaTags[propertyMatch[1].toLowerCase()] = contentMatch[1];
    }
  }

  return metaTags;
}

function extractOpenGraph(html: string, pageUrl: URL): OgResult {
  const meta = extractMetaTags(html);
  const titleTagMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

  const rawTitle =
    meta["og:title"] || titleTagMatch?.[1] || pageUrl.hostname.replace(/^www\./, "");
  const rawDescription = meta["og:description"] || meta["description"] || "";
  const rawImage = meta["og:image"] || "";

  let image = "";
  if (rawImage) {
    try {
      image = new URL(rawImage, pageUrl).toString();
    } catch {
      image = "";
    }
  }

  return {
    title: decodeHtmlEntities(rawTitle).trim(),
    description: decodeHtmlEntities(rawDescription).trim(),
    image,
    url: pageUrl.toString(),
  };
}

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let pageUrl: URL;
  try {
    pageUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (pageUrl.protocol !== "http:" && pageUrl.protocol !== "https:") {
    return NextResponse.json({ error: "unsupported protocol" }, { status: 400 });
  }

  try {
    const response = await fetch(pageUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BookmarkLinkBot/1.0)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const html = await response.text();
    return NextResponse.json(extractOpenGraph(html, pageUrl));
  } catch {
    return NextResponse.json({
      title: pageUrl.hostname.replace(/^www\./, ""),
      description: "",
      image: "",
      url: pageUrl.toString(),
    });
  }
}
