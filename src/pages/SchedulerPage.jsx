import {
  Fragment,
  useState,
  useRef,
  createRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Scrollbar } from "react-scrollbars-custom";
import { Listbox, Transition } from "@headlessui/react";
import SelfBookingStore from "../store/SelfBookingStore";
import {
  get_Slot_Apoiment,
  get_Apoiment_Types_Self_Booking,
  get_Doctor_By_Type_Id,
} from "./request/requestSelfBooking";
import Spinner from "./helpers/Spinner";
import WithoutAvatar from "../assets/images/svg/NoAvatar.svg";
import moment from "moment";
import useAuth from "../store/useAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MonthYearPickerButton = forwardRef(({ value, onClick, isOpen }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className="bg-white text-[16px]/[20px] flex items-center justify-between gap-2 text-[#333] font-sans font-semibold"
  >
    <span>{value}</span>
    <span className={`${isOpen ? "rotate-180" : ""} duration-200`}>
      <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 6.90039L10 11.5004L15 6.90039" stroke="#0A0A0A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  </button>
));

MonthYearPickerButton.displayName = "MonthYearPickerButton";

const SchedulerPage = ({ setSesionStorage }) => {
  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  ) || {};
  const storedAppointmentTypeId = informationWithSorage?.apoimentTypeId?.id || null;
  const [selectedAppointment, setSelectedAppointment] = useState(
    storedAppointmentTypeId
  );
  const setSchedulerHasSelection = SelfBookingStore(
    (state) => state.setSchedulerHasSelection
  );
  const [events, setEvents] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [doctorsWithEvents, setDoctorsWithEvents] = useState([]);
  const todayDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const maxSelectableDate = useMemo(() => {
    const date = new Date(todayDate);
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }, [todayDate]);
  const [startDate, setStartDay] = useState(todayDate);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedSlot, setSelectedSlot] = useState(() => {
    const storedDoctor = informationWithSorage?.doctor;
    if (!storedDoctor?.id || !storedDoctor?.eventStartDateTime) {
      return null;
    }

    return {
      slotKey: null,
      doctor: storedDoctor,
      dateStart: storedDoctor.eventStartDateTime,
      time: moment(storedDoctor.eventStartDateTime, "DD.MM.YYYY HH:mm:ss").format("HH:mm"),
    };
  });
  const [isMonthYearOpen, setIsMonthYearOpen] = useState(false);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const {auth} = useAuth();

  const doctorCacheRef = useRef({});
  const slotCacheRef = useRef({});
  const pendingDoctorRequestRef = useRef(null);
  const pendingSlotRequestRef = useRef(null);
  const touchStartXRef = useRef(null);

  const {
    data: GetSlotApoimentData,
    setText: GetSlotApoimentInformation,
  } = get_Slot_Apoiment();
  
  const {
    data: GetDoctorByTypeIdData,
    setText: GetDoctorByTypeIdInformation,
  } = get_Doctor_By_Type_Id();

  const getWeekDates = useCallback((weekStartDate) => {
    return Array.from({ length: 7 }).map((_, index) =>
      moment(weekStartDate).add(index, "days").format("YYYY-MM-DD")
    );
  }, []);

  const getCacheBucket = useCallback((appointmentTypeId) => {
    if (!slotCacheRef.current[appointmentTypeId]) {
      slotCacheRef.current[appointmentTypeId] = {
        loadedDates: new Set(),
        shiftsByDate: {},
      };
    }
    return slotCacheRef.current[appointmentTypeId];
  }, []);

  const updateVisibleEventsFromCache = useCallback(
    (appointmentTypeId, weekStartDate) => {
      const weekDates = getWeekDates(weekStartDate);
      const cacheBucket = getCacheBucket(appointmentTypeId);
      const weekShifts = weekDates.flatMap(
        (day) => cacheBucket.shiftsByDate[day] || []
      );
      setEvents(weekShifts);
    },
    [getCacheBucket, getWeekDates]
  );

  const getMissingDatesForWeek = useCallback(
    (appointmentTypeId, weekStartDate) => {
      const weekDates = getWeekDates(weekStartDate);
      const cacheBucket = getCacheBucket(appointmentTypeId);
      return weekDates.filter((day) => !cacheBucket.loadedDates.has(day));
    },
    [getCacheBucket, getWeekDates]
  );

  const getShiftDateKey = useCallback((shift) => {
    const firstSlotDateTime = shift?.appointmentSlot?.[0]?.startTime;
    if (!firstSlotDateTime) return null;
    const [rawDate] = firstSlotDateTime.split(" ");
    const parsedDate = moment(rawDate, "DD.MM.YYYY", true);
    return parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : null;
  }, []);

  const getShiftSignature = useCallback((shift) => {
    const userId = shift?.shift?.userId ?? "";
    const cabinetId = shift?.shift?.cabinetId ?? "";
    const slots = (shift?.appointmentSlot || [])
      .map((slot) => `${slot.startTime}|${slot.endTime}`)
      .sort()
      .join(",");
    return `${userId}|${cabinetId}|${slots}`;
  }, []);

  const getDaySignature = useCallback(
    (dayShifts) =>
      (dayShifts || [])
        .map((shift) => getShiftSignature(shift))
        .sort()
        .join("||"),
    [getShiftSignature]
  );

  const updateDoctorInStorage = useCallback(
    (doctorData) => {
      const currentInfo = JSON.parse(sessionStorage.getItem("BookingInformation")) || {};
      const nextInfo = { ...currentInfo };

      if (doctorData) {
        nextInfo.doctor = doctorData;
      } else {
        delete nextInfo.doctor;
      }

      setSesionStorage(nextInfo);
    },
    [setSesionStorage]
  );

  const clearSelectedSlot = useCallback(() => {
    setSelectedSlot(null);
    updateDoctorInStorage(null);
  }, [updateDoctorInStorage]);
  
  useEffect(() => {
    const appointmentTypeId = selectedAppointment?.id || storedAppointmentTypeId;
    if (!appointmentTypeId || !auth) {
      setDoctorsWithEvents([]);
      setDoctors(null);
      setEvents(null);
      setIsLoadingData(false);
      return;
    }

    const cachedDoctors = doctorCacheRef.current[appointmentTypeId];
    if (cachedDoctors) {
      setDoctors(cachedDoctors);
    } else {
      setDoctors(null);
    }

    updateVisibleEventsFromCache(appointmentTypeId, startDate);

    const weekDates = getWeekDates(startDate);
    const missingDates = getMissingDatesForWeek(appointmentTypeId, startDate);
    const shouldFetchDoctors = !cachedDoctors;
    const shouldFetchMissingSlots = missingDates.length > 0;
    const shouldRefreshCachedWeek = missingDates.length === 0;
    const shouldShowSpinner = shouldFetchDoctors || shouldFetchMissingSlots;

    if (shouldFetchMissingSlots) {
      clearSelectedSlot();
    }

    if (!shouldFetchDoctors && !shouldFetchMissingSlots && !shouldRefreshCachedWeek) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(shouldShowSpinner);

    if (shouldFetchDoctors) {
      pendingDoctorRequestRef.current = { appointmentTypeId };
      GetDoctorByTypeIdInformation({
        bookingToken: auth,
        appointmentTypeId,
      });
    }

    if (shouldFetchMissingSlots) {
      pendingSlotRequestRef.current = {
        mode: "missing",
        appointmentTypeId,
        requestedDates: missingDates,
        showSpinner: true,
      };
      GetSlotApoimentInformation({
        bookingToken: auth,
        appointmentTypeId,
        startDate: missingDates[0],
        endDate: missingDates[missingDates.length - 1],
      });
      return;
    }

    if (shouldRefreshCachedWeek) {
      pendingSlotRequestRef.current = {
        mode: "refresh",
        appointmentTypeId,
        requestedDates: weekDates,
        showSpinner: false,
      };
      GetSlotApoimentInformation({
        bookingToken: auth,
        appointmentTypeId,
        startDate: weekDates[0],
        endDate: weekDates[weekDates.length - 1],
      });
    }
  }, [
    selectedAppointment,
    startDate,
    auth,
    storedAppointmentTypeId,
    GetDoctorByTypeIdInformation,
    GetSlotApoimentInformation,
    clearSelectedSlot,
    getWeekDates,
    getMissingDatesForWeek,
    updateVisibleEventsFromCache,
  ]);

  const {
    data: GetApoimentTypesSelfBookingData,
    isLoading: GetApoimentTypesSelfBookingLoading,
    setText: GetApoimentTypesSelfBookingInformation,
  } = get_Apoiment_Types_Self_Booking();

  const appointmentTypeOptions = useMemo(
    () => GetApoimentTypesSelfBookingData?.data?.result || [],
    [GetApoimentTypesSelfBookingData]
  );

  useEffect(() => {
    if (auth) {
      GetApoimentTypesSelfBookingInformation({
        bookingToken: auth,
      });
    }
  }, [auth]);

  useEffect(() => {
    if (!storedAppointmentTypeId || appointmentTypeOptions.length === 0) return;

    const selected = appointmentTypeOptions.find(
      (item) => item.id === storedAppointmentTypeId
    );

    if (selected) {
      setSelectedAppointment({ id: selected.id, label: selected.label });
    }
  }, [appointmentTypeOptions, storedAppointmentTypeId]);

  const handleVisitTypeChange = useCallback(
    (nextId) => {
      const parsedNextId = Number(nextId);
      const nextType = appointmentTypeOptions.find(
        (item) => item.id === parsedNextId
      );
      if (!nextType) return;

      clearSelectedSlot();
      setSelectedAppointment({ id: nextType.id, label: nextType.label });

      const currentInfo = JSON.parse(sessionStorage.getItem("BookingInformation")) || {};
      setSesionStorage({
        ...currentInfo,
        apoimentTypeId: {
          id: parsedNextId,
          lebel: nextType.label,
        },
      });
    },
    [appointmentTypeOptions, clearSelectedSlot, setSesionStorage]
  );

  const selectedAppointmentLabel = useMemo(() => {
    const currentId = selectedAppointment?.id || storedAppointmentTypeId;
    const currentType = appointmentTypeOptions.find((item) => item.id === currentId);
    return currentType?.label || "Select visit type";
  }, [appointmentTypeOptions, selectedAppointment, storedAppointmentTypeId]);

  useEffect(() => {
    const pendingDoctorRequest = pendingDoctorRequestRef.current;
    if (!pendingDoctorRequest || !GetDoctorByTypeIdData?.data?.result) return;

    doctorCacheRef.current[pendingDoctorRequest.appointmentTypeId] =
      GetDoctorByTypeIdData.data.result;
    setDoctors(GetDoctorByTypeIdData.data.result);
    pendingDoctorRequestRef.current = null;
    setIsLoadingData(Boolean(pendingSlotRequestRef.current));
  }, [GetDoctorByTypeIdData]);

  useEffect(() => {
    const pendingSlotRequest = pendingSlotRequestRef.current;
    if (!pendingSlotRequest || !GetSlotApoimentData?.data?.result) return;

    const cacheBucket = getCacheBucket(pendingSlotRequest.appointmentTypeId);
    const fetchedShifts = GetSlotApoimentData.data.result.shifts || [];
    const nextShiftsByDate = {};

    pendingSlotRequest.requestedDates.forEach((day) => {
      nextShiftsByDate[day] = [];
    });

    fetchedShifts.forEach((shift) => {
      const dayKey = getShiftDateKey(shift);
      if (!dayKey) return;
      if (!nextShiftsByDate[dayKey]) {
        nextShiftsByDate[dayKey] = [];
      }
      nextShiftsByDate[dayKey].push(shift);
    });

    let hasChanges = false;
    pendingSlotRequest.requestedDates.forEach((day) => {
      const prevDayShifts = cacheBucket.shiftsByDate[day] || [];
      const nextDayShifts = nextShiftsByDate[day] || [];
      const isSameDay =
        getDaySignature(prevDayShifts) === getDaySignature(nextDayShifts);

      cacheBucket.loadedDates.add(day);
      if (!isSameDay) {
        cacheBucket.shiftsByDate[day] = nextDayShifts;
        hasChanges = true;
      }
    });

    const activeAppointmentTypeId = selectedAppointment?.id || storedAppointmentTypeId;
    if (hasChanges && activeAppointmentTypeId === pendingSlotRequest.appointmentTypeId) {
      updateVisibleEventsFromCache(activeAppointmentTypeId, startDate);
    }

    pendingSlotRequestRef.current = null;
    setIsLoadingData(Boolean(pendingDoctorRequestRef.current));
  }, [
    GetSlotApoimentData,
    getCacheBucket,
    getDaySignature,
    getShiftDateKey,
    selectedAppointment,
    startDate,
    storedAppointmentTypeId,
    updateVisibleEventsFromCache,
  ]);

  // Виправлений useEffect для обробки doctors і events
  useEffect(() => {
    if (!doctors || !events || doctors.length === 0 || events.length === 0) {
      setDoctorsWithEvents([]);
      return;
    }

    console.log(events, 'doctors , events');
     
    const newArrayDoctors = doctors.map((item) => ({
      id: item.userId,
      avatar: item.profilePicture,
      name: `${item.firstName + " " + item.lastName}`,
      speciality: item.specializationLabel,
      cabinetId: events.find(
        (filter) => filter.shift.userId == item.userId 
      )?.shift.cabinetId,
      time: events
        .filter((filter) => filter.shift.userId == item.userId)
        .flatMap((event) =>
          event.appointmentSlot.map((apoiment) => {
            const date = apoiment.startTime.split(" ")[0];
            const time = apoiment.startTime.split(" ")[1];
            const day = date.split(".")[0];
            const month = date.split(".")[1];
            const year = date.split(".")[2];

            return {
              title: moment(time, "HH:mm:ss").format("HH:mm "),
              date: year + "-" + month + "-" + day,
              dateStart: apoiment.startTime,
              dateEnd: apoiment.endTime,
              slotKey: `${item.userId}-${apoiment.startTime}-${apoiment.endTime}`,
            };
          })
        ),
    }));
    
    setDoctorsWithEvents(newArrayDoctors);
  }, [doctors, events]);

  const TimeAppointment = (eventInfo) => {
    if (eventInfo.event.extendedProps.isEmpty) {
      return (
        <div className="bg-[#F4F5FA] text-[18px]/[24px] text-[#A7ACBD] w-[130px] lg:h-[44px] xl:h-[48px] flex justify-center items-center border border-solid border-[#E8E8E9] rounded-[10px] mb-[12px] cursor-default">
          —
        </div>
      );
    }

    const isSelected =
      selectedSlot &&
      eventInfo.event.extendedProps.slotKey === selectedSlot.slotKey;

    return (
      <div
        className={`text-[18px]/[24px] font-hebrew tracking-[0.63px] w-[130px] lg:h-[44px] xl:h-[48px] flex justify-center items-center border border-solid rounded-[10px] cursor-pointer mb-[12px] ${
          isSelected
            ? "bg-[#8380FF] text-white border-[#8380FF]"
            : "bg-white text-[#8380FF] border-[#E8E8E9] hover:bg-[#8380FF] hover:text-white"
        }`}
        style={{
          boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.10)"
        }}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  let calendarRefs = doctorsWithEvents.map((item) => createRef(item.id));

  let _height = window.innerHeight;
  let _width = window.innerWidth;

  useEffect(() => {
    if (doctorsWithEvents.length !== 0 && calendarRefs[0]?.current !== null) {
      queueMicrotask(() => {
        calendarRefs.forEach((item) => {
          if (item.current) {
            item.current
              .getApi()
              .gotoDate(
                startDate.toLocaleDateString().split(".").reverse().join("-")
              );
          }
        });
      });
    }
  }, [doctorsWithEvents, calendarRefs]);

  const memoizedDoctorsWithEvents = useMemo(() => {
    return doctorsWithEvents?.map((item) => ({
      ...item,
      events: item.time 
    }));
  }, [doctorsWithEvents]);

  const memoizedDoctorsWithProcessedEvents = useMemo(() => {
    if (!memoizedDoctorsWithEvents || memoizedDoctorsWithEvents.length === 0) {
      return [];
    }

    return memoizedDoctorsWithEvents?.map((item) => {
      const filledEvents = [];
      const weekStart = new Date(startDate);
      
      for (let day = 0; day < 7; day++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + day);
        const dayString = moment(currentDay).format("YYYY-MM-DD");
        
        const hasEventsForDay = item.time?.some(event => 
          event.date === dayString
        );
        
        if (!hasEventsForDay) {
          filledEvents.push({
            title: "—",
            start: dayString,
            classNames: ['empty-day-placeholder'],
            allDay: true,
            extendedProps: {
              isEmpty: true
            }
          });
        }
      }
      
      return {
        ...item,
        processedEvents: [...(item.time || []), ...filledEvents]
      };
    });
  }, [memoizedDoctorsWithEvents, startDate]);

  useEffect(() => {
    if (!isLoadingData && memoizedDoctorsWithProcessedEvents.length === 0 && selectedSlot) {
      clearSelectedSlot();
    }
  }, [
    clearSelectedSlot,
    isLoadingData,
    memoizedDoctorsWithProcessedEvents,
    selectedSlot,
  ]);

  const createEventClickHandler = useCallback((item) => {
    return (e) => {
      if (e.event.extendedProps.isEmpty) {
        return;
      }

      const nextSelectedSlot = {
        slotKey: e.event.extendedProps.slotKey,
        doctor: {
          avatar: item.avatar,
          name: item.name,
          speciality: item.speciality,
          id: item.id,
          cabinetId: item.cabinetId,
          eventStartDateTime: e.event.extendedProps.dateStart,
          eventEnd: e.event.extendedProps.dateEnd,
        },
        dateStart: e.event.extendedProps.dateStart,
        time: (e.event.title || "").trim(),
      };

      setSelectedSlot(nextSelectedSlot);
      updateDoctorInStorage(nextSelectedSlot.doctor);
    };
  }, [updateDoctorInStorage]);

  useEffect(() => {
    setSchedulerHasSelection(Boolean(selectedSlot?.doctor?.id));
  }, [selectedSlot, setSchedulerHasSelection]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(startDate);
      day.setDate(day.getDate() + index);
      day.setHours(0, 0, 0, 0);
      const isDisabled = day < todayDate || day > maxSelectableDate;

      return {
        date: day,
        iso: moment(day).format("YYYY-MM-DD"),
        dayNumber: day.getDate(),
        dayName: moment(day).format("ddd"),
        isToday: day.getTime() === todayDate.getTime(),
        isDisabled,
      };
    });
  }, [startDate, todayDate, maxSelectableDate]);

  const weekMs = 7 * 24 * 60 * 60 * 1000;

  const changeWeek = (direction) => {
    const nextDate = new Date(startDate.getTime() + direction * weekMs);
    nextDate.setHours(0, 0, 0, 0);

    if (direction < 0 && nextDate < todayDate) {
      setStartDay(todayDate);
      setSelectedDate(todayDate);
      return;
    }

    if (direction > 0 && nextDate > maxSelectableDate) {
      setStartDay(maxSelectableDate);
      setSelectedDate(maxSelectableDate);
      return;
    }

    setStartDay(nextDate);
    setSelectedDate(nextDate);
  };

  const handlePickerDateChange = (date) => {
    if (!date) return;
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    if (normalizedDate < todayDate || normalizedDate > maxSelectableDate) return;
    setSelectedDate(normalizedDate);
    setStartDay(normalizedDate);
  };

  const handleDatesTouchStart = (event) => {
    touchStartXRef.current = event.touches[0].clientX;
  };

  const handleDatesTouchEnd = (event) => {
    if (touchStartXRef.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    touchStartXRef.current = null;

    if (Math.abs(diff) < 40) return;
    changeWeek(diff > 0 ? 1 : -1);
  };

  const selectedWeekStart = useMemo(() => {
    const date = new Date(startDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [startDate]);

  const selectedWeekEnd = useMemo(() => {
    const date = new Date(startDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 6);
    return date;
  }, [startDate]);

  const getPickerDayClassName = useCallback(
    (date) => {
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);

      if (currentDate < selectedWeekStart || currentDate > selectedWeekEnd) {
        return "";
      }

      if (currentDate.getTime() === selectedWeekStart.getTime()) {
        return "scheduler-week-day scheduler-week-day-start";
      }

      if (currentDate.getTime() === selectedWeekEnd.getTime()) {
        return "scheduler-week-day scheduler-week-day-end";
      }

      return "scheduler-week-day scheduler-week-day-middle";
    },
    [selectedWeekEnd, selectedWeekStart]
  );
 
  return (
    <>
      <div
      // h-[calc(100vh-200px)] - можна це вкинути
        className={`pt-[20px] pb-[20px] bg-white mx-auto rounded-[10px] overflow-hidden`}
        style={{
          boxShadow: "0 4px 20px -1px rgba(0, 0, 0, 0.06)",
          width: widthBlock,
          height:
            _height >= 1080
              ? _width > 1280
                ? 940
                : 980
              : _width > 1280
              ? _height < 1000
                ? _height - 100
                : _height - 130
              : _height < 1000
              ? _height - 100
              : _height - 100,
          minHeight: 688,
        }}
      >
        <div className={`flex relative bg-white border-b border-[#E5E5EA]`}>
          <div className={`lg:w-[260px] xl:w-[30%] flex flex-col items-start gap-4 text-start lg:p-4 xl:px-10`}>
            <div className={`text-[30px] text-[#333] font-semibold font-sans`}>
              Select date and time
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[16px] font-sans text-[#333333] font-[600]">Visit type</span>
              <Listbox
                value={selectedAppointment?.id || storedAppointmentTypeId || ""}
                onChange={handleVisitTypeChange}
              >
                <div className="relative w-[260px] font-sans text-[14px] text-[#333333] font-[400]">
                  <Listbox.Button className="h-[40px] w-full rounded-[8px] border border-[#0000001F] px-3 bg-white focus:outline-none focus:border-[#8380FF] flex items-center justify-between">
                    <span className="truncate">{selectedAppointmentLabel}</span>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="scrollmainContent absolute mt-1 max-h-60 w-full overflow-auto rounded-[8px] bg-white border border-[#DADCE5] py-1 shadow-lg z-20">
                      {appointmentTypeOptions.map((item) => (
                        <Listbox.Option
                          key={item.id}
                          value={item.id}
                          className={({ active }) =>
                            `cursor-pointer select-none px-3 py-2 text-[14px] ${
                              active ? "bg-[#F3F4FF] text-[#2A2C33]" : "text-[#2A2C33]"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <span className={selected ? "font-semibold" : "font-normal"}>
                              {item.label}
                            </span>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
          <div className={`lg:w-[76%] xl:w-[70%] px-4 lg:pt-5 lg:pb-4 xl:pt-7 xl:pb-5`}>
            <div className="flex justify-center items-center gap-3 mb-5 text-[#2A2C33]">
              {/* <span className={`w-6 h-6 bg-[url("./assets/images/self-booking/calendarIcon.svg")] bg-center bg-no-repeat`}></span> */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V6" stroke="#333333" stroke-width="2.33" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 2V6" stroke="#333333" stroke-width="2.33" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#333333" stroke-width="2.33" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 10H21" stroke="#333333" stroke-width="2.33" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <DatePicker
                selected={selectedDate}
                onChange={handlePickerDateChange}
                minDate={todayDate}
                maxDate={maxSelectableDate}
                dateFormat="MMMM yyyy"
                todayButton="Today"
                open={isMonthYearOpen}
                onInputClick={() => setIsMonthYearOpen(true)}
                onClickOutside={() => setIsMonthYearOpen(false)}
                onSelect={() => setIsMonthYearOpen(false)}
                customInput={<MonthYearPickerButton isOpen={isMonthYearOpen} />}
                popperPlacement="bottom"
                popperClassName="scheduler-monthyear-popper"
                calendarClassName="scheduler-monthyear-calendar"
                dayClassName={getPickerDayClassName}
                className="hidden"
              />
            </div>
            <div
              className="flex items-start gap-3 relative w-[calc(100%-50px)] mx-auto"
              onTouchStart={handleDatesTouchStart}
              onTouchEnd={handleDatesTouchEnd}
            >
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white flex justify-center items-center absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                onClick={() => changeWeek(-1)}
                disabled={startDate <= todayDate}
                style={{
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)",
                  opacity: startDate <= todayDate ? 0.4 : 1,
                  cursor: startDate <= todayDate ? "not-allowed" : "pointer",
                }}
              >
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4999 15L6.8999 10L11.4999 5" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div className="grid grid-cols-7 gap-0 flex-1">
                {weekDays.map((day) => {
                  // const isActive = day.iso === activeDay;
                  return (
                    <div
                      key={day.iso}
                      className={`relative flex flex-col items-center gap-1 ${day.isDisabled ? "opacity-40" : ""}`}
                    >
                      {day.isToday && (
                        <span className="absolute top-[10px] right-0 rounded-[4px] bg-[#8380FF] px-[8px] py-[4px] text-[10px] font-[400] font-sans leading-none text-white">
                          Today
                        </span>
                      )}
                      <span
                        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-[20px] text-[#101828]
                        }`}
                        // style={isActive ? {
                          // boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)"
                        // } : {}}
                      >
                        {day.dayNumber}
                      </span>
                      <span className="text-[14px] font-sans text-[#4A5565]">
                        {day.dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white flex justify-center items-center absolute top-1/2 transform -translate-y-1/2 z-10 right-0"
                onClick={() => changeWeek(1)}
                disabled={startDate >= maxSelectableDate}
                style={{
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)",
                  opacity: startDate >= maxSelectableDate ? 0.4 : 1,
                  cursor:
                    startDate >= maxSelectableDate
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.8999 15L11.4999 10L6.8999 5" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* <div className="w-full bg-[#F5F5FF] px-8 py-4 flex items-center justify-between gap-4 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-8 text-[#5A5A65]">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V6" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 4H5C3.9 4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4Z" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#333333] font-sans font-[400] text-[16px]">
                {selectedSlot
                  ? moment(selectedSlot.dateStart, "DD.MM.YYYY HH:mm:ss").format("MMMM D, YYYY")
                  : "Select date"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7V12L15 14" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#333333] font-sans font-[400] text-[16px]">
                {selectedSlot ? selectedSlot.time : "--:--"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13C14.2 13 16 11.2 16 9C16 6.8 14.2 5 12 5C9.8 5 8 6.8 8 9C8 11.2 9.8 13 12 13Z" stroke="#6C63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[#333333] font-sans font-[400] text-[16px]">
                {selectedSlot ? selectedSlot.doctor.name : "Select provider"}
              </span>
            </div>
          </div>
        </div> */}
        <Scrollbar
  style={{
    height:
      _height >= 1080
        ? _width > 1280
          ? 740
          : 740
        : _width < 1280
        ? _height >= 1000
          ? _height - 340
          : _height - 340
        : _height >= 1000
        ? _height - 330
        : _height - 300,
    minHeight: 439,
  }}
  trackYProps={{ className: "trackY" }}
  thumbYProps={{ className: "thumbY" }}
>
  <div>
    {isLoadingData ? (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    ) : memoizedDoctorsWithProcessedEvents && memoizedDoctorsWithProcessedEvents.length > 0 ? (
      memoizedDoctorsWithProcessedEvents.map((item, i) => {
        return (
          <div
            className={`flex border-b border-b-[#E5E5EA] ${
              i % 2 === 0 ? "bg-white" : "bg-[#F1F2FA]"
            }`}
            key={item.id || i} 
          >
            <div
              className={`flex lg:flex-col xl:flex-row lg:justify-center xl:justify-normal lg:items-start xl:items-center lg:py-3 xl:py-10 lg:pl-5 xl:pl-10 lg:w-[260px] xl:w-[30%] border-r border-r-[#E5E5EA] items-center`}
            >
              <div
                className={` bg-transparent  w-[48px] h-[48px] mr-[25px] lg:mb-3 xl:mb-0`}
              >
                <img
                  className={`rounded-[25px]`}
                  src={item.avatar || WithoutAvatar}
                  alt="avatar"
                />
              </div>
              <div className={`flex flex-col`}>
                <span
                  className={`uppercase text-[16px]/[22px] text-[#D2D2D2] font-nunito font-bold tracking-[0.72px] lg:mb-3 xl:mb-0`}
                >
                  {item.speciality}
                </span>
                <span
                  className={`text-[18px]/[25px] text-[#6C6C6C] font-nunito font-semibold tracking-[0.81px]`}
                >
                  {item.name}
                </span>
              </div>
            </div>
            <div
              className={`eachDoctorCalendar lg:w-[77%] xl:w-[70%]`}
            >
              <FullCalendar
                headerToolbar={false}
                dayHeaders={false}
                plugins={[dayGridPlugin]}
                initialView="dayGridSeven"
                views={{
                  dayGridSeven: {
                    type: "dayGrid",
                    duration: { days: 7 },
                    dateAlignment: "day",
                  },
                }}
                events={item.processedEvents}
                eventContent={TimeAppointment}
                height={"auto"}
                ref={calendarRefs[i]}
                initialDate={startDate}
                eventClick={createEventClickHandler(item)}
              />
            </div>
          </div>
        );
      })
    ) : (
      <div className="flex items-center justify-center py-10 text-gray-500">
        No appointments available
      </div>
    )}
  </div>
</Scrollbar>
      </div>
    </>
  );
};

export default SchedulerPage;
