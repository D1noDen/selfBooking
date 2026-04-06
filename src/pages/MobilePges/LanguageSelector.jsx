import { useRef, useState } from "react";
import SelfBookingStore from "../../store/SelfBookingStore";
import { languageOptions } from "../../i18n/translations";
import { useOnClickOutside } from "../helpers/helpers";

export default function LanguageSelector({ showFlags = true }) {
  const language = SelfBookingStore((state) => state.language || "en");
  const setLanguage = SelfBookingStore((state) => state.setLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const currentLanguage =
    languageOptions.find((option) => option.code === language) ||
    languageOptions[0];

  const FlagIcon = ({ code }) => {
    if (code === "en") {
      return (
        <svg className="w-6 h-6" viewBox="0 0 32 32">
          <rect width="32" height="32" fill="#012169"/>
          <path d="M0 0 L32 21.33 M32 0 L0 21.33 M0 32 L32 10.67 M32 32 L0 10.67" stroke="#fff" strokeWidth="3.5"/>
          <path d="M0 0 L32 21.33 M32 0 L0 21.33 M0 32 L32 10.67 M32 32 L0 10.67" stroke="#C8102E" strokeWidth="2"/>
          <path d="M16 0 V32 M0 16 H32" stroke="#fff" strokeWidth="5.5"/>
          <path d="M16 0 V32 M0 16 H32" stroke="#C8102E" strokeWidth="3.5"/>
        </svg>
      );
    } else if (code === "pl") {
      return (
        <svg className="w-6 h-6" viewBox="0 0 32 32">
          <rect width="32" height="16" fill="#fff"/>
          <rect y="16" width="32" height="16" fill="#DC143C"/>
        </svg>
      );
    } else if (code === "uk") {
      return (
        <svg className="w-6 h-6" viewBox="0 0 32 32">
          <rect width="32" height="16" fill="#0057B7"/>
          <rect y="16" width="32" height="16" fill="#FFD700"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center ${showFlags ? "gap-3" : "gap-2"} ${!showFlags ? 'text-[#333]' : 'px-[12px] text-white rounded-[10px] h-[35px] min-w-[88px] bg-[rgba(255,255,255,0.10)]'}`}
        >
          {showFlags && <FlagIcon code={currentLanguage.code} />}
          <span>{currentLanguage.label}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ml-auto ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className={`absolute z-20 ${!showFlags ? 'bottom-[30px]' : 'top-full mt-2'} w-max bg-white rounded-xl shadow-lg border border-white/30 overflow-hidden right-0`}>
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-6 py-3 w-full text-left hover:bg-white/20 transition-colors duration-150 ${
                  currentLanguage.code === lang.code ? "bg-white/10" : ""
                }`}
              >
                {showFlags && <FlagIcon code={lang.code} />}
                <span className="font-medium font-hebrew text-[15px] text-gray-500">
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
