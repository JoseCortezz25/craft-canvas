"use client";

import { useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "../ui/prompt-input";
import { Button } from "../ui/button";

export const ChatSidebar = () => {
  const [input] = useState();
  const [isLoading] = useState(false);

  return (
    <div className="chat-interface">
      <div className="chat-interface__header">
        <span className="size-[30px] rounded-lg bg-neutral-900"></span>
        <h2 className="chat-interface__title">Crafty</h2>
      </div>

      <div className="chat-interface__messages">
      </div>

      <PromptInput
        value={input}
        // onValueChange={handleValueChange}
        isLoading={isLoading}
        // onSubmit={handleSubmit}
        className="w-full transition-shadow flex items-start rounded-xl"
      >
        <PromptInputTextarea placeholder="Ask Crafty to build..." />
        <PromptInputActions className="justify-end">
          <PromptInputAction
            tooltip={isLoading ? "Stop generation" : "Send message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-lg mt-1.5"
            // onClick={handleSubmit}
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
  );
};
