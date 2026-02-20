export const getLocalizedVisitTypeLabel = (item, language = "en") => {
  if (!item || typeof item !== "object") return "";

  const base = typeof item.label === "string" ? item.label.trim() : "";
  const uk = typeof item.ukrLabel === "string" ? item.ukrLabel.trim() : "";
  const pl = typeof item.polLabel === "string" ? item.polLabel.trim() : "";

  if (language === "uk") {
    return uk || base;
  }

  if (language === "pl") {
    return pl || base;
  }

  return base;
};
