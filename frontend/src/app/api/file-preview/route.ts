import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";

/**
 * Proxies a file from Strapi and serves it with Content-Disposition: inline
 * so the browser opens it in a new tab (e.g. PDF viewer) instead of downloading.
 * Only allows paths under /uploads/ for security.
 */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path || !path.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  if (!STRAPI_URL) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const fileUrl = `${STRAPI_URL.replace(/\/$/, "")}${path}`;
  try {
    const res = await fetch(fileUrl, { headers: { Accept: "*/*" } });
    if (!res.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = "inline"; // open in browser instead of download

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (err) {
    console.error("File preview fetch error:", err);
    return NextResponse.json({ error: "Failed to load file" }, { status: 502 });
  }
}
