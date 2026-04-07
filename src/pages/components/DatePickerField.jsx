import { useEffect, useMemo, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { useOnClickOutside } from "../helpers/helpers";
import { useAppTranslation } from "../../i18n/useAppTranslation";
import { getIntlLocale } from "../../i18n/dateLocale";

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toDisplayDate = (date) =>
  `${date.getFullYear()}.${`${date.getMonth() + 1}`.padStart(2, "0")}.${`${date.getDate()}`.padStart(2, "0")}`;

const partialDateInputPattern =
  /^$|^\d{1,4}$|^\d{4}[./]$|^\d{4}[./]\d{1,2}$|^\d{4}[./]\d{1,2}[./]$|^\d{4}[./]\d{1,2}[./]\d{1,2}$/;

const isValidPartialDateInput = (value) => partialDateInputPattern.test(value);

const parseDisplayDate = (value) => {
  const match = value.match(/^(\d{4})[./](\d{1,2})[./](\d{1,2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  parsed.setHours(0, 0, 0, 0);
  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getDate() !== Number(day)
  ) {
    return null;
  }
  return parsed;
};

const fromIsoDate = (value) => {
  if (!value || typeof value !== "string") return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

const DatePickerField = ({
  id,
  label,
  width,
  placeholder = "yyyy.mm.dd",
  control,
  rules,
  errors,
  disabled = false,
  minDate,
  maxDate,
  minYearsFromToday,
  maxYearsFromToday,
}) => {
  const { language } = useAppTranslation();
  const localeCode = getIntlLocale(language);
  const pickerRef = useRef(null);
  const monthListRef = useRef(null);
  const yearListRef = useRef(null);
  const activeMonthButtonRef = useRef(null);
  const activeYearButtonRef = useRef(null);
  const hasOpenedOnceRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pickerViewDate, setPickerViewDate] = useState(new Date());
  const [typedValue, setTypedValue] = useState("");
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState(false);
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);

  useOnClickOutside(pickerRef, () => setIsOpen(false));

  const { field } = useController({ name: id, control, rules });

  const monthNames = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) =>
        new Date(2000, index, 1).toLocaleString(localeCode, { month: "long" })
      ),
    [localeCode]
  );
  const weekdayNames = useMemo(() => {
    const mondayUtc = new Date(Date.UTC(2024, 0, 1));
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(mondayUtc);
      day.setUTCDate(mondayUtc.getUTCDate() + index);
      return new Intl.DateTimeFormat(localeCode, { weekday: "short" })
        .format(day)
        .toUpperCase();
    });
  }, [localeCode]);

  const normalizedMinDate = useMemo(() => {
    if (!minDate) return null;
    const date = new Date(minDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [minDate]);

  const normalizedMaxDate = useMemo(() => {
    if (!maxDate) return null;
    const date = new Date(maxDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [maxDate]);

  const normalizedMinYearsFromTodayDate = useMemo(() => {
    if (typeof minYearsFromToday !== "number") return null;
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear - minYearsFromToday, 0, 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [minYearsFromToday]);

  const effectiveMinDate = useMemo(() => {
    if (normalizedMinDate && normalizedMinYearsFromTodayDate) {
      return normalizedMinDate > normalizedMinYearsFromTodayDate
        ? normalizedMinDate
        : normalizedMinYearsFromTodayDate;
    }
    return normalizedMinDate || normalizedMinYearsFromTodayDate || null;
  }, [normalizedMinDate, normalizedMinYearsFromTodayDate]);

  const normalizedMaxYearsFromTodayDate = useMemo(() => {
    if (typeof maxYearsFromToday !== "number") return null;
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear - maxYearsFromToday, 11, 31);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [maxYearsFromToday]);

  const effectiveMaxDate = useMemo(() => {
    if (normalizedMaxDate && normalizedMaxYearsFromTodayDate) {
      return normalizedMaxDate < normalizedMaxYearsFromTodayDate
        ? normalizedMaxDate
        : normalizedMaxYearsFromTodayDate;
    }
    return normalizedMaxDate || normalizedMaxYearsFromTodayDate || null;
  }, [normalizedMaxDate, normalizedMaxYearsFromTodayDate]);

  const startYear = useMemo(() => {
    if (effectiveMinDate) return effectiveMinDate.getFullYear();
    if (effectiveMaxDate) return effectiveMaxDate.getFullYear() - 120;
    return new Date().getFullYear() - 120;
  }, [effectiveMinDate, effectiveMaxDate]);

  const endYear = useMemo(() => {
    if (effectiveMaxDate) return effectiveMaxDate.getFullYear();
    if (effectiveMinDate) return effectiveMinDate.getFullYear() + 120;
    return new Date().getFullYear() + 20;
  }, [effectiveMinDate, effectiveMaxDate]);

  const yearOptions = useMemo(
    () => Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index),
    [startYear, endYear]
  );

  const selectedDate = fromIsoDate(field.value);
  const displayValue = selectedDate ? toDisplayDate(selectedDate) : "";
  const inputValue = typedValue || displayValue;

  useEffect(() => {
    if (!isOpen) {
      setIsMonthMenuOpen(false);
      setIsYearMenuOpen(false);
    }
    if (!isOpen) return;

    const shouldScrollToLatestOnFirstOpen =
      !hasOpenedOnceRef.current &&
      !selectedDate &&
      !!effectiveMaxDate &&
      pickerViewDate.getTime() === effectiveMaxDate.getTime();

    const scrollActiveIntoList = (listRef, itemRef, align = "center") => {
      const listEl = listRef.current;
      const itemEl = itemRef.current;
      if (!listEl || !itemEl) return;

      let targetTop = itemEl.offsetTop - listEl.clientHeight / 2 + itemEl.clientHeight / 2;
      if (align === "end") {
        targetTop = itemEl.offsetTop - listEl.clientHeight + itemEl.clientHeight;
      }
      const maxTop = Math.max(0, listEl.scrollHeight - listEl.clientHeight);
      listEl.scrollTop = Math.min(Math.max(0, targetTop), maxTop);
    };

    const align = shouldScrollToLatestOnFirstOpen ? "end" : "center";
    scrollActiveIntoList(monthListRef, activeMonthButtonRef, align);
    scrollActiveIntoList(yearListRef, activeYearButtonRef, align);
    hasOpenedOnceRef.current = true;
  }, [effectiveMaxDate, isOpen, pickerViewDate, selectedDate]);

  const isOutOfRange = (date) => {
    if (effectiveMinDate && date < effectiveMinDate) return true;
    if (effectiveMaxDate && date > effectiveMaxDate) return true;
    return false;
  };

  const commitTypedDate = () => {
    const candidate = typedValue || displayValue;
    const parsedDate = parseDisplayDate(candidate);

    if (typedValue === "") {
      field.onBlur();
      return;
    }

    if (parsedDate && !isOutOfRange(parsedDate)) {
      field.onChange(toIsoDate(parsedDate));
      setPickerViewDate(parsedDate);
      setTypedValue("");
    } else {
      setTypedValue(displayValue);
    }

    field.onBlur();
  };

  return (
    <div className={`inputBlock flex flex-col ${width} mb-[26px]`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[15px]/[18px] text-[#333] font-sans font-[500] tracking-[0.675px] mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative" ref={pickerRef}>
        <div className="relative">
          <input
            id={id}
            type="text"
            value={inputValue}
            onFocus={() => {
              if (disabled) return;
              setPickerViewDate(selectedDate || effectiveMaxDate || new Date());
              setIsOpen(true);
            }}
            onChange={(event) => {
              if (disabled) return;
              const value = event.target.value.replace(/[^\d./]/g, "");
              if (!isValidPartialDateInput(value)) return;

              setTypedValue(value);
              if (value === "") {
                field.onChange("");
                return;
              }
              const parsedDate = parseDisplayDate(value);
              if (parsedDate && !isOutOfRange(parsedDate)) {
                field.onChange(toIsoDate(parsedDate));
                setPickerViewDate(parsedDate);
              }
            }}
            onBlur={() => {
              if (typedValue === "") {
                field.onBlur();
                return;
              }
              commitTypedDate();
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              if (disabled) return;
              commitTypedDate();
              setIsOpen(false);
            }}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            className={`w-full px-[12px] py-[9px] pr-[38px] border-[2px] border-[#E8E8E9] rounded-[10px] text-[15px]/[18px] text-left font-sans tracking-[0.675px] focus:border focus:border-[#6C6AC7] ${
              disabled ? "bg-[#F0F2F6] text-[#A4ABBC] cursor-not-allowed" : "bg-white text-[#333]"
            }`}
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            className={`absolute top-1/2 right-3 -translate-y-1/2 ${isOpen ? "rotate-180" : ""} duration-200`}
            onClick={() => {
              if (disabled) return;
              setPickerViewDate(selectedDate || effectiveMaxDate || new Date());
              setIsMonthMenuOpen(false);
              setIsYearMenuOpen(false);
              setIsOpen((prev) => !prev);
            }}
          >
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L6 6L1 1" stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {isOpen && !disabled && (
          <div
            className="absolute top-[44px] left-1/2 -translate-x-1/2 z-30 w-full max-w-[340px] rounded-[12px] bg-white p-4"
            style={{ boxShadow: '0px 10px 60px 0px #0000001A' }}
          >
            <div className="flex">
              {(() => {
                const pickerMonth = pickerViewDate.getMonth();
                const pickerYear = pickerViewDate.getFullYear();
                const startOfMonth = new Date(pickerYear, pickerMonth, 1);
                const endOfMonth = new Date(pickerYear, pickerMonth + 1, 0);

                const startGrid = new Date(startOfMonth);
                const startDay = (startGrid.getDay() + 6) % 7;
                startGrid.setDate(startGrid.getDate() - startDay);

                const endGrid = new Date(endOfMonth);
                const endDay = (endGrid.getDay() + 6) % 7;
                endGrid.setDate(endGrid.getDate() + (6 - endDay));

                const calendarDays = [];
                const cursor = new Date(startGrid);
                while (cursor <= endGrid) {
                  const dayDate = new Date(cursor);
                  dayDate.setHours(0, 0, 0, 0);
                  const isCurrentMonth = dayDate.getMonth() === pickerMonth;
                  const isBeforeMin = effectiveMinDate && dayDate < effectiveMinDate;
                  const isAfterMax = effectiveMaxDate && dayDate > effectiveMaxDate;

                  calendarDays.push({
                    iso: toIsoDate(dayDate),
                    day: dayDate.getDate(),
                    value: dayDate,
                    isCurrentMonth,
                    isSelected: !!selectedDate && toIsoDate(selectedDate) === toIsoDate(dayDate),
                    isDisabled: !isCurrentMonth || isBeforeMin || isAfterMax,
                  });
                  cursor.setDate(cursor.getDate() + 1);
                }

                return (
                  <div className="flex-1">
                    <div className="relative flex items-center gap-4 mb-4">
                      <div className="relative">
                        <button
                          type="button"
                          className="flex items-center gap-2 text-[18px] font-semibold text-[#333333] hover:text-[#7C67FF]"
                          onClick={() => {
                            setIsMonthMenuOpen((prev) => !prev);
                            setIsYearMenuOpen(false);
                          }}
                        >
                          {monthNames[pickerMonth]}
                          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1L6 6L1 1" stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        {isMonthMenuOpen && (
                          <div className="absolute left-0 mt-2 w-[170px] max-h-[240px] scrollmainContent overflow-y-auto rounded-[10px] border border-[#E3E4EA] bg-white p-2 z-40">
                            <div ref={monthListRef} className="max-h-[220px] overflow-y-auto">
                              {monthNames.map((month, index) => (
                                <button
                                  type="button"
                                  key={month}
                                  ref={index === pickerMonth ? activeMonthButtonRef : null}
                                  className={`w-full px-3 flex justify-start items-center text-left py-2 rounded-[8px] text-[15px] font-sans ${
                                    index === pickerMonth
                                      ? "bg-[#F5F3FF] text-[#2B2B2F]"
                                      : "text-[#8D8D8D] hover:bg-[#F0F1F7]"
                                  }`}
                                  onClick={() => {
                                    setPickerViewDate(new Date(pickerYear, index, 1));
                                    setIsMonthMenuOpen(false);
                                  }}
                                >
                                  {month}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          className="flex items-center gap-2 text-[18px] font-semibold text-[#333333] hover:text-[#7C67FF]"
                          onClick={() => {
                            setIsYearMenuOpen((prev) => !prev);
                            setIsMonthMenuOpen(false);
                          }}
                        >
                          {pickerYear}
                          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1L6 6L1 1" stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        {isYearMenuOpen && (
                          <div className="absolute left-0 mt-2 w-[120px] max-h-[240px] scrollmainContent overflow-y-auto rounded-[10px] border border-[#E3E4EA] bg-white p-2 z-40">
                            <div ref={yearListRef} className="max-h-[220px] overflow-y-auto">
                              {yearOptions.map((year) => (
                                <button
                                  type="button"
                                  key={year}
                                  ref={year === pickerYear ? activeYearButtonRef : null}
                                  className={`w-full px-3 flex justify-start items-center text-left py-2 rounded-[8px] text-[15px] font-sans ${
                                    year === pickerYear
                                      ? "bg-[#F5F3FF] text-[#2B2B2F]"
                                      : "text-[#8D8D8D] hover:bg-[#F0F1F7]"
                                  }`}
                                  onClick={() => {
                                    setPickerViewDate(new Date(year, pickerMonth, 1));
                                    setIsYearMenuOpen(false);
                                  }}
                                >
                                  {year}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 mb-3">
                      {weekdayNames.map((dayName) => (
                        <span
                          key={dayName}
                          className="text-center text-[14px] text-[#B3B3B3] font-semibold font-sans"
                        >
                          {dayName}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2">
                      {calendarDays.map((day) => (
                        <button
                          type="button"
                          key={day.iso}
                          disabled={day.isDisabled}
                          className={`h-[42px] w-[42px] mx-auto rounded-full text-[14px] font-medium ${
                            day.isSelected
                              ? "bg-[#EDEBFF] text-[#7C67FF]"
                              : day.isCurrentMonth
                              ? "text-[#333333] hover:bg-[#F5F3FF]"
                              : "text-[#C9CBD4]"
                          } ${day.isDisabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
                          onClick={() => {
                            if (day.isDisabled) return;
                            field.onChange(toIsoDate(day.value));
                            setTypedValue("");
                            field.onBlur();
                            setIsOpen(false);
                            setIsMonthMenuOpen(false);
                            setIsYearMenuOpen(false);
                          }}
                        >
                          {day.day}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
      {errors?.[id] && (
        <p className="mt-1 text-red-500 text-[12px]/[14px]">
          {errors[id]?.message || "Field is required"}
        </p>
      )}
    </div>
  );
};

export default DatePickerField;
