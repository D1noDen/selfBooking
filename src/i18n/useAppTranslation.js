import { useMemo } from "react";
import SelfBookingStore from "../store/SelfBookingStore";
import { translations } from "./translations";

export const useAppTranslation = () => {
  const language = SelfBookingStore((state) => state.language || "en");

  const t = useMemo(() => {
    return (key, fallback = "") => {
      const locale = translations[language] || translations.en;
      if (Object.prototype.hasOwnProperty.call(locale, key)) {
        return locale[key];
      }
      return fallback || translations.en[key] || key;
    };
  }, [language]);

  return { t, language };
};
