import { useState, createRef, useEffect, useRef, forwardRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useOnClickOutside } from "../helpers/helpers";
import SelfBookingStore from "../../store/SelfBookingStore";
import {
  get_Doctor_By_Type_Id,
  get_Apoiment_Types_Self_Booking,
  get_Slot_Apoiment,
} from "../request/requestSelfBooking";
import DatePicker from "react-datepicker";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
//import useAuth from "../../../Routes/useAuth";
import dateFormat from "dateformat";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

import Spinner from "../helpers/Spinner";

import WithoutAvatar from "../../assets/images/svg/NoAvatar.svg";
import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";
import calendar from "../../assets/images/self-booking/calendar.png";

const ChooseAConvinientTimeM = ({ setSesionStorage }) => {
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const chosenDoctor = SelfBookingStore((state) => state.chosenDoctor);
  const calendarApi = SelfBookingStore((state) => state.calendarApi);
  const setCalendarApi = SelfBookingStore((state) => state.setCalendarApi);
const auth = {
    clinicId: 1,
    companyId: "4b731791-d6f4-4f46-7363-08db9ce8963d",
  }

  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const curDate = new Date();
  const today = moment(curDate).format("YYYY-MM-DD");
  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  );
  const [startDate, setStartDate] = useState(new Date());
  const [doctors, setDoctors] = useState(null);
  const [events, setEvents] = useState(null);
  const [doctorWithEvents, setDoctorWithEvents] = useState([]);
  const [types, setTypes] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(
    informationWithSorage.apoimentTypeId.id
  );
  const [prevButton, setPrevButton] = useState("");
  const [doctorWithEvents1, setDoctorWithEvents1] = useState([]);
  const [doctorWithEvents2, setDoctorWithEvents2] = useState([]);
  const [doctorWithEvents3, setDoctorWithEvents3] = useState([]);

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
  const {
    data: GetApoimentTypesSelfBookingData,
    isLoading: GetApoimentTypesSelfBookingLoading,
    setText: GetApoimentTypesSelfBookingInformation,
  } = get_Apoiment_Types_Self_Booking();

  let calendarRef = useRef(null);

  function formatAMPM(date) {
    let hours = +date?.split(":")[0];
    let minutes = +date?.split(":")[1];
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes =
      minutes === 0 ? ":00" : minutes < 10 ? ":0" + minutes : ":" + minutes;
    let strTime = hours + minutes + " " + ampm;
    return strTime;
  }

  let calendarRefs = doctorWithEvents.map((item) => createRef(item.id));

  useEffect(() => {
    if (informationWithSorage) {
      const start = moment(startDate).format("YYYY-MM-DD");
      let newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + 2);
      const endDate = moment(newDate).format("YYYY-MM-DD");
      if (today === start) {
        setPrevButton("");
      } else {
        setPrevButton("myCustomButtonPrev");
      }
      GetSlotApoimentInformation({
        companyId: auth?.companyId,
        clinicId: auth?.clinicId,
        appointmentTypeId:
          selectedAppointment?.id || informationWithSorage.apoimentTypeId.id,
        startDate: start,
        endDate: endDate,
      });
      GetDoctorByTypeIdInformation({
        companyId: auth?.companyId,
        clinicId: auth?.clinicId,
        appointmentTypeId:
          selectedAppointment?.id || informationWithSorage.apoimentTypeId.id,
      });
    }
  }, [selectedAppointment, startDate]);

  useEffect(() => {
    GetApoimentTypesSelfBookingInformation({
      companyId: auth?.companyId,
      clinicId: auth?.clinicId,
    });
  }, []);

  useEffect(() => {
    if (GetApoimentTypesSelfBookingData) {
      setTypes(GetApoimentTypesSelfBookingData?.data?.result);
      const selected = GetApoimentTypesSelfBookingData?.data?.result.filter(
        (item) => item.id === informationWithSorage.apoimentTypeId.id
      );

      setSelectedAppointment({ id: selected[0].id, label: selected[0].label });
    }
  }, [GetApoimentTypesSelfBookingData]);

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
      const filteredDoctors = doctors.filter(
        (item) => item.userId === chosenDoctor.id
      );
      const singleDoctor = filteredDoctors.map((item) => ({
        id: item.userId,
        avatar: item.profilePicture,
        name: `${item.firstName + " " + item.lastName}`,
        speciality: item.specializationLabel,
        time: events
          .filter((filter) => filter.shift.userId == item.userId)
          .flatMap((event) =>
            event.appointmentSlot.map((apoiment) => {
              const date = apoiment.startTime.split(" ")[0];
              const momentDate = moment(date, "DD.MM.YYYY");
              const formattedDate = momentDate.format("YYYY-MM-DD");
              const time = apoiment.startTime.split(" ")[1];
              return {
                title: formatAMPM(time),
                date: formattedDate,
                dateStart: apoiment.startTime,
                dateEnd: apoiment.endTime,
              };
            })
          ),
      }));
      setDoctorWithEvents(singleDoctor);
    }
  }, [doctors, events]);

  useEffect(() => {
    if (doctorWithEvents.length !== 0) {
      if (calendarRefs.current !== null) {
        queueMicrotask(() => {
          calendarRefs.forEach((item) => {
            const options = {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            };
            const formattedDate = new Intl.DateTimeFormat(
              "en-US",
              options
            ).format(startDate);
          });
        });
      }
    }
  }, [calendarRefs[0], startDate]);

  const TimeAppointment = (eventInfo) => {
    return (
      <div className="w-[70px] px-[14px] z-[0] py-[12px] rounded-[35px] mb-[10px] bg-white text-[#080c2fa6] text-[11px] appointEvent">
        {eventInfo.event.title}
      </div>
    );
  };

  const dayFormat = (data) => {
    const dateObject = new Date(data.date);
    const dayOfWeek = dateObject.getDay();
    const dayNumber = dateObject.getDate();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeekName = daysOfWeek[dayOfWeek];
    return (
      <div
        className={`flex h-[65px] w-[50px] appointEvent rounded-[15px] flex-col font-nunito text-[16px] py-[10px] px-[7px] `}
      >
        <span className={`text-[#000]`}>{dayNumber}</span>
        <span className={`text-[#080c2fa6]`}>{dayOfWeekName}</span>
      </div>
    );
  };

  return (
    <div>
      {GetSlotApoimentLoading && <Spinner />}
      <section className="mobileBG h-[75px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-[290px]">
            <p className="text-[24px] text-white text-center leading-normal">
              Choose a convenient time
            </p>
            <img
              onClick={() => {
                setAppPage("upcoming schedule");
              }}
              className="absolute top-[10px] left-[-18px] h-[16px] w-[16px]"
              src={chevronLeft}
            />
          </div>
        </div>
      </section>
      <section className="px-[16px] flex flex-col">
        <div className="relative flex justify-center">
          <div className="flex flex-col items-center pt-[6px] gap-[12px] absolute top-[-22px]">
            <img
              className="h-[100px] w-[100px] rounded-[50%]"
              src={doctorWithEvents[0]?.avatar || WithoutAvatar}
            />
            <div className="flex flex-col items-center">
              <p className="text-[16px] text-[#101010]">
                {doctorWithEvents[0]?.name}
              </p>
              <p className="text-[13px] text-[#8696BB]">
                {doctorWithEvents[0]?.speciality}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-[156px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <p></p>
            <p className="h-[45px] text-[15px] overflow-hidden">
              Dr. Jenny Wilson Implantologist, is a Dentist in America, she has
              20 years of... Read More
            </p>
          </div>
          <Dropdown
            options={types}
            activeOption={informationWithSorage.apoimentTypeId.lebel}
            dropdownWidth={"100%"}
          />
          <div className="flex justify-between">
            <p>Next available slots:</p>
          </div>
          <div className="headerCalendar">
            <FullCalendar
              ref={calendarRef}
              firstDay={0}
              headerToolbar={{
                left: prevButton,
                right: "myCustomButtonNext",
                center: "title",
              }}
              titleFormat={{
                month: "long",
              }}
              initialView="dayGrid"
              dayCount={3}
              dayHeaderContent={(data) => dayFormat(data)}
              plugins={[dayGridPlugin]}
              customButtons={{
                myCustomButtonPrev: {
                  click: () => {
                    calendarRef.current.getApi().prev();
                    calendarRefs.forEach((item) => {
                      item.current.getApi().prev();
                    });
                    let num = startDate.getTime() - 3 * 24 * 60 * 60 * 1000;

                    calendarRefs.forEach((item) => {
                      itemm.current.getApi().prev();
                      item.current.getApi().gotoDate(num);
                    });

                    calendarRef.current.getApi().gotoDate(num);
                    setStartDate(new Date(num));
                  },
                },
                myCustomButtonNext: {
                  click: () => {
                    calendarRef.current.getApi().next();
                    calendarRefs.forEach((item) => {
                      item.current.getApi().next();
                    });
                    let num = startDate.getTime() + 3 * 24 * 60 * 60 * 1000;
                    calendarRefs.forEach((item) => {
                      item.current.getApi().prev();
                      item.current.getApi().gotoDate(num);
                    });
                    calendarRef.current.getApi().gotoDate(num);
                    setStartDate(new Date(num));
                  },
                },
              }}
            />
          </div>
          <div className={``}>
            {doctorWithEvents?.map((item, i) => {
              return (
                <div className={``} key={i}>
                  <div className={`eachDoctorCalendar`}>
                    <FullCalendar
                      firstDay={0}
                      headerToolbar={false}
                      dayHeaders={false}
                      initialDate={startDate}
                      plugins={[dayGridPlugin]}
                      initialView="dayGrid"
                      dayCount={3}
                      events={item.time}
                      eventContent={TimeAppointment}
                      height={"auto"}
                      ref={calendarRefs[i]}
                      eventClick={(e) => {
                        setAppPage("for who mobile");
                        setSesionStorage({
                          ...informationWithSorage,
                          doctor: {
                            avatar: item.avatar,
                            name: item.name,
                            speciality: item.speciality,
                            id: item.id,
                            eventStartDateTime:
                              e.event._def.extendedProps.dateStart,
                            eventEnd: e.event._def.extendedProps.dateEnd,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChooseAConvinientTimeM;

const Dropdown = ({ options, activeOption, dropdownWidth }) => {
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

  return (
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
                  value={item}
                  className={`h-[49px] px-[10px] w-full  flex items-center cursor-pointer hover:bg-[#F3F3FF]`}
                  onClick={() => {
                    setRotate(!rotate);
                    setVisibleAppList(false);
                    setSelectedOption(item);
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
};

const DatePickerButton = forwardRef(({ onClick }, ref) => (
  <div
    className={`relative pt-[15px] pb-3 px-[25px] w-[176px] rounded-[10px] border-[1px] border-solid border-[#E8E8E9] hover:border-[#CACACA] flex items-center justify-start ml-[10px] ${
      calendarHover
        ? 'bg-[url("./assets/images/self-booking/calendarIconHover.svg")]'
        : 'bg-[url("./assets/images/self-booking/calendarIcon.svg")]'
    } bg-no-repeat bg-[85%] cursor-pointer duration-500`}
    onMouseEnter={() => setCalendarHover(true)}
    onMouseLeave={() => setCalendarHover(false)}
    onClick={onClick}
    ref={ref}
  >
    <span className={`mr-[15px]`}>Select Date</span>
  </div>
));
