// app/api/gemini/route.ts

import { NextRequest, NextResponse } from "next/server";

// Define the type for the request body
interface GeminiRequestBody {
  prompt: string;
}

// Define the type for the Gemini API response
interface GeminiApiResponse {
  // Structure this based on the actual API response from Google's Gen AI
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  // ... other properties
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { prompt }: GeminiRequestBody = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiApiResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to get a response from Gemini." },
      { status: 500 }
    );
  }
}
