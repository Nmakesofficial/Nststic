import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, UploadedFile, GeneratedCode } from './types';
import { getAiChatResponse } from './services/geminiService';
import { useRateLimiter } from './hooks/useRateLimiter';
import { ChatBubble } from './components/ChatBubble';
import { ChatInputForm } from './components/ChatInputForm';
import { PreviewWindow } from './components/PreviewWindow';
import { LoadingPreview } from './components/LoadingPreview';
import { UpgradeModal } from './components/UpgradeModal';
import { DownloadIcon, CodeBracketIcon, EyeIcon, ChatBubbleLeftRightIcon, SparklesIcon, CheckCircleIcon, XIcon } from './components/Icons';

declare const JSZip: any;

const App: React.FC = () => {
  const { creationCount, limit, incrementCount } = useRateLimiter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [code, setCode] = useState<GeneratedCode>({
    html: `<div class="flex flex-col items-center justify-center h-full bg-slate-800 text-slate-400 font-sans" dir="rtl">
             <h1 class="text-4xl font-bold mb-4">أهلاً بك!</h1>
             <p>ستظهر معاينتك المباشرة هنا.</p>
           </div>`,
    css: 'body { margin: 0; font-family: sans-serif; }',
    js: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const [isInitial, setIsInitial] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const isRateLimited = creationCount >= limit;

  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newFiles: UploadedFile[] = [];
      let readCount = 0;
      
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newFiles.push({
              file: file,
              name: file.name,
              dataUrl: e.target.result as string
            });
          }
          readCount++;
          if (readCount === files.length) {
            setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 5));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!userInput.trim() && uploadedFiles.length === 0) || isRateLimited) return;

    setError(null);
    setIsLoading(true);
    if(isInitial) setIsInitial(false);

    const userMessage: ChatMessage = {
      role: 'user',
      text: userInput,
      images: uploadedFiles.map(f => ({ name: f.name }))
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    const currentInput = userInput;
    const currentFiles = uploadedFiles;

    setUserInput('');
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      const aiResponseText = await getAiChatResponse(messages, currentInput, currentFiles);
      
      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = aiResponseText.match(jsonRegex);

      if (match && match[1]) {
        try {
          const generatedCode = JSON.parse(match[1]);
           if (typeof generatedCode.html === 'string' && typeof generatedCode.css === 'string' && typeof generatedCode.js === 'string') {
            setCode(generatedCode);
            incrementCount();
            const successMessage = aiResponseText.replace(jsonRegex, '').trim();
            const warningMessage = "⚠️ **ملاحظة هامة:** تم إنشاء هذا الكود بواسطة الذكاء الاصطناعي وقد يحتوي على أخطاء. يرجى مراجعته بعناية.";
            const contactMessage = "إذا كنت بحاجة إلى مساعدة في استضافة هذا الموقع أو ترغب في تعديلات مخصصة، فتواصل مع مطوري NStatic على **contact@nstatic.dev**.";
            const finalMessage = `${successMessage || 'لقد أنشأت الموقع بناءً على محادثتنا. ألق نظرة على المعاينة!'}\n\n${warningMessage}\n\n${contactMessage}`;
            setMessages(prev => [...prev, { role: 'model', text: finalMessage }]);
            setMobileView('preview');
          } else {
             throw new Error("Invalid JSON structure received from API.");
          }
        } catch (parseError) {
          console.error("Failed to parse JSON from AI response:", parseError);
          const errorMessage = "قدم الذكاء الاصطناعي بنية كود غير صالحة. سأطلب منه المحاولة مرة أخرى.";
          setError(errorMessage);
          setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
      }
    } catch (err) {
      const unknownError = "حدث خطأ غير معروف.";
      const errorMessage = err instanceof Error ? err.message : unknownError;
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', text: `عذراً، حدث خطأ ما: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      
      const fullHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
${code.css}
    </style>
</head>
<body>
${code.html}
    <script>
${code.js}
    </script>
</body>
</html>`;

      zip.file("index.html", fullHtml);
      
      const content: Blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "website.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error creating zip file:", e);
      setError("فشل إنشاء ملف zip.");
    }
  };

  const remaining = limit - creationCount;
  const creationsRemainingText = remaining === 1
    ? `تبقى ${String(remaining)} محاولة إنشاء`
    : `تبقى ${String(remaining)} محاولات إنشاء`;

  const limitReachedText = limit === 1
    ? `لقد وصلت إلى حد الإنشاء اليومي وهو موقع واحد.`
    : `لقد وصلت إلى حد الإنشاء اليومي وهو ${String(limit)} مواقع.`;

  const chatInputProps = {
    userInput,
    setUserInput,
    uploadedFiles,
    removeFile,
    handleSubmit,
    handleFileChange,
    isLoading,
    fileInputRef,
    isRateLimited,
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-900 text-slate-300" dir="rtl">
      <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/60 p-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <CodeBracketIcon className="w-7 h-7 text-violet-500"/>
          <h1 className="text-lg font-bold text-slate-200 hidden sm:block">NStatic</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            {remaining > 0 && !isRateLimited && (
                <div className="text-sm text-slate-400 hidden sm:block bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/60">
                    {creationsRemainingText}
                </div>
            )}
            <div className="lg:hidden">
              <button onClick={() => setMobileView('chat')} className={`p-2 rounded-md ${mobileView === 'chat' ? 'bg-slate-700 text-violet-400' : 'text-slate-500 hover:bg-slate-800'}`}><ChatBubbleLeftRightIcon className="w-6 h-6"/></button>
              <button onClick={() => setMobileView('preview')} className={`p-2 rounded-md ${mobileView === 'preview' ? 'bg-slate-700 text-violet-400' : 'text-slate-500 hover:bg-slate-800'}`}><EyeIcon className="w-6 h-6" /></button>
            </div>
          <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
              <SparklesIcon className="w-5 h-5"/>
              <span className="hidden md:inline">ترقية</span>
          </button>
          <button
            onClick={handleDownloadZip}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={isLoading || isInitial}
          >
            <DownloadIcon className="w-5 h-5"/>
            <span className="hidden md:inline">تنزيل ملف .zip</span>
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Panel: Chat */}
        <div className={`flex flex-col bg-slate-900 overflow-y-auto ${mobileView === 'chat' ? 'flex' : 'hidden'} lg:flex`}>
          {isInitial ? (
             <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 max-w-2xl w-full">
                    <h1 className="text-4xl font-extrabold text-slate-100">NStatic</h1>
                    <p className="text-lg text-slate-400 mt-2 mb-8">NStatic يقدم لك موقع ويب ثابت وسريع الاستجابة بالكامل</p>
                    <ChatInputForm {...chatInputProps} />
                     <div className="mt-8 bg-slate-900/50 border border-violet-500/30 rounded-xl p-6 text-right">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-100">الترقية إلى NStatic Pro</h3>
                                <p className="text-slate-400 text-sm">أطلق العنان للإمكانيات الكاملة.</p>
                            </div>
                            <div className="text-left">
                                <p className="text-2xl font-extrabold text-white">5,000 جنيه سوداني</p>
                                <p className="text-xs text-slate-400">شهرياً</p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-slate-300">
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-400 ml-2 shrink-0"/>
                                <span>إنشاءات غير محدودة للمواقع</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-400 ml-2 shrink-0"/>
                                <span>دعم ذو أولوية عبر البريد الإلكتروني</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="mt-6 w-full flex items-center justify-center space-x-2 rtl:space-x-reverse bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            <SparklesIcon className="w-5 h-5"/>
                            <span>الترقية إلى Pro</span>
                        </button>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700/50 text-sm text-slate-400 space-y-4">
                        <p>
                            <span className="font-semibold text-amber-500">تحذير:</span> قد يرتكب الذكاء الاصطناعي أخطاء. يرجى دائمًا مراجعة الكود والمحتوى الذي تم إنشاؤه.
                        </p>
                        <p>
                            الخطة الحالية تسمح لك بإنشاء <span className="font-semibold text-slate-200">موقع واحد يوميًا</span>.
                        </p>
                        <div className="pt-2 text-slate-500 flex items-center justify-center space-x-4 rtl:space-x-reverse">
                           <span>
                                تم الإنشاء بواسطة <a href="https://nmakes.com" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-400 hover:text-slate-300 underline decoration-dotted transition-colors">Nmakes</a>.
                           </span>
                           <a href="https://x.com/Nmakesofficial" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-300">
                               <XIcon className="w-4 h-4" />
                           </a>
                        </div>
                    </div>
                </div>
             </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 p-4 pr-2 pb-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <ChatBubble key={index} message={msg} />
                ))}
                {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                    <ChatBubble message={{ role: 'model', text: "حسنًا، أنا أقوم ببناء موقعك الآن. قد يستغرق هذا بضع لحظات..." }} />
                )}
                 <div ref={chatEndRef} />
              </div>
              
              <div className="p-4 pt-0 border-t border-slate-800">
                {isRateLimited ? (
                  <div className="p-4 text-center text-amber-400 bg-amber-900/50 rounded-lg">
                    <p className="font-semibold">{limitReachedText}</p>
                    <p className="text-sm mt-2">هل أنت مستعد للمزيد؟ قم بالترقية إلى Pro لإنشاءات غير محدودة.</p>
                    <button 
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="mt-3 bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition-colors"
                    >
                      الترقية إلى Pro
                    </button>
                  </div>
                ) : (
                  <ChatInputForm {...chatInputProps} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Panel: Preview */}
        <div className={`bg-white ${mobileView === 'preview' ? 'flex' : 'hidden'} lg:flex`}>
          {isLoading && !isInitial ? <LoadingPreview /> : <PreviewWindow code={code} />}
        </div>
      </div>
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
};

export default App;
