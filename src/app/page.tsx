
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

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleValueChange = (value: string) => {
    setInput(value);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <div className="w-full max-w-[750px] gap-4 flex flex-col">
        <h1 className="font-heading text-pretty text-center text-[29px] font-semibold tracking-tighter text-gray-900 sm:text-[32px] md:text-[46px]">
          What can I help you ship?
        </h1>

        <PromptInput
          value={input}
          onValueChange={handleValueChange}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className="w-full"
        >
          <PromptInputTextarea placeholder="Ask me anything..." />
          <PromptInputActions className="justify-end pt-2">
            <PromptInputAction
              tooltip={isLoading ? "Stop generation" : "Send message"}
            >
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleSubmit}
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

      </div>
    </div>
  );
}
