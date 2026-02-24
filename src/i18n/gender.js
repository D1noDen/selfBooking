export const GENDER_VALUES = ["Male", "Female", "Other"];

const GENDER_LABEL_KEYS = {
  Male: "male",
  Female: "female",
  Other: "other",
};

const LEGACY_GENDER_ALIASES = {
  male: "Male",
  female: "Female",
  other: "Other",
  "\u0447\u043e\u043b\u043e\u0432\u0456\u0447\u0430": "Male",
  "\u0436\u0456\u043d\u043e\u0447\u0430": "Female",
  "\u0456\u043d\u0448\u0430": "Other",
  mezczyzna: "Male",
  kobieta: "Female",
  inna: "Other",
};

const normalizeAliasKey = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const normalizeGender = (value) => {
  if (!value) return "Male";
  if (GENDER_VALUES.includes(value)) return value;
  return LEGACY_GENDER_ALIASES[normalizeAliasKey(value)] || "Male";
};

export const getGenderLabel = (t, value) => {
  const normalized = normalizeGender(value);
  const labelKey = GENDER_LABEL_KEYS[normalized];
  return t(labelKey, normalized);
};
