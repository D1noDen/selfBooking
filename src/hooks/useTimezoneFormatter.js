import { useCallback } from "react";

const DEFAULT_TIME_ZONE = "Europe/Warsaw";
const BACKEND_DATE_TIME_PATTERN =
  /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    const matched = trimmedValue.match(BACKEND_DATE_TIME_PATTERN);

    if (matched) {
      const [, day, month, year, hours = "00", minutes = "00", seconds = "00"] = matched;
      const parsed = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
        Number(seconds)
      );
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(trimmedValue);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

const useTimezoneFormatter = ({ locale = "en-US", timeZone = DEFAULT_TIME_ZONE } = {}) => {
  const formatInTimeZone = useCallback(
    (value, options, fallback = "") => {
      const parsedDate = toDate(value);
      if (!parsedDate) return fallback;
      return new Intl.DateTimeFormat(locale, { timeZone, ...options }).format(parsedDate);
    },
    [locale, timeZone]
  );

  const formatTimeInTimeZone = useCallback(
    (value, fallback = "--:--") =>
      formatInTimeZone(
        value,
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        fallback
      ),
    [formatInTimeZone]
  );

  return {
    timeZone,
    formatInTimeZone,
    formatTimeInTimeZone,
  };
};

export default useTimezoneFormatter;
