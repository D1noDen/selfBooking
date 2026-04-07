import { useState, useRef, useEffect, useMemo, forwardRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useOnClickOutside } from "../helpers/helpers";
import {
  get_Doctor_By_Type_Id,
  get_Apoiment_Types_Self_Booking,
  get_Slot_Apoiment,
} from "../request/requestSelfBooking";
import SelfBookingStore from "../../store/SelfBookingStore";
import moment from "moment";
import "moment/locale/pl";
import "moment/locale/uk";
//import useAuth from "../../../Routes/useAuth";
import useAuth from "../../store/useAuth";
import Spinner from "../helpers/Spinner";
import LanguageSelector from "./LanguageSelector";
import googleTranslate from "../../assets/images/self-booking/googleTranslate.png";
import geoPoint from "../../assets/images/self-booking/geoPoint.svg";
import clock from "../../assets/images/self-booking/clock.png";
import calendar from "../../assets/images/self-booking/calendar.png";
import chevronRight from "../../assets/images/self-booking/chevronRight.png";
import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";
import WithoutAvatar from "../../assets/images/svg/NoAvatar.svg";
import { getBookingInformation } from "../../helpers/bookingStorage";
import { formatDateForDisplay } from "../../helpers/dateFormat";
import { getDateFnsLocale, getIntlLocale } from "../../i18n/dateLocale";
import DatePicker from "react-datepicker";
import useTimezoneFormatter from "../../hooks/useTimezoneFormatter";
import { useAppTranslation } from "../../i18n/useAppTranslation";

