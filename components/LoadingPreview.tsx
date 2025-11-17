import React from 'react';
import { SparklesIcon } from './Icons';

export const LoadingPreview: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-stone-50 text-stone-600 p-8 text-center">
      <SparklesIcon className="w-16 h-16 text-indigo-500 animate-pulse mb-6" />
      <h2 className="text-3xl font-bold text-stone-700 mb-2">جاري توليد السحر...</h2>
      <p className="text-stone-500 max-w-md">يقوم الذكاء الاصطناعي لدينا بصياغة موقع الويب الجديد الخاص بك. قد يستغرق هذا بضع لحظات.</p>
    </div>
  );
};