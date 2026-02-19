const BOOKING_INFO_KEY = "BookingInformation";

const safeParse = (rawValue) => {
  if (!rawValue) return null;
  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const readFrom = (storage) => {
  if (!storage) return null;
  return safeParse(storage.getItem(BOOKING_INFO_KEY));
};

export const getBookingInformation = () => {
  const localValue = readFrom(window.localStorage);
  if (localValue) return localValue;

  const sessionValue = readFrom(window.sessionStorage);
  if (sessionValue) {
    window.localStorage.setItem(BOOKING_INFO_KEY, JSON.stringify(sessionValue));
    window.sessionStorage.removeItem(BOOKING_INFO_KEY);
    return sessionValue;
  }

  return {};
};

export const setBookingInformation = (value) => {
  const nextValue = value && typeof value === "object" ? value : {};
  window.localStorage.setItem(BOOKING_INFO_KEY, JSON.stringify(nextValue));
  return nextValue;
};

export const patchBookingInformation = (patch) => {
  const current = getBookingInformation();
  return setBookingInformation({
    ...current,
    ...patch,
  });
};

export const clearBookingInformation = () => {
  window.localStorage.removeItem(BOOKING_INFO_KEY);
  window.sessionStorage.removeItem(BOOKING_INFO_KEY);
};

export { BOOKING_INFO_KEY };
