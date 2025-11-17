import React from 'react';
import type { UploadedFile } from '../types';
import { XMarkIcon } from './Icons';

interface ImagePreviewProps {
  file: UploadedFile;
  onRemove: (name: string) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onRemove }) => {
  return (
    <div className="relative group aspect-square">
      <img
        src={file.dataUrl}
        alt={file.name}
        className="w-full h-full object-cover rounded-lg border-2 border-slate-700"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
        <button
          onClick={() => onRemove(file.name)}
          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          aria-label={`Remove ${file.name}`}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        <p className="text-white text-xs text-center p-1 break-all truncate">{file.name}</p>
      </div>
    </div>
  );
};