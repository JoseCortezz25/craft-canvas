"use client";

import { ChatSidebar } from "@/components/layouts/chat-sidebar";
import { PreviewTabs } from '@/components/preview/preview-tabs';
import { useCodeStore } from '@/store/codeStore';

const PageBuilder = () => {
  const { htmlCode, cssCode, jsCode } = useCodeStore();

  return (
    <div className="w-full flex h-screen">
      <section className="w-[400px] h-screen">
        <ChatSidebar />
      </section>

      <section className="w-full h-screen">
        <PreviewTabs htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
      </section>
    </div>
  );
};

export default PageBuilder;