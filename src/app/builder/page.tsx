import { ChatSidebar } from "@/components/layouts/chat-sidebar";
import { PreviewTabs } from '@/components/preview/preview-tabs';

const PageBuilder = () => {
  return (
    <div className="w-full flex h-screen bg-neutral-100">
      <section className="w-[400px] h-screen">
        <ChatSidebar />
      </section>

      <section className="w-full h-screen p-2">
        <PreviewTabs />
      </section>
    </div>
  );
};

export default PageBuilder;