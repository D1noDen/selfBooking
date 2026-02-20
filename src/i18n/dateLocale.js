import { enUS, pl, uk } from "date-fns/locale";

export const getDateFnsLocale = (language = "en") => {
  if (language === "uk") return uk;
  if (language === "pl") return pl;
  return enUS;
};

export const getIntlLocale = (language = "en") => {
  if (language === "uk") return "uk-UA";
  if (language === "pl") return "pl-PL";
  return "en-US";
};
