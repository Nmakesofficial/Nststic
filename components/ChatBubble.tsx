import React from 'react';
import type { ChatMessage } from '../types';
import { PaperClipIcon } from './Icons';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Simple, safe markdown-to-HTML renderer for AI responses
  const renderMarkdown = (text: string) => {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    
    // Italic (*text* or _text_) - using negative lookarounds to avoid matching **
    html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');

    // Autolink emails
    html = html.replace(/(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g, '<a href="mailto:$1" class="text-violet-300 hover:underline">$1</a>');
      
    // Links ([text](url))
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-violet-300 hover:underline">$1</a>');

    return { __html: html };
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl shadow-md break-words ${
          isUser
            ? 'bg-violet-600 text-white rounded-br-lg'
            : 'bg-slate-700 text-slate-200 rounded-bl-lg border border-slate-600/50'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={renderMarkdown(message.text)}
          />
        )}
        {message.images && message.images.length > 0 && (
          <div className="mt-2 text-xs text-violet-200 flex items-center gap-1.5 pt-2 border-t border-violet-500/50">
            <PaperClipIcon className="w-3 h-3"/>
            <span className="italic">
              {message.images.map(img => img.name).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};