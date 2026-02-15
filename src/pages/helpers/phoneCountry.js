export const COUNTRY_PHONE_OPTIONS = [
  { key: "UA", label: "Ukraine", code: "+380", minLength: 9, maxLength: 9 },
  { key: "PL", label: "Poland", code: "+48", minLength: 9, maxLength: 9 },
  { key: "US", label: "United States", code: "+1", minLength: 10, maxLength: 10 },
  { key: "DE", label: "Germany", code: "+49", minLength: 10, maxLength: 11 },
];

export const DEFAULT_COUNTRY_CODE = "+380";

export const sanitizePhoneLocal = (value = "") => String(value).replace(/\D/g, "");

export const getCountryByCode = (countryCode) =>
  COUNTRY_PHONE_OPTIONS.find((item) => item.code === countryCode) ||
  COUNTRY_PHONE_OPTIONS.find((item) => item.code === DEFAULT_COUNTRY_CODE);

export const validatePhoneByCountry = (phoneValue, countryCode) => {
  const sanitized = sanitizePhoneLocal(phoneValue);
  const country = getCountryByCode(countryCode);
  if (!country) return "Invalid country code";

  if (sanitized.length < country.minLength || sanitized.length > country.maxLength) {
    return `Phone must be ${country.minLength === country.maxLength ? country.minLength : `${country.minLength}-${country.maxLength}`} digits`;
  }

  return true;
};

export const splitPhoneByCountryCode = (value = "") => {
  const source = String(value).trim();
  if (!source) {
    return { countryCode: DEFAULT_COUNTRY_CODE, localNumber: "" };
  }

  const normalized = source.startsWith("+") ? source : `+${source}`;
  const sortedCodes = [...COUNTRY_PHONE_OPTIONS]
    .map((item) => item.code)
    .sort((a, b) => b.length - a.length);

  const matchedCode = sortedCodes.find((code) => normalized.startsWith(code));

  if (!matchedCode) {
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      localNumber: sanitizePhoneLocal(source),
    };
  }

  return {
    countryCode: matchedCode,
    localNumber: sanitizePhoneLocal(normalized.slice(matchedCode.length)),
  };
};

export const joinPhoneByCountryCode = (countryCode, localNumber) =>
  `${countryCode}${sanitizePhoneLocal(localNumber)}`;
