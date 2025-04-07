import React, { useState, useMemo } from 'react';
import Editor from '@monaco-editor/react'; // Assuming @monaco-editor/react is installed
import { cn } from '@/lib/utils';

interface PreviewCodeProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

type SelectedFileType = 'html' | 'css' | 'js';

// Function to clean markdown code block delimiters
const cleanCodeBlockDelimiters = (code: string): string => {
  if (!code) return '';

  // Remove markdown code block delimiters
  return code
    .replace(/^```(html|css|javascript|js)$/gm, '') // Remove opening tags
    .replace(/^```$/gm, '') // Remove closing tags
    .trim(); // Remove excess whitespace
};

const fileMap: Record<SelectedFileType, {
  name: string;
  language: string;
  code: (props: PreviewCodeProps) => string
}> = {
  html: {
    name: 'index.html',
    language: 'html',
    code: (props) => cleanCodeBlockDelimiters(props.htmlCode)
  },
  css: {
    name: 'styles.css',
    language: 'css',
    code: (props) => cleanCodeBlockDelimiters(props.cssCode)
  },
  js: {
    name: 'script.js',
    language: 'javascript',
    code: (props) => cleanCodeBlockDelimiters(props.jsCode)
  }
};

export const PreviewCode: React.FC<PreviewCodeProps> = (props) => {
  const [selectedFile, setSelectedFile] = useState<SelectedFileType>('html');

  const handleFileSelect = (fileType: SelectedFileType): void => {
    setSelectedFile(fileType);
  };

  const currentFile = fileMap[selectedFile];
  const codeToShow = useMemo(() => currentFile.code(props), [currentFile, props]);

  return (
    <div className="preview-code">
      {/* Sidebar - More minimal */}
      <div className="preview-code__sidebar">
        <div className="">
          {(Object.keys(fileMap) as SelectedFileType[]).map((fileType) => (
            <div
              key={fileType}
              onClick={() => handleFileSelect(fileType)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFileSelect(fileType); }}
              tabIndex={0}
              role="button"
              aria-pressed={selectedFile === fileType}
              className={cn("preview-code__button-file", selectedFile === fileType && "preview-code__button-file--active")}
              // className={` ${selectedFile === fileType
              //   ? ''
              //   : ''
              //   }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {fileMap[fileType].name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monaco Editor - Clean styling */}
      <div className="preview-code__code">
        <Editor
          className="w-full h-full"
          language={currentFile.language}
          value={codeToShow}
          theme="vs"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 12 }
          }}
        />
      </div>
    </div>
  );
}; 