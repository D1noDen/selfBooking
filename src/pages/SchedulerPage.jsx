import { useState, useRef, createRef, useEffect, useMemo, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Scrollbar } from "react-scrollbars-custom";
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

const SchedulerPage = ({ setSesionStorage }) => {
  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  );
  const [selectedAppointment, setSelectedAppointment] = useState(
    informationWithSorage.apoimentTypeId.id
  );
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const [events, setEvents] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [doctorsWithEvents, setDoctorsWithEvents] = useState([]);
  const [startDate, setStartDay] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthYearOpen, setIsMonthYearOpen] = useState(false);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const {auth} = useAuth();

  // ДодаємоRef для відстеження поточного запиту
  const requestIdRef = useRef(0);
  const touchStartXRef = useRef(null);
  const monthYearDropdownRef = useRef(null);

  const {
    data: GetSlotApoimentData,
    isLoading: GetSlotApoimentLoading,
    setText: GetSlotApoimentInformation,
  } = get_Slot_Apoiment();
  
  const {
    data: GetDoctorByTypeIdData,
    isLoading: GetDoctorByTypeIdLoading,
    setText: GetDoctorByTypeIdInformation,
  } = get_Doctor_By_Type_Id();
  
  useEffect(() => {
    if (!informationWithSorage) return;
  
    // Встановлюємо стан завантаження
    setIsLoadingData(true);
    
    // НЕ очищуємо дані одразу - залишаємо старі поки не прийдуть нові
    // setDoctors(null);
    // setEvents(null);
    // setDoctorsWithEvents([]);
  
    const currentRequestId = ++requestIdRef.current;
  
    const start = moment(startDate).format("YYYY-MM-DD");
    const endDate = moment(startDate).add(6, 'days').format('YYYY-MM-DD');
  
    const timer = setTimeout(() => {
      if (currentRequestId === requestIdRef.current) {
        GetSlotApoimentInformation({
          bookingToken: auth,
          appointmentTypeId: selectedAppointment?.id || informationWithSorage.apoimentTypeId.id,
          startDate: start,
          endDate: endDate,
        });
        
        GetDoctorByTypeIdInformation({
          bookingToken: auth,
          appointmentTypeId: selectedAppointment?.id || informationWithSorage.apoimentTypeId.id,
        });
      }
    }, 150);
  
    return () => clearTimeout(timer);
  }, [selectedAppointment, startDate, auth]);

  const {
    data: GetApoimentTypesSelfBookingData,
    isLoading: GetApoimentTypesSelfBookingLoading,
    setText: GetApoimentTypesSelfBookingInformation,
  } = get_Apoiment_Types_Self_Booking();

  useEffect(() => {
    if (auth) {
      GetApoimentTypesSelfBookingInformation({
        bookingToken: auth,
      });
    }
  }, [auth]);

  useEffect(() => {
    if (GetApoimentTypesSelfBookingData) {
      const selected = GetApoimentTypesSelfBookingData?.data?.result.filter(
        (item) => item.id === informationWithSorage.apoimentTypeId.id
      );

      if (selected && selected.length > 0) {
        setSelectedAppointment({ id: selected[0].id, label: selected[0].label });
      }
    }
  }, [GetApoimentTypesSelfBookingData]);

  useEffect(() => {
    if (GetDoctorByTypeIdData?.data?.result) {
      setDoctors(GetDoctorByTypeIdData.data.result);
    }
    if (GetSlotApoimentData?.data?.result?.shifts) {
      setEvents(GetSlotApoimentData.data.result.shifts);
    }
    
    // Знімаємо стан завантаження тільки коли обидва запити завершилися
    if (GetDoctorByTypeIdData && GetSlotApoimentData) {
      setIsLoadingData(false);
    }
  }, [GetDoctorByTypeIdData, GetSlotApoimentData]);

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

    return (
      <div
        className={`bg-white text-[18px]/[24px] text-[#7275FF] font-hebrew tracking-[0.63px] w-[130px] lg:h-[44px] xl:h-[48px] flex justify-center items-center border border-solid border-[#E8E8E9] rounded-[10px] hover:bg-[#F2F3FF] cursor-pointer mb-[12px] active:border-[#8380FF] active:bg-[#7A7BF2] active:text-white`}
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

  const createEventClickHandler = useCallback((item) => {
    return (e) => {
      if (e.event.extendedProps.isEmpty) {
        return;
      }
      
      setAppPage("for who");
      setHeaderPage(3);
      setSesionStorage({
        ...informationWithSorage,
        doctor: {
          avatar: item.avatar,
          name: item.name,
          speciality: item.speciality,
          id: item.id,
          cabinetId: item.cabinetId,
          eventStartDateTime: e.event._def.extendedProps.dateStart,
          eventEnd: e.event._def.extendedProps.dateEnd,
        },
      });
    };
  }, [informationWithSorage]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(startDate);
      day.setDate(day.getDate() + index);

      return {
        date: day,
        iso: moment(day).format("YYYY-MM-DD"),
        dayNumber: day.getDate(),
        dayName: moment(day).format("ddd"),
      };
    });
  }, [startDate]);

  const activeDay = moment(selectedDate).format("YYYY-MM-DD");

  const changeWeek = (direction) => {
    const nextWeekDate = new Date(startDate.getTime() + direction * 604800000);
    setStartDay(nextWeekDate);
    setSelectedDate(nextWeekDate);
  };

  const monthOptions = useMemo(() => moment.months(), []);
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);
  }, []);
  const monthYearOptions = useMemo(
    () =>
      yearOptions.flatMap((year) =>
        monthOptions.map((month, index) => ({
          label: `${month} ${year}`,
          value: `${year}-${String(index + 1).padStart(2, "0")}`,
        }))
      ),
    [monthOptions, yearOptions]
  );

  const handleDayClick = (day) => {
    setSelectedDate(day.date);
    setStartDay(day.date);
  };

  const handleMonthYearChange = (newMonth, newYear) => {
    const nextDate = new Date(newYear, newMonth, 1);
    setStartDay(nextDate);
    setSelectedDate(nextDate);
  };
  const monthYearValue = moment(startDate).format("YYYY-MM");
  const monthYearLabel = moment(startDate).format("MMMM YYYY");

  useEffect(() => {
    const onMouseDown = (event) => {
      if (
        monthYearDropdownRef.current &&
        !monthYearDropdownRef.current.contains(event.target)
      ) {
        setIsMonthYearOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

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
 
  return (
    <>
      {(GetSlotApoimentLoading || GetDoctorByTypeIdLoading) && <Spinner/>}
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
          <div className={`lg:w-[260px] xl:w-[30%] flex items-center lg:px-4 xl:px-10`}>
            <div className={`text-[22px]/[30px] text-[#333] w-full mx-auto flex justify-center text-center font-semibold font-sans`}>
              Select date and time
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
              <div className="relative" ref={monthYearDropdownRef}>
                <button
                  type="button"
                  className="bg-white text-[16px]/[20px] flex items-center justify-between gap-2 text-[#333] font-sans font-semibold"
                  onClick={() => setIsMonthYearOpen((prev) => !prev)}
                >
                  <span>{monthYearLabel}</span>
                  <span className={`${isMonthYearOpen ? "rotate-180" : ""} duration-200`}>
                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 6.90039L10 11.5004L15 6.90039" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </button>
                {isMonthYearOpen && (
                  <div className="absolute top-[44px] left-0 z-20 w-auto max-h-[260px] overflow-auto rounded-md border border-[#DDDEE2] bg-white shadow-sm">
                    {monthYearOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`w-full text-left px-3 py-2 text-[15px]/[20px] hover:bg-[#F2F3FF] ${
                          option.value === monthYearValue ? "bg-[#EEF0FF]" : ""
                        }`}
                        onClick={() => {
                          const [year, month] = option.value.split("-").map(Number);
                          handleMonthYearChange(month - 1, year);
                          setIsMonthYearOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                style={{
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)"
                }}
              >
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4999 15L6.8999 10L11.4999 5" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div className="grid grid-cols-7 gap-0 flex-1">
                {weekDays.map((day) => {
                  const isActive = day.iso === activeDay;
                  return (
                    <button
                      key={day.iso}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      className="flex flex-col items-center gap-2"
                    >
                      <span
                        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-[20px] ${
                          isActive
                            ? "bg-[#8380FF] text-white"
                            : "bg-[#F3F4F6] text-[#101828]"
                        }`}
                        style={isActive ? {
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)"
                        } : {}}
                      >
                        {day.dayNumber}
                      </span>
                      <span className="text-[14px] font-sans text-[#4A5565]">
                        {day.dayName}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white flex justify-center items-center absolute top-1/2 transform -translate-y-1/2 z-10 right-0"
                onClick={() => changeWeek(1)}
                style={{
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)"
                }}
              >
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.8999 15L11.4999 10L6.8999 5" stroke="#0A0A0A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
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
    {(isLoadingData || GetSlotApoimentLoading || GetDoctorByTypeIdLoading) ? (
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
