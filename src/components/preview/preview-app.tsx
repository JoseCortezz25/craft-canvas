import React, { useMemo } from 'react';

interface PreviewAppProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

export const PreviewApp: React.FC<PreviewAppProps> = ({ htmlCode, cssCode, jsCode }) => {

  const srcDoc = useMemo(() => {
    if (!htmlCode && !cssCode && !jsCode) {
      return '<p>No code provided for preview.</p>';
    }

    return `
      ${htmlCode}
      <style>
        ${cssCode}
      </style>
      <script>
        ${jsCode}
      </script>
    `;
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div className="w-full h-full">
      <iframe
        srcDoc={srcDoc}
        title="Preview App"
        sandbox="allow-scripts allow-modals allow-forms"
        width="100%"
        height="100%"
        className="border border-gray-300 rounded "
      />
    </div>
  );
}; 