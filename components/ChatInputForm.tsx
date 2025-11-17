import React from 'react';
import type { UploadedFile } from '../types';
import { ImagePreview } from './ImagePreview';
import { PaperAirplaneIcon, PaperClipIcon } from './Icons';

interface ChatInputFormProps {
  userInput: string;
  setUserInput: (value: string) => void;
  uploadedFiles: UploadedFile[];
  removeFile: (fileName: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isRateLimited: boolean;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  userInput,
  setUserInput,
  uploadedFiles,
  removeFile,
  handleSubmit,
  handleFileChange,
  isLoading,
  fileInputRef,
  isRateLimited,
}) => {

  return (
    <div className="w-full">
      {uploadedFiles.length > 0 && (
        <div className="mb-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {uploadedFiles.map(file => (
            <ImagePreview key={file.name} file={file} onRemove={removeFile} />
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="مثال: معرض أعمال لمصور فوتوغرافي..."
          className="w-full bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none pl-4 pr-28 py-3 rounded-full border border-slate-700 focus:ring-2 focus:ring-violet-500 rtl:pl-28 rtl:pr-4 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading || isRateLimited}
        />
        <div className="absolute inset-y-0 right-2 rtl:left-2 rtl:right-auto flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isRateLimited}
            />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isRateLimited} className="p-2 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-violet-400 transition-colors rounded-full hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-60">
              <PaperClipIcon className="w-6 h-6" />
            </button>
            <button type="submit" disabled={isLoading || isRateLimited || (!userInput.trim() && uploadedFiles.length === 0)} className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 disabled:bg-slate-600 transition-colors shrink-0 disabled:cursor-not-allowed">
              {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
        </div>
      </form>
    </div>
  );
};