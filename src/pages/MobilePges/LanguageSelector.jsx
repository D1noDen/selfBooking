import { useState } from 'react';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({
    code: 'en',
    name: 'English'
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polski' }
  ];

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    setIsOpen(false);
  };

  const FlagIcon = ({ code }) => {
    if (code === 'en') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 32 32">
          <rect width="32" height="32" fill="#012169"/>
          <path d="M0 0 L32 21.33 M32 0 L0 21.33 M0 32 L32 10.67 M32 32 L0 10.67" stroke="#fff" strokeWidth="3.5"/>
          <path d="M0 0 L32 21.33 M32 0 L0 21.33 M0 32 L32 10.67 M32 32 L0 10.67" stroke="#C8102E" strokeWidth="2"/>
          <path d="M16 0 V32 M0 16 H32" stroke="#fff" strokeWidth="5.5"/>
          <path d="M16 0 V32 M0 16 H32" stroke="#C8102E" strokeWidth="3.5"/>
        </svg>
      );
    } else if (code === 'pl') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 32 32">
          <rect width="32" height="16" fill="#fff"/>
          <rect y="16" width="32" height="16" fill="#DC143C"/>
        </svg>
      );
    }
  };

  return (
    <div>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 h-[35px] px-[12px] bg-[rgba(255,255,255,0.10)] text-white rounded-[10px] min-w-[88px]"
        >
          <FlagIcon code={selectedLang.code} />
          <span>{selectedLang.name}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ml-auto ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-20 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-white/30 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang)}
                className={`flex items-center gap-3 px-6 py-3 w-full text-left  hover:bg-white/20 transition-colors duration-150 ${
                  selectedLang.code === lang.code ? 'bg-white/10' : ''
                }`}
              >
                <FlagIcon code={lang.code} />
                <span className="font-medium font-hebrew text-[15px] text-gray-500">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}