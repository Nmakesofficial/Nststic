import React, { useState } from 'react';
import { SparklesIcon, XMarkIcon, CheckCircleIcon, XIcon } from './Icons';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    if (!name.trim() || !email.trim()) {
      setError('يرجى ملء اسمك وبريدك الإلكتروني.');
      return;
    }
    setError('');

    const recipient = 'nmakesofficial@gmail.com';
    const subject = encodeURIComponent('NStatic Pro Upgrade Request');
    const body = encodeURIComponent(
`Hello,

I would like to upgrade to NStatic Pro.

Here are my details:
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Message: ${message || 'Not provided'}

Thank you,
${name}`
    );

    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    handleClose();
  };
  
  const handleClose = () => {
    onClose();
    // Reset state after modal closes
    setTimeout(() => {
        setError('');
    }, 300);
  }

  const handleInputChange = () => {
    if (error) {
        setError('');
    }
  };

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
                <input type="text" id="name" name="name" required className="form-input" onChange={handleInputChange} />
                </div>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">البريد الإلكتروني</label>
                <input type="email" id="email" name="email" required className="form-input" onChange={handleInputChange} />
                </div>
                <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-400 mb-1">رقم الهاتف (اختياري)</label>
                <input type="tel" id="phone" name="phone" className="form-input" onChange={handleInputChange} />
                </div>
                <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1">رسالة (اختياري)</label>
                <textarea id="message" name="message" rows={2} className="form-input" onChange={handleInputChange}></textarea>
                </div>

                {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm p-3 rounded-lg">
                    <p>{error}</p>
                </div>
                )}

                <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    إرسال طلب الترقية
                </button>
            </form>
        </div>
        
         <style>{`
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
