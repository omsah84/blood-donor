import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  // Using free MyMemory API for simplicity
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`
  );
  const data = await response.json();

  return NextResponse.json({ translated: data.responseData.translatedText });
}