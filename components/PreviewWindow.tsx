
import React, { useMemo } from 'react';
import type { GeneratedCode } from '../types';

interface PreviewWindowProps {
  code: GeneratedCode;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ code }) => {
  const srcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${code.css}</style>
        </head>
        <body>
          ${code.html}
          <script>${code.js}</script>
        </body>
      </html>
    `;
  }, [code]);

  return (
    <iframe
      srcDoc={srcDoc}
      title="Website Preview"
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full border-0"
    />
  );
};
