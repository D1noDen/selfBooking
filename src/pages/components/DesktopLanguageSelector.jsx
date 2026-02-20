import { useRef, useState } from "react";
import SelfBookingStore from "../../store/SelfBookingStore";
import { languageOptions } from "../../i18n/translations";
import { useAppTranslation } from "../../i18n/useAppTranslation";
import { useOnClickOutside } from "../helpers/helpers";

const DesktopLanguageSelector = () => {
  const { t } = useAppTranslation();
  const language = SelfBookingStore((state) => state.language || "en");
  const setLanguage = SelfBookingStore((state) => state.setLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const currentLanguage =
    languageOptions.find((option) => option.code === language) ||
    languageOptions[0];

  return (
    <div className="flex items-center gap-2 relative ml-2" ref={dropdownRef}>
      <button
        type="button"
        className="h-[34px] min-w-[130px] rounded-[8px] border border-[#D8DBE2] bg-white px-3 text-[14px] text-[#333] font-sans outline-none flex items-center justify-between gap-3"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{currentLanguage.labelShort}</span>
        <span className={`${isOpen ? "rotate-180" : ""} duration-200`}>
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 1L6 6L1 1" stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-[40px] right-0 z-40 w-full rounded-[8px] border border-[#D8DBE2] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1">
          {languageOptions.map((option) => (
            <button
              type="button"
              key={option.code}
              className={`w-full px-3 py-2 text-left text-[14px] font-sans ${
                option.code === language
                  ? "bg-[#F1F2FF] text-[#333]"
                  : "text-[#333] hover:bg-[#F4F5FA]"
              }`}
              onClick={() => {
                setLanguage(option.code);
                setIsOpen(false);
              }}
            >
              {option.labelShort}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesktopLanguageSelector;
