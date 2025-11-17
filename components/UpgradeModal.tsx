import React, { useState } from 'react';
import { SparklesIcon, XMarkIcon, CheckCircleIcon, XIcon } from './Icons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('يرجى ملء اسمك وبريدك الإلكتروني.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    }, 1500);
  };
  
  const handleClose = () => {
    onClose();
    // Reset state after modal closes
    setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setIsSuccess(false);
        setError('');
    }, 300);
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
      dir="rtl"
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-lg relative transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10 rtl:right-auto rtl:left-4">
          <XMarkIcon className="w-6 h-6" />
        </button>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[24rem]">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-100">تم استلام الطلب!</h2>
            <p className="text-slate-400 mt-2">شكرًا لك! سنتصل بك قريبًا لوضع اللمسات الأخيرة على ترقيتك.</p>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
              <SparklesIcon className="w-8 h-8 text-violet-400"/>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">الترقية إلى NStatic Pro</h2>
            </div>
            <p className="text-slate-400 mb-6">احصل على وصول غير محدود ودعم ذي أولوية عن طريق ترقية خطتك.</p>

            <div className="bg-slate-900/50 border border-slate-700/60 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 rtl:mr-0 rtl:ml-2 shrink-0"/> إنشاءات غير محدودة للمواقع</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 rtl:mr-0 rtl:ml-2 shrink-0"/> دعم ذو أولوية عبر البريد الإلكتروني</li>
                </ul>
                <div className="text-center mt-4 pt-4 border-t border-slate-700/60">
                    <p className="text-2xl font-extrabold text-white">5,000 جنيه سوداني</p>
                    <p className="text-sm text-slate-400">شهرياً</p>
                </div>
            </div>

            <div className="text-center my-6">
                <p className="text-sm text-slate-400 mb-3">أو تواصل معنا مباشرة:</p>
                <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse">
                    <a href="tel:+249113933838" className="font-medium text-slate-300 hover:text-violet-400 transition-colors">
                        +249 113933838
                    </a>
                    <span className="text-slate-600">|</span>
                    <a href="https://x.com/Nmakesofficial" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-violet-400 transition-colors">
                        <XIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-700/60 pt-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">الاسم الكامل</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">البريد الإلكتروني</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-400 mb-1">رقم الهاتف (اختياري)</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1">رسالة (اختياري)</label>
                <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="form-input"></textarea>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={isSubmitting} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:bg-slate-600 disabled:cursor-not-allowed">
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                        جار الإرسال...
                    </>
                ) : 'إرسال طلب الترقية'}
              </button>
            </form>
          </div>
        )}
         <style jsx>{`
            .form-input {
                width: 100%;
                background-color: #1e293b; /* bg-slate-800 */
                color: #cbd5e1; /* text-slate-300 */
                border-radius: 0.5rem;
                border: 1px solid #334155; /* border-slate-700 */
                padding: 0.75rem 1rem;
            }
            .form-input:focus {
                outline: none;
                box-shadow: 0 0 0 2px #8b5cf6; /* ring-violet-500 */
                border-color: #8b5cf6;
            }
            @keyframes fade-in-scale {
                0% {
                    opacity: 0;
                    transform: scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            .animate-fade-in-scale {
                animation: fade-in-scale 0.3s ease-out forwards;
            }
         `}</style>
      </div>
    </div>
  );
};
