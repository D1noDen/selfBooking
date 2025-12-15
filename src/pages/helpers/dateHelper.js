export const dateHelper = (dateStr) => {
  const date = dateStr.split(" ")[0];
  const time = dateStr.split(" ")[1];
  const year = date.split(".")[2];
  const month = date.split(".")[1];
  const day = date.split(".")[0];
  const newStartDate = year + "-" + month + "-" + day + "T" + time + "Z";
  return newStartDate;
};
