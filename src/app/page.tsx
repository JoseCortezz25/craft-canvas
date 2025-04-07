"use client";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useCodeStore } from '@/store/codeStore';

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setHtmlCode, setCssCode, setJsCode } = useCodeStore();

  const handleSubmit = () => {
    setIsLoading(true);
    setError(null);

    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: input })
    })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;

          // Try to get error message from response if it's JSON
          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (parseError) {
              console.error("Failed to parse error response:", parseError);
            }
          } else {
            // Try to get text error message
            try {
              const errorText = await response.text();
              if (errorText) errorMessage = errorText;
            } catch (e) {
              console.error("Failed to get error text:", e);
            }
          }

          throw new Error(errorMessage);
        }

        // Handle response content
        if (contentType && contentType.includes("application/json")) {
          try {
            const result = await response.json();
            console.log("API Response:", result);

            if (result.html && result.css && result.js) {
              // Store the code in the store
              setHtmlCode(result.html);
              setCssCode(result.css);
              setJsCode(result.js);
              router.push('/builder');
            } else {
              throw new Error('Generated code is missing from the API response.');
            }
          } catch (error) {
            console.error("JSON parsing error:", error);
            throw new Error(`Failed to parse API response: ${error instanceof Error ? error.message : String(error)}`);
          }
        } else {
          throw new Error(`Unexpected response format: ${contentType}`);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message || "An unexpected error occurred.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleValueChange = (value: string) => {
    setInput(value);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <div className="w-full max-w-[750px] gap-4 flex flex-col items-center">
        <div className="space-y-2 mb-4">
          <div className="bg-neutral-900 rounded-xl size-[42px] mx-auto"></div>
          <h1 className="font-heading text-pretty text-center text-[29px] font-semibold tracking-tighter text-gray-900 sm:text-[32px] md:text-[46px]">
            What can I help you ship?
          </h1>
        </div>

        {error && (
          <div className="w-full p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            Error: {error}
          </div>
        )}

        <div className="w-full flex flex-col gap-3 items-start">
          <PromptInput
            value={input}
            onValueChange={handleValueChange}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            className="w-full transition-shadow"
          >
            <PromptInputTextarea placeholder="Ask Crafty to build..." />
            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction
                tooltip={isLoading ? "Stop generation" : "Send message"}
              >
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full cursor-pointer"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Square className="size-5 fill-current" />
                  ) : (
                    <ArrowUp className="size-5" />
                  )}
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>

          <div className="rounded-full bg-neutral-100 hover:bg-neutral-200 inline py-2 px-4 cursor-pointer" onClick={() => setInput("Create a landing page based in Amazon for to promotate my store")}>Landing Page with Amazon style</div>
          <div className="rounded-full bg-neutral-100 hover:bg-neutral-200 inline py-2 px-4 cursor-pointer" onClick={() => setInput("A minimalist personal website with about, projects, blog and contact sections. Include smooth page transitions and a dark/light theme toggle.")}>Minimalist portfolio</div>
        </div>
      </div>
    </div>
  );
}
