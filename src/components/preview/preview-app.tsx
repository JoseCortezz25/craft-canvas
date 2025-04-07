import React, { useMemo } from 'react';

interface PreviewAppProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

// Function to clean markdown code block delimiters
const cleanCodeBlockDelimiters = (code: string): string => {
  if (!code) return '';

  // Remove markdown code block delimiters
  return code
    .replace(/^```(html|css|javascript|js)$/gm, '') // Remove opening tags
    .replace(/^```$/gm, '') // Remove closing tags
    .trim(); // Remove excess whitespace
};

export const PreviewApp: React.FC<PreviewAppProps> = ({ htmlCode, cssCode, jsCode }) => {
  // Clean the code inputs
  const cleanHtml = useMemo(() => cleanCodeBlockDelimiters(htmlCode), [htmlCode]);
  const cleanCss = useMemo(() => cleanCodeBlockDelimiters(cssCode), [cssCode]);
  const cleanJs = useMemo(() => cleanCodeBlockDelimiters(jsCode), [jsCode]);

  const srcDoc = useMemo(() => {
    if (!cleanHtml && !cleanCss && !cleanJs) {
      return `
        <div style="display: flex; height: 100%; align-items: center; justify-content: center; font-family: sans-serif; color: #666;">
          <div style="text-align: center;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <p style="margin-top: 8px; font-weight: 700;">No code generated yet</p>
          </div>
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            ${cleanCss}
          </style>
        </head>
        <body>
          ${cleanHtml}
          <script>
            ${cleanJs}
          </script>
        </body>
      </html>
    `;
  }, [cleanHtml, cleanCss, cleanJs]);

  return (
    <div className="w-full h-full bg-white p-0 overflow-hidden">
      <iframe
        srcDoc={srcDoc}
        title="Preview"
        sandbox="allow-scripts allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin"
        width="100%"
        height="100%"
        className="border-0"
      />
    </div>
  );
}; 