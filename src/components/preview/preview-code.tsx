import React, { useState } from 'react';
import Editor from '@monaco-editor/react'; // Assuming @monaco-editor/react is installed

interface PreviewCodeProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

type SelectedFileType = 'html' | 'css' | 'js';

const fileMap: Record<SelectedFileType, { name: string; language: string; code: (props: PreviewCodeProps) => string }> = {
  html: { name: 'index.html', language: 'html', code: (props) => props.htmlCode },
  css: { name: 'styles.css', language: 'css', code: (props) => props.cssCode },
  js: { name: 'script.js', language: 'javascript', code: (props) => props.jsCode }
};

export const PreviewCode: React.FC<PreviewCodeProps> = (props) => {
  const [selectedFile, setSelectedFile] = useState<SelectedFileType>('html');

  const handleFileSelect = (fileType: SelectedFileType): void => {
    setSelectedFile(fileType);
  };

  const currentFile = fileMap[selectedFile];
  const codeToShow = currentFile.code(props);

  return (
    <div className="flex h-full bg-neutral-100 text-white rounded-b-md overflow-hidden">
      {/* Sidebar */}
      <div className="w-40 border-r border-neutral-100 bg-neutral-100 p-2 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 px-1">Files</h3>
        <ul>
          {(Object.keys(fileMap) as SelectedFileType[]).map((fileType) => (
            <li key={fileType} className="mb-1">
              <button
                type="button"
                onClick={() => handleFileSelect(fileType)}
                aria-current={selectedFile === fileType ? 'page' : undefined}
                className={`text-gray-900 w-full text-left text-xs px-2 py-1 rounded hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-1 focus:ring-neutral-500 ${selectedFile === fileType ? 'bg-neutral-600 text-white' : 'text-gray-300'
                  }`}
              >
                {fileMap[fileType].name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Monaco Editor */}
      <div className="w-full h-full">
        <Editor
          className="w-full h-full"
          language={currentFile.language}
          value={codeToShow}
          theme="light" 
          options={{
            readOnly: true, 
            minimap: { enabled: false },
            fontSize: 12,
            scrollBeyondLastLine: false,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}; 