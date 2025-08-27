// For example, in a client component `app/page.tsx`
"use client";

import { useState } from "react";

// Define the type for the data you expect back from your API route
interface ProxyResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export default function HomePage() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");

  const generateContent = async () => {
    setLoading(true);
    const prompt = currentPrompt;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data: ProxyResponse = await res.json();
      if (data.candidates && data.candidates.length > 0) {
        const geminiText = data.candidates[0].content.parts[0].text;
        setResponse(geminiText);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setResponse("Failed to get a response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 text-gray-800">
      <div className="w-full max-w-2xl mx-auto space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
          Gemini API with Next.js & TypeScript
        </h1>
        <textarea
          className="w-full h-40 p-4 text-base border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
          placeholder="Type your prompt here..."
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
        />
        <button
          className="cursor-pointer w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={generateContent}
          disabled={loading || currentPrompt.trim() === ""}
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>
        {response && (
          <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-inner border border-gray-200 max-h-80 overflow-auto">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Gemini's Response
            </h2>
            <p className="text-gray-600 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