const normalizeLanguage = (language = "en") => {
  const value = String(language || "en").toLowerCase();
  if (value === "ua" || value.startsWith("uk")) return "uk";
  if (value.startsWith("pl")) return "pl";
  return "en";
};
const CalendarButton = forwardRef(({ onClick, label }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex items-center gap-[4px] text-[12px] text-[#8380FF]"
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.99927 1.5V4.5" stroke="#8380FF" stroke-width="1.49981" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.9985 1.5V4.5" stroke="#8380FF" stroke-width="1.49981" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.2482 2.99951H3.74956C2.92124 2.99951 2.24976 3.671 2.24976 4.49932V14.998C2.24976 15.8263 2.92124 16.4978 3.74956 16.4978H14.2482C15.0765 16.4978 15.748 15.8263 15.748 14.998V4.49932C15.748 3.671 15.0765 2.99951 14.2482 2.99951Z" stroke="#8380FF" stroke-width="1.49981" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.24976 7.49902H15.748" stroke="#8380FF" stroke-width="1.49981" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>{label}</span>
    <img
      src={chevronRight}
      className="w-[12px] h-[12px] rotate-90"
      alt=""
      aria-hidden="true"
    />
  </button>
));
const UpcomingScheduleM = ({ setSesionStorage }) => {
const {auth} = useAuth();
  const { t } = useAppTranslation();
  const language = SelfBookingStore((state) => state.language || "en");
  const normalizedLanguage = normalizeLanguage(language);
  const { formatInTimeZone, formatTimeInTimeZone } = useTimezoneFormatter({
    locale: getIntlLocale(normalizedLanguage),
    timeZone: "Europe/Warsaw",
  });
  useEffect(() => {
    const momentLocale =
      normalizedLanguage === "uk" ? "uk" : normalizedLanguage === "pl" ? "pl" : "en";
    moment.locale(momentLocale);
  }, [normalizedLanguage]);
  const [doctors, setDoctors] = useState(null);
  const [events, setEvents] = useState(null);
  const [types, setTypes] = useState(null);
  const [doctorsWithEvents, setDoctorsWithEvents] = useState([]);
  const toYmdLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [weekStartDate, setWeekStartDate] = useState(() => toYmdLocal(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => toYmdLocal(new Date()));
  const setAppPage = SelfBookingStore((state) => state.setAppPage);

  const informationWithSorage = getBookingInformation() || {};
  const storedAppointmentTypeId = informationWithSorage?.apoimentTypeId?.id || null;
  const storedAppointmentTypeLabel =
    informationWithSorage?.apoimentTypeId?.label ||
    informationWithSorage?.apoimentTypeId?.lebel ||
    "";
  const [selectedAppointment, setSelectedAppointment] = useState(
    storedAppointmentTypeId
  );
  const {
    data: GetDoctorByTypeIdData,
    isLoading: GetDoctorByTypeIdLoading,
    setText: GetDoctorByTypeIdInformation,
  } = get_Doctor_By_Type_Id();
  const {
    data: GetSlotApoimentData,
    isLoading: GetSlotApoimentLoading,
    setText: GetSlotApoimentInformation,
  } = get_Slot_Apoiment();
  const {
    data: GetApoimentTypesSelfBookingData,
    isLoading: GetApoimentTypesSelfBookingLoading,
    setText: GetApoimentTypesSelfBookingInformation,
  } = get_Apoiment_Types_Self_Booking();

  useEffect(() => {
   if(auth){
     GetApoimentTypesSelfBookingInformation({
     bookingToken :auth,
    });
  }
  }, [auth]);

  useEffect(() => {
    if (GetApoimentTypesSelfBookingData) {
      setTypes(GetApoimentTypesSelfBookingData?.data?.result);
      const selected = GetApoimentTypesSelfBookingData?.data?.result.filter(
        (item) => item.id === storedAppointmentTypeId
      );
    }
  }, [GetApoimentTypesSelfBookingData]);

  useEffect(() => {
    if (informationWithSorage) {
      const activeAppointmentTypeId =
        selectedAppointment?.id || storedAppointmentTypeId;
      if (!activeAppointmentTypeId) {
        setAppPage("visit type mobile");
        return;
      }
      const start = weekStartDate;
      const endDate = moment(weekStartDate, "YYYY-MM-DD").add(4, "days").format("YYYY-MM-DD");
      GetSlotApoimentInformation({
        bookingToken:auth,
        appointmentTypeId: activeAppointmentTypeId,
        startDate: start,
        endDate: endDate,
      });
      GetDoctorByTypeIdInformation({
        bookingToken:auth,
        appointmentTypeId: activeAppointmentTypeId,
      });
    }
  }, [selectedAppointment, weekStartDate, storedAppointmentTypeId, setAppPage]);
  useEffect(() => {
    if (GetDoctorByTypeIdData) {
      setDoctors(GetDoctorByTypeIdData.data.result);
    }
    if (GetSlotApoimentData) {
      setEvents(GetSlotApoimentData.data.result.shifts);
    }
  }, [GetDoctorByTypeIdData, GetSlotApoimentData]);
  useEffect(() => {
    if (doctors && events) {
      const newArrayDoctors = doctors.map((item) => ({
        id: item.userId,
        avatar: item.profilePicture,
        name: `${item.firstName + " " + item.lastName}`,
        gender: item.gender,
        speciality: item.specializationLabel,
        cabinetId: events.find(
          (filter) => filter.shift.userId == item.userId 
        )?.shift.cabinetId,
        time: events
          .filter((filter) => filter.shift.userId == item.userId)
          .flatMap((event) =>
            event.appointmentSlot.map((apoiment) => ({
              title: formatTimeInTimeZone(apoiment.startTime),
              dateStart: apoiment.startTime,
              dateEnd: apoiment.endTime,
            }))
          ),
      }));
      console.log(newArrayDoctors , 'newArrayDoctors');
      setDoctorsWithEvents(newArrayDoctors);
    }
  }, [doctors, events, formatTimeInTimeZone]);

  return (
    <div>
      {/* {doctorsWithEvents.length === 0 ? <Spinner /> : null} */}
      <section className="mobileBG h-[120px] p-[16px]">
        <div className="flex h-fit ">
          <div className="relative flex gap-[12px] items-center h-fit w-full max-w-[290px]">
             <img
              onClick={() => {
                setAppPage("visit type mobile");
              }}
              className=" top-[10px] left-0 h-[16px] w-[16px]"
              src={chevronLeft}
            />
            <p className="text-[24px] text-white text-center leading-normal">
              {t("upcoming_schedule", "Upcoming schedule")}
            </p>
           
          </div>
          
        </div>
        <div className="flex gap-[12px] mt-[16px]">
          <div className="px-[12px] h-[35px]  bg-[rgba(255,255,255,0.10)] flex items-center  gap-[8px]  rounded-[10px] w-[242px]">
           <img className="h-[20px] w-[14px]" src={geoPoint} />
              <p className="text-[14px] text-white font-hebrew ">
                {t("default_city", "Warsaw")}
              </p>
            </div>
          <LanguageSelector/>
        </div>
        
      </section>
      <section className="px-[16px] pt-[24px] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[8px]">
          <label className="text-[12px] text-[#6A7282]">
            {t("service_label", "Service")}
          </label>
          <Dropdown
            options={types}
            isIconNeeded={false}
            icon={""}
            iconWidth="0"
            activeOption={storedAppointmentTypeLabel}
            dropdownWidth={"100%"}
            setSesionStorage={setSesionStorage}
            setSelectedAppointment={setSelectedAppointment}
          />
        </div>
        <DateSwiper
          selectedDate={selectedDate}
          onSelectedDateChange={(nextSelected) => {
            setSelectedDate(nextSelected);
            setWeekStartDate(nextSelected);
          }}
          weekStartDate={weekStartDate}
          onWeekChange={(nextWeekStart) => {
            const normalized = toYmdLocal(nextWeekStart);
            setWeekStartDate(normalized);
            setSelectedDate(normalized);
          }}
          language={normalizedLanguage}
        />
        <div className="flex flex-col gap-[12px]">
          {doctorsWithEvents?.map((item, i) => (
            <DoctorBlock
            item={item}
              name={item.name}
              img={item.avatar}
              speciality={item.speciality}
              key={i}
              doctorId={item.id}
              date={item.time}
              language={normalizedLanguage}
              informationWithSorage={informationWithSorage}
              setSesionStorage={setSesionStorage}
              formatInTimeZone={formatInTimeZone}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default UpcomingScheduleM;

const DateSwiper = ({
  selectedDate,
  onSelectedDateChange,
  weekStartDate,
  onWeekChange,
  language,
}) => {
  const { t } = useAppTranslation();
  const normalizedLanguage = normalizeLanguage(language);
  const intlLocale = getIntlLocale(normalizedLanguage);
  const momentLocale = useMemo(
    () =>
      normalizedLanguage === "uk" ? "uk" : normalizedLanguage === "pl" ? "pl" : "en",
    [normalizedLanguage]
  );
  const monthYearFormatter = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }),
    [intlLocale]
  );
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { month: "long" }),
    [intlLocale]
  );
  const monthShortDayFormatter = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { month: "short", day: "numeric" }),
    [intlLocale]
  );
  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { weekday: "short" }),
    [intlLocale]
  );
  const capitalizeFirst = (value) => {
    if (!value) return value;
    const [first, ...rest] = value;
    return `${first.toLocaleUpperCase(intlLocale)}${rest.join("")}`;
  };
  const formatWeekdayShort = (date) => {
    const value = weekdayFormatter.format(date);
    const trimmed = value.replace(".", "").trim();
    if (!trimmed) return trimmed;
    const letters = trimmed.slice(0, 2);
    return letters.toLocaleUpperCase(intlLocale);
  };
  const toYmdLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const ymdToNoonDate = (ymd) => {
    const [year, month, day] = ymd.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  };
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);

  useEffect(() => {
    if (!isPickerOpen) {
      setTempSelectedDate(selectedDate);
    }
  }, [isPickerOpen, selectedDate]);

  const generateWeekDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      days.push(moment(startDate).locale(momentLocale).add(i, "days"));
    }
    return days;
  };

  const weekStart = moment(weekStartDate, "YYYY-MM-DD")
    .locale(momentLocale)
    .startOf("day");
  const weekDays = generateWeekDays(weekStart);
  const weekEnd = moment(weekStart).locale(momentLocale).add(4, "days").endOf("day");
  const startMonthLabel = capitalizeFirst(monthFormatter.format(weekStart.toDate()));
  const endMonthLabel = capitalizeFirst(monthFormatter.format(weekEnd.toDate()));
  const calendarLabel =
    startMonthLabel === endMonthLabel
      ? startMonthLabel
      : `${startMonthLabel} - ${endMonthLabel}`;
  const rangeStartLabel = capitalizeFirst(
    monthShortDayFormatter.format(ymdToNoonDate(tempSelectedDate))
  );
  const rangeEndLabel = capitalizeFirst(
    monthShortDayFormatter.format(
      moment(tempSelectedDate, "YYYY-MM-DD").add(4, "days").toDate()
    )
  );
  const rangeLabel = `${rangeStartLabel} - ${rangeEndLabel}`;

  const canGoPrev = weekStart.isAfter(moment().startOf("day"));

  const handlePrevWeek = () => {
    if (canGoPrev) {
      const newStart = moment(weekStartDate, "YYYY-MM-DD")
        .locale(momentLocale)
        .subtract(5, "days");
      onWeekChange(ymdToNoonDate(newStart.format("YYYY-MM-DD")));
    }
  };

  const handleNextWeek = () => {
    const newStart = moment(weekStartDate, "YYYY-MM-DD")
      .locale(momentLocale)
      .add(5, "days");
    onWeekChange(ymdToNoonDate(newStart.format("YYYY-MM-DD")));
  };

  const handleDateClick = (date) => {
    const normalized = date.format("YYYY-MM-DD");
    onSelectedDateChange(normalized);
  };

  const isToday = (date) => {
    return moment().isSame(date, "day");
  };

  const isSelected = (date) => {
    return moment(selectedDate, "YYYY-MM-DD").isSame(date, "day");
  };

  const openPicker = () => {
    setTempSelectedDate(selectedDate);
    setIsPickerOpen(true);
  };

  const closePicker = () => {
    setIsPickerOpen(false);
  };

  const applyPickerDate = () => {
    const next = tempSelectedDate || selectedDate;
    onSelectedDateChange(next);
    setIsPickerOpen(false);
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex justify-start gap-2 items-center">
        <p className="text-[12px] text-[#6A7282]">
          {t("select_date", "Select date")}:
        </p>
        <CalendarButton
          label={calendarLabel || t("calendar_label", "Calendar")}
          onClick={openPicker}
        />
        
      </div>

      {isPickerOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={closePicker}
            aria-label={t("close_date_picker", "Close date picker")}
          />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-[20px] p-[16px] shadow-[0_-6px_24px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between mb-[12px]">
              <p className="text-[16px] font-semibold text-[#111827]">
                {capitalizeFirst(monthYearFormatter.format(ymdToNoonDate(tempSelectedDate)))}
              </p>
              <button
                type="button"
                onClick={closePicker}
                className="flex items-center justify-center"
                aria-label={t("close", "Close")}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.9882 5.99609L5.99609 17.9882" stroke="#4A5565" stroke-width="1.99868" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.99609 5.99609L17.9882 17.9882" stroke="#4A5565" stroke-width="1.99868" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="text-center text-[13px] text-[#6B7280] mb-[6px] flex justify-center items-center">
              {rangeLabel}
            </div>
            <DatePicker
              inline
              selected={ymdToNoonDate(tempSelectedDate)}
              onChange={(date) => {
                if (!date) return;
                setTempSelectedDate(toYmdLocal(date));
              }}
              locale={getDateFnsLocale(normalizedLanguage)}
              calendarClassName="mobile-sheet-calendar"
              dayClassName={(date) => {
                const start = moment(tempSelectedDate, "YYYY-MM-DD");
                const end = start.clone().add(4, "days");
                const current = moment(date);
                if (!current.isBetween(start, end, "day", "[]")) return "";
                if (current.isSame(start, "day")) return "mobile-range-start";
                if (current.isSame(end, "day")) return "mobile-range-end";
                return "mobile-range-middle";
              }}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-[8px] mb-[8px]">
                  <button
                    type="button"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${
                      prevMonthButtonDisabled
                        ? "opacity-40"
                        : "hover:bg-[#F3F4FF]"
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.4918 14.99L7.49512 9.99328L12.4918 4.99658" stroke="#4A5565" stroke-width="1.66557" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <span className="text-[14px] font-medium text-[#111827]">
                    {capitalizeFirst(monthYearFormatter.format(date))}
                  </span>
                  <button
                    type="button"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${
                      nextMonthButtonDisabled
                        ? "opacity-40"
                        : "hover:bg-[#F3F4FF]"
                    }`}
                  >
                    <svg className="rotate-180" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.4918 14.99L7.49512 9.99328L12.4918 4.99658" stroke="#4A5565" stroke-width="1.66557" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            />
            <div className="mt-[12px] flex gap-[12px]">
              <button
                type="button"
                onClick={closePicker}
                className="flex-1 h-[44px] rounded-[12px] border border-[#E5E7EB] text-[#111827] text-[14px] font-medium"
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                type="button"
                onClick={applyPickerDate}
                className="flex-1 h-[44px] rounded-[12px] bg-[#7D99FB] text-white text-[14px] font-medium"
              >
                {t("select", "Select")}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative flex items-center gap-[8px]">
        <button
          onClick={handlePrevWeek}
          disabled={!canGoPrev}
          className={`flex-shrink-0 w-[32px] h-[32px] rounded-[8px] border border-[#E8E8E9] flex items-center justify-center ${
            canGoPrev ? 'bg-white hover:bg-[#F3F3FF] cursor-pointer' : 'bg-[#F5F5F5] cursor-not-allowed opacity-50'
          }`}
        >
          <img src={chevronRight} className="w-[10px] h-[10px] rotate-180" />
        </button>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-[8px] justify-between">
            {weekDays.map((day, index) => {
              const selected = isSelected(day);
              const today = isToday(day);
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`flex flex-col items-center justify-center w-[59.999px] h-[75.969px] rounded-[12px] transition-all ${
                    selected
                      ? 'bg-[#7D99FB] text-white shadow-md'
                      : today
                      ? 'bg-[#F0F4FF] text-[#7D99FB] border border-[#7D99FB]'
                      : 'bg-white text-[#64697E] border border-[#E8E8E9]'
                  }`}
                >
                  <span className={`text-[10px] font-medium uppercase ${selected ? 'text-white' : 'text-[#8696BB]'}`}>
                    {formatWeekdayShort(day.toDate())}
                  </span>
                  <span className={`text-[18px] font-semibold mt-[2px] ${selected ? 'text-white' : 'text-[#0D1B34]'}`}>
                    {day.format("D")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleNextWeek}
          className="flex-shrink-0 w-[32px] h-[32px] rounded-[8px] border border-[#E8E8E9] bg-white flex items-center justify-center hover:bg-[#F3F3FF]"
        >
          <img src={chevronRight} className="w-[10px] h-[10px]" />
        </button>
      </div>
    </div>
  );
};

const Dropdown = ({
  options,
  isIconNeeded,
  icon,
  iconWidth,
  activeOption,
  dropdownWidth,
  setSesionStorage,
  setSelectedAppointment,
}) => {
  const informationWithSorage = getBookingInformation() || {};
  const [selectedOption, setSelectedOption] = useState(activeOption);
  const [visibleAppList, setVisibleAppList] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [hover, setHover] = useState(false);
  const appointmentList = useRef(null);
  useOnClickOutside(appointmentList, () => {
    if (visibleAppList) {
      setRotate(!rotate);
      setVisibleAppList(!visibleAppList);
    }
  });
  let dropdown;
  if (isIconNeeded) {
    dropdown = (
      <div
        className={`text-[16px]/[22px] text-[#64697E] h-full font-nunito tracking-[0.72px] w-[${dropdownWidth}] `}
      >
        <Listbox
          as={"div"}
          value={selectedOption}
          className={`relative`}
          ref={appointmentList}
          onFocus={() => console.log("focus")}
          onChange={(e) => {
            setSesionStorage({
              apoimentTypeId: {
                id: e.id,
                label: e.label,
              },
            });
          }}
        >
          <Listbox.Button
            className={`w-full h-[49px] px-[10px] border-[1px] border-[#E8E8E9] rounded-[10px] text-left relative z-[11] hover: bg-no-repeat bg-[90%_20px] bg-white`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => {
              setRotate(!rotate);
              setVisibleAppList(!visibleAppList);
            }}
          >
            <div className="relative">
              <img
                className={`w-[${iconWidth}] h-auto absolute top-[-2px] left-0`}
                src={icon}
              />
              <div
                style={{
                  paddingLeft: iconWidth,
                }}
              >
                {selectedOption}
              </div>
            </div>

            <span
              className={` absolute top-[calc(50%-5px)] right-[10px] w-[18px] h-[10px] ${
                hover
                  ? 'bg-[url("./assets/images/self-booking/listArrowHover.svg")]'
                  : 'bg-[url("./assets/images/self-booking/listArrow.svg")]'
              } ${rotate ? "rotate-180" : "rotate-0"} duration-500`}
            ></span>
          </Listbox.Button>
          <Transition
            as={"div"}
            show={rotate}
            className={`relative -top-[50px] z-[3] `}
            enter="transition duration-500 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-500 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options
              className={`absolute top-[39px] w-full left-0 pt-3 z-[1] bg-white rounded-[10px] border-[1px] border-[#E8E8E9]`}
            >
              {options.map((item, i) => {
                return (
                  <Listbox.Option
                    key={i}
                    value={item.label}
                    className={`h-[49px] px-[10px] w-full flex items-center cursor-pointer hover:bg-[#F3F3FF]`}
                    onClick={() => {
                      setRotate(!rotate);
                      setVisibleAppList(false);
                      setSelectedOption(item.label);
                      setSesionStorage({
                        apoimentTypeId: {
                          id: e.id,
                          label: e.label,
                        },
                      });
                    }}
                  >
                    {item.label}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    );
  } else {
    dropdown = (
      <div
        className={`text-[16px]/[22px] text-[#64697E] font-nunito tracking-[0.72px] w-[${dropdownWidth}] `}
      >
        <Listbox
          as={"div"}
          value={selectedOption}
          className={`relative`}
          ref={appointmentList}
          onFocus={() => console.log("focus")}
        >
          <Listbox.Button
            className={`w-full h-[49px] px-[10px] border-[1px] border-[#E8E8E9] rounded-[10px] text-left relative z-[10] hover: bg-no-repeat bg-[90%_20px] bg-white`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => {
              setRotate(!rotate);
              setVisibleAppList(!visibleAppList);
            }}
          >
            {selectedOption}
            <span
              className={` absolute top-[calc(50%-5px)] right-[10px] w-[18px] h-[10px] ${
                hover
                  ? 'bg-[url("./assets/images/self-booking/listArrowHover.svg")]'
                  : 'bg-[url("./assets/images/self-booking/listArrow.svg")]'
              } ${rotate ? "rotate-180" : "rotate-0"} duration-500`}
            ></span>
          </Listbox.Button>
          <Transition
            as={"div"}
            show={rotate}
            className={`relative -top-[50px] z-[1] `}
            enter="transition duration-500 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-500 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options
              className={`absolute top-[39px] w-full left-0 pt-3 z-[1] bg-white rounded-[10px] border-[1px] border-[#E8E8E9]`}
            >
              {options?.map((item, i) => {
                return (
                  <Listbox.Option
                    key={i}
                    value={item.label}
                    className={`h-[49px] px-[10px] w-full  flex items-center cursor-pointer hover:bg-[#F3F3FF]`}
                    onClick={() => {
                      setRotate(!rotate);
                      setVisibleAppList(false);
                      setSelectedOption(item.label);
                      setSesionStorage({
                        apoimentTypeId: {
                          id: item.id,
                          label: item.label,
                        },
                      });
                      setSelectedAppointment(item.id);
                    }}
                  >
                    {item.label}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    );
  }

  return <div className={``}>{dropdown}</div>;
};

const DoctorBlock = ({
  item,
  name,
  language,
  setSesionStorage,
  informationWithSorage,
  formatInTimeZone,
}) => {
  const { t } = useAppTranslation();
  const normalizedLanguage = normalizeLanguage(language);
  const intlLocale = getIntlLocale(normalizedLanguage);
  const momentLocale = useMemo(
    () =>
      normalizedLanguage === "uk" ? "uk" : normalizedLanguage === "pl" ? "pl" : "en",
    [normalizedLanguage]
  );
  const displayDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(intlLocale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [intlLocale]
  );
  const formatDisplayDate = (date) => {
    const parts = displayDateFormatter.formatToParts(date);
    const withCapitalizedMonth = parts.map((part) => {
      if (part.type !== "month") return part.value;
      const [first, ...rest] = part.value;
      return `${first.toLocaleUpperCase(intlLocale)}${rest.join("")}`;
    });
    const joined = withCapitalizedMonth.join("");
    const [first, ...rest] = joined;
    return `${first.toLocaleUpperCase(intlLocale)}${rest.join("")}`;
  };
  console.log(item , 'item in doctor block');
  const [open , setOpen] = useState(Boolean(item.time?.length));
  const groupedSlots = useMemo(() => {
    const slots = item.time || [];
    const byDate = new Map();
    const dateTimeFormats = [
      "DD.MM.YYYY HH:mm:ss",
      "DD.MM.YYYY HH:mm",
      "YYYY-MM-DD HH:mm:ss",
      "YYYY-MM-DD HH:mm",
      "YYYY-MM-DDTHH:mm:ss",
      "YYYY-MM-DDTHH:mm",
      moment.ISO_8601,
    ];

    slots.forEach((slot) => {
      const parsed = moment(slot.dateStart, dateTimeFormats, true).locale(momentLocale);
      if (!parsed.isValid()) return;
      const dateKey = parsed.format("YYYY-MM-DD");
      const displayDate = formatDisplayDate(parsed.toDate());
      if (!byDate.has(dateKey)) byDate.set(dateKey, { displayDate, slots: [] });
      byDate.get(dateKey).slots.push(slot);
    });

    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, group]) => ({
        dateKey,
        displayDate: group.displayDate,
        slots: group.slots.sort(
          (a, b) => new Date(a.dateStart) - new Date(b.dateStart)
        ),
      }));
  }, [item.time, momentLocale, displayDateFormatter, intlLocale]);

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setChosenDoctor = SelfBookingStore((state) => state.setChosenDoctor);

  useEffect(() => {
    if ((item.time?.length || 0) > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [item.time?.length]);
  return (
    <div className="px-[12px] doctorBlock py-[16px] rounded-[12px] flex flex-col gap-[12px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-[10px] items-center">
       <div className="w-[47px] h-[47px] flex items-center justify-center rounded-full bg-[#E8E5FF]">
         <span className="text-[24px]">{item.gender == 'Female' ? "👩‍⚕️" : '👨‍⚕️'}</span>
       </div>
        <div className="flex flex-col gap-[4px]">
          <p className="text-[#101828] text-[18px] font-hebrew">{name}</p>
          
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#6A7282] text-nowrap font-hebrew text-[12px]">
          {t("slots_label", "slots")} {item.time?.length}
        </span>
         <img onClick={() => {
          setOpen(!open)
         }} className={`h-[18px] w-[18px] duration-300 ${open ? '-rotate-90' :'rotate-90'}`} src={chevronRight} />
      </div>
      </div>
      <div className="h-[1px] background-[#F5F5F5] w-full"></div>
      {open && (
        <div className="flex flex-col gap-[12px]">
          {groupedSlots.map((group) => (
            <div key={group.dateKey} className="flex flex-col">
              <div className="flex gap-[8px] items-center">
                <p className="font-hebrew text-[14px] text-[#4A5565]">
                  {group.displayDate}
                </p>
              </div>
              <div className="flex gap-[4px] flex-wrap items-center">
                {group.slots.map((time, i) => {
                  console.log(item, "item in time map");
                  return (
                    <button
                      key={`${group.dateKey}-${i}`}
                      onClick={() => {
                        setAppPage("for who mobile");
                        setSesionStorage({
                          ...informationWithSorage,
                          doctor: {
                            avatar: item.avatar,
                            name: item.name,
                            speciality: item.speciality,
                            id: item.id,
                            cabinetId: item.cabinetId,
                            eventStartDateTime: time.dateStart,
                            eventEnd: time.dateEnd,
                          },
                        });
                      }}
                      className="w-[100px] text-[#364153] active:text-white active:bg-[#8380FF] h-[53px] rounded-[10px] flex items-center justify-center shadow-[0_2px_10px_0_rgba(0,0,0,0.06),_0_1px_2px_-1px_rgba(0,0,0,0.05)]"
                    >
                      <p className=" text-[16px] font-hebrew ">
                        {time.title.toUpperCase()}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
