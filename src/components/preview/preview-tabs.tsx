'use client';

import React, { useState } from 'react';
import { PreviewCode } from './preview-code';
import { PreviewApp } from './preview-app';
import { mockHtml, mockCss, mockJs } from './mock-code';

type TabType = 'Code' | 'Preview';

export const PreviewTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Code');

  const handleTabClick = (tab: TabType): void => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col w-full h-full border border-gray-300 rounded-lg shadow-sm bg-gray-50">
      {/* Tab Buttons */}
      <div className="flex border-b border-gray-300 bg-gray-100 rounded-t-lg">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'Code'}
          aria-controls="code-panel"
          id="code-tab"
          onClick={() => handleTabClick('Code')}
          tabIndex={0} // Make it focusable
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTabClick('Code'); }}
          className={`px-4 py-2 text-sm font-medium rounded-tl-lg focus:outline-none focus:ring-offset-1
            ${activeTab === 'Code'
              ? 'border-b-2 border-blue-600 text-blue-700 bg-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
        >
          Code
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'Preview'}
          aria-controls="preview-panel"
          id="preview-tab"
          onClick={() => handleTabClick('Preview')}
          tabIndex={0} // Make it focusable
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTabClick('Preview'); }}
          className={`px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${activeTab === 'Preview'
              ? 'border-b-2 border-blue-600 text-blue-700 bg-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
        >
          Preview
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-grow overflow-hidden rounded-b-lg"> {/* Use flex-grow and overflow-hidden */}
        {activeTab === 'Code' && (
          <div id="code-panel" role="tabpanel" aria-labelledby="code-tab" className="w-full h-full">
            <PreviewCode htmlCode={mockHtml} cssCode={mockCss} jsCode={mockJs} />
          </div>
        )}
        {activeTab === 'Preview' && (
          <div id="preview-panel" role="tabpanel" aria-labelledby="preview-tab" className="h-full">
            <PreviewApp htmlCode={mockHtml} cssCode={mockCss} jsCode={mockJs} />
          </div>
        )}
      </div>
    </div>
  );
}; 