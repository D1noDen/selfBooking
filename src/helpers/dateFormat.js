import moment from "moment";

const DATE_ONLY_FORMATS = [
  "YYYY.MM.DD",
  "YYYY-MM-DD",
  "DD.MM.YYYY",
  "D.M.YYYY",
  "DD/MM/YYYY",
  "D/M/YYYY",
];

const DATE_TIME_FORMATS = [
  "DD.MM.YYYY HH:mm:ss",
  "DD.MM.YYYY HH:mm",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD HH:mm",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DDTHH:mm",
  moment.ISO_8601,
];

export const formatDateForDisplay = (value) => {
  if (!value) return "";
  const rawValue = typeof value === "string" ? value.trim() : value;
  const parsed = moment(rawValue, [...DATE_ONLY_FORMATS, ...DATE_TIME_FORMATS], true);
  if (!parsed.isValid()) return "";
  return parsed.format("YYYY.MM.DD");
};

export const formatDateTimeForDisplay = (value) => {
  if (!value) return "";
  const rawValue = typeof value === "string" ? value.trim() : value;
  const parsed = moment(rawValue, DATE_TIME_FORMATS, true);
  if (!parsed.isValid()) return "";
  return parsed.format("YYYY.MM.DD HH:mm");
};
