'use client';

import React, { useState } from 'react';
import { PreviewCode } from './preview-code';
import { PreviewApp } from './preview-app';
import { Code, MonitorSmartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewTabsProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

type TabType = 'Code' | 'Preview';

export const PreviewTabs: React.FC<PreviewTabsProps> = ({ htmlCode, cssCode, jsCode }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Code');

  const handleTabClick = (tab: TabType): void => {
    setActiveTab(tab);
  };

  return (
    <div className="preview-tabs">
      {/* Tab Buttons - Minimal style */}
      <div className="preview-tabs__tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'Code'}
          aria-controls="code-panel"
          id="code-tab"
          onClick={() => handleTabClick('Code')}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTabClick('Code'); }}
          className={cn("preview-tabs__tab", activeTab === "Code" && "preview-tabs__tab--active")}
        >
          <Code size={14} />
          Code
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'Preview'}
          aria-controls="preview-panel"
          id="preview-tab"
          onClick={() => handleTabClick('Preview')}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTabClick('Preview'); }}
          className={cn("preview-tabs__tab", activeTab === "Preview" && "preview-tabs__tab--active")}
        >
          <MonitorSmartphone size={14} />
          Preview
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-grow">
        {activeTab === 'Code' && (
          <div id="code-panel" role="tabpanel" aria-labelledby="code-tab" className="w-full h-full">
            <PreviewCode htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
          </div>
        )}
        {activeTab === 'Preview' && (
          <div id="preview-panel" role="tabpanel" aria-labelledby="preview-tab" className="h-full">
            <PreviewApp htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} />
          </div>
        )}
      </div>
    </div>
  );
}; 