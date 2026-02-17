export const dateHelper = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return "";

  const [date = "", time = ""] = dateStr.trim().split(/\s+/);
  const [day = "", month = "", year = ""] = date.split(".");

  if (!day || !month || !year || !time) return "";

  return `${year}-${month}-${day}T${time}Z`;
};
