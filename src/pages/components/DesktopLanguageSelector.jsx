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
        className="rounded-[8px] bg-white px-[12px] py-[10px] text-[14px] text-[#333] font-sans outline-none flex items-center justify-between gap-2"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{boxShadow: "0px 2px 10px 0px #0000000F"}}
      >
        <span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_3016_356)">
          <path d="M7.99992 14.6663C11.6818 14.6663 14.6666 11.6816 14.6666 7.99967C14.6666 4.31778 11.6818 1.33301 7.99992 1.33301C4.31802 1.33301 1.33325 4.31778 1.33325 7.99967C1.33325 11.6816 4.31802 14.6663 7.99992 14.6663Z" stroke="#333333" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.99992 1.33301C6.28807 3.13044 5.33325 5.5175 5.33325 7.99967C5.33325 10.4818 6.28807 12.8689 7.99992 14.6663C9.71176 12.8689 10.6666 10.4818 10.6666 7.99967C10.6666 5.5175 9.71176 3.13044 7.99992 1.33301Z" stroke="#333333" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1.33325 8H14.6666" stroke="#333333" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
          <clipPath id="clip0_3016_356">
          <rect width="16" height="16" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        </span>
        <span className="text-[#0A0A0A]">{currentLanguage.label}</span>
        <span className={`${isOpen ? "rotate-180" : ""} duration-200`}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.666748 0.666992L4.66675 4.66699L8.66675 0.666992" stroke="#333333" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-[48px] right-0 z-40 w-full rounded-[4px] bg-white p-1 flex flex-col gap-1" style={{boxShadow: "0px 2px 10px 0px #0000000F"}}>
          {languageOptions.map((option) => (
            <button
              type="button"
              key={option.code}
              className={`w-full px-3 py-2 text-left text-[14px] rounded-[4px] text-[#0A0A0A] font-sans ${
                option.code === language
                  ? "bg-[#F5F3FF]"
                  : "hover:bg-[#F4F5FA]"
              }`}
              onClick={() => {
                setLanguage(option.code);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesktopLanguageSelector;
