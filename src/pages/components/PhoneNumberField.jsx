import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../helpers/helpers";
import {
  COUNTRY_PHONE_OPTIONS,
  sanitizePhoneLocal,
  validatePhoneByCountry,
} from "../helpers/phoneCountry";

const PhoneNumberField = ({
  label = "Phone Number *",
  widthClass = "w-[calc(50%-8px)]",
  phoneFieldName,
  countryFieldName,
  placeholder = "000000000",
  register,
  setValue,
  trigger,
  errors,
  selectedCountryCode,
  setSelectedCountryCode,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    setValue(countryFieldName, selectedCountryCode, { shouldValidate: true });
  }, [countryFieldName, selectedCountryCode, setValue]);

  const currentCountry =
    COUNTRY_PHONE_OPTIONS.find((item) => item.code === selectedCountryCode) ||
    COUNTRY_PHONE_OPTIONS[1];

  return (
    <div className={`flex flex-col ${widthClass} mb-[26px] relative ${className}`}>
      <label
        htmlFor={phoneFieldName}
        className="text-[15px]/[18px] text-[#333] font-sans font-[500] tracking-[0.675px] mb-[2px]"
      >
        {label}
      </label>

      <div className="border-[2px] border-[#E8E8E9] bg-white rounded-[10px] h-auto py-[7px] px-[8px] flex items-center gap-[10px]">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="h-[24px] min-w-[92px] px-[10px] bg-[#F2F3FA] rounded-[8px] flex items-center justify-between gap-[10px] text-[15px]/[20px] font-semibold text-[#333]"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={`Select country code, current ${currentCountry.label}`}
          >
            <span>{selectedCountryCode}</span>
            <span className={`${isOpen ? "rotate-180" : ""} duration-200`}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 6.90039L10 11.5004L15 6.90039"
                  stroke="#8B95A7"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {isOpen && (
            <div className="absolute scrollmainContent top-[40px] left-0 z-30 w-max max-h-[260px] overflow-y-auto rounded-[10px] border border-[#DDDEE2] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-2">
              {COUNTRY_PHONE_OPTIONS.map((country) => (
                <button
                  type="button"
                  key={country.key}
                  className={`w-full text-left px-3 py-2 text-[15px]/[20px] font-semibold flex items-center justify-between ${
                    country.code === selectedCountryCode
                      ? "bg-[#F1F2FF] text-[#333]"
                      : "text-[#333] hover:bg-[#F4F5FA]"
                  }`}
                  onClick={() => {
                    setSelectedCountryCode(country.code);
                    setIsOpen(false);
                    if (typeof trigger === "function") {
                      trigger(phoneFieldName);
                    }
                  }}
                >
                  <span>{country.code}</span>
                  {/* <span className="text-[14px] text-[#8A92A3]">v</span> */}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="tel"
          id={phoneFieldName}
          placeholder={placeholder}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={currentCountry.maxLength}
          className="flex-1 h-full outline-none text-[15px]/[20px] text-[#333] font-sans tracking-[0.2px] pr-2"
          onInput={(event) => {
            event.target.value = event.target.value
              .replace(/\D/g, "")
              .slice(0, currentCountry.maxLength);
          }}
          {...register(phoneFieldName, {
            required: "Field is required",
            setValueAs: (value) => sanitizePhoneLocal(value),
            validate: (value) => validatePhoneByCountry(value, selectedCountryCode),
          })}
        />
      </div>

      <input type="hidden" {...register(countryFieldName)} value={selectedCountryCode} />

      {errors?.[phoneFieldName] && (
        <p className="mt-1 text-red-500 text-[12px]/[14px]">
          {errors[phoneFieldName]?.message || "Field is required"}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberField;
