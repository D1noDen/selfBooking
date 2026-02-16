import { useMemo, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { useOnClickOutside } from "../helpers/helpers";

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toDisplayDate = (date) =>
  `${`${date.getDate()}`.padStart(2, "0")}.${`${date.getMonth() + 1}`.padStart(2, "0")}.${date.getFullYear()}`;

const parseDisplayDate = (value) => {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
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

const monthNames = Array.from({ length: 12 }, (_, index) =>
  new Date(2000, index, 1).toLocaleString("en-US", { month: "long" })
);

const DatePickerField = ({
  id,
  label,
  width,
  placeholder = "dd.mm.yyyy",
  control,
  rules,
  errors,
  disabled = false,
  minDate,
  maxDate,
}) => {
  const pickerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pickerViewDate, setPickerViewDate] = useState(new Date());
  const [typedValue, setTypedValue] = useState("");

  useOnClickOutside(pickerRef, () => setIsOpen(false));

  const { field } = useController({ name: id, control, rules });

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

  const startYear = useMemo(() => {
    if (normalizedMinDate) return normalizedMinDate.getFullYear();
    if (normalizedMaxDate) return normalizedMaxDate.getFullYear() - 120;
    return new Date().getFullYear() - 120;
  }, [normalizedMinDate, normalizedMaxDate]);

  const endYear = useMemo(() => {
    if (normalizedMaxDate) return normalizedMaxDate.getFullYear();
    if (normalizedMinDate) return normalizedMinDate.getFullYear() + 120;
    return new Date().getFullYear() + 20;
  }, [normalizedMinDate, normalizedMaxDate]);

  const yearOptions = useMemo(
    () => Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index),
    [startYear, endYear]
  );

  const selectedDate = fromIsoDate(field.value);
  const displayValue = selectedDate ? toDisplayDate(selectedDate) : "";
  const inputValue = typedValue || displayValue;

  const isOutOfRange = (date) => {
    if (normalizedMinDate && date < normalizedMinDate) return true;
    if (normalizedMaxDate && date > normalizedMaxDate) return true;
    return false;
  };

  return (
    <div className={`inputBlock flex flex-col ${width} mb-[22px] relative`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[15px]/[18px] text-[#333] font-sans font-[500] tracking-[0.675px] mb-[2px]"
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
              setPickerViewDate(selectedDate || normalizedMaxDate || new Date());
              setIsOpen(true);
            }}
            onChange={(event) => {
              if (disabled) return;
              const value = event.target.value;
              setTypedValue(value);
              const parsedDate = parseDisplayDate(value);
              if (parsedDate && !isOutOfRange(parsedDate)) {
                field.onChange(toIsoDate(parsedDate));
              }
            }}
            onBlur={() => {
              const parsedDate = parseDisplayDate(typedValue);
              if (typedValue === "") {
                field.onChange("");
                setTypedValue("");
                field.onBlur();
                return;
              }
              if (parsedDate && !isOutOfRange(parsedDate)) {
                field.onChange(toIsoDate(parsedDate));
                setTypedValue("");
              } else {
                setTypedValue(displayValue);
              }
              field.onBlur();
            }}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            className={`w-full px-[12px] py-[8px] pr-[38px] border-[2px] border-[#E8E8E9] rounded-[10px] text-[15px]/[18px] text-left font-sans tracking-[0.675px] ${
              disabled ? "bg-[#F0F2F6] text-[#A4ABBC] cursor-not-allowed" : "bg-white text-[#333]"
            }`}
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={() => {
              if (disabled) return;
              setPickerViewDate(selectedDate || normalizedMaxDate || new Date());
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
            className="absolute top-[44px] left-1/2 -translate-x-1/2 z-30 w-[670px] rounded-[12px] bg-white p-4"
            style={{ boxShadow: "0px 2px 4px -2px #0000001A" }}
          >
            <div className="flex gap-4">
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
                  const isBeforeMin = normalizedMinDate && dayDate < normalizedMinDate;
                  const isAfterMax = normalizedMaxDate && dayDate > normalizedMaxDate;

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
                  <>
                    <div className="w-[190px] max-h-[360px] scrollmainContent overflow-y-auto pr-2 border-r border-[#E3E4EA]">
                      {monthNames.map((month, index) => (
                        <button
                          type="button"
                          key={month}
                          className={`w-full px-3 flex justify-center items-center text-center py-2 rounded-[8px] text-[15px] font-sans ${
                            index === pickerMonth
                              ? "bg-[#F5F3FF] text-[#2B2B2F]"
                              : "text-[#8D8D8D] hover:bg-[#F0F1F7]"
                          }`}
                          onClick={() => setPickerViewDate(new Date(pickerYear, index, 1))}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                    <div className="w-[120px] max-h-[360px] scrollmainContent overflow-y-auto pr-2">
                      {yearOptions.map((year) => (
                        <button
                          type="button"
                          key={year}
                          className={`w-full px-3 flex justify-center items-center text-center py-2 rounded-[8px] text-[15px] font-sans ${
                            year === pickerYear
                              ? "bg-[#F5F3FF] text-[#2B2B2F]"
                              : "text-[#8D8D8D] hover:bg-[#F0F1F7]"
                          }`}
                          onClick={() => setPickerViewDate(new Date(year, pickerMonth, 1))}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 pl-2">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[17px] font-semibold text-[#333333]">
                          {monthNames[pickerMonth]} {pickerYear}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ECEEFF]"
                            onClick={() => setPickerViewDate(new Date(pickerYear, pickerMonth - 1, 1))}
                          >
                            <svg width="16" height="16" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.4999 15L6.8999 10L11.4999 5" stroke="#7C67FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ECEEFF]"
                            onClick={() => setPickerViewDate(new Date(pickerYear, pickerMonth + 1, 1))}
                          >
                            <svg width="16" height="16" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.8999 15L11.4999 10L6.8999 5" stroke="#7C67FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-y-2 mb-3">
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((dayName) => (
                          <span
                            key={dayName}
                            className="text-center text-[14px] text-[#33333366] font-semibold font-sans"
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
                            className={`h-[46px] rounded-[10px] text-[14px] font-medium ${
                              day.isSelected
                                ? "bg-[#7C67FF] text-white"
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
                            }}
                          >
                            {day.day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
      {errors?.[id] && (
        <p className="absolute top-[47px] bg-white px-3 left-[5px] text-red-500 text-[12px]/[14px]">
          {errors[id]?.message || "Field is required"}
        </p>
      )}
    </div>
  );
};

export default DatePickerField;
