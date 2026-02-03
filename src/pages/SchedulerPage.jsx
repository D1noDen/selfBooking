import { useState, useRef, createRef, forwardRef, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Scrollbar } from "react-scrollbars-custom";
import avatar from "../assets/images/self-booking/avatar.png";
import SelfBookingStore from "../store/SelfBookingStore";
import DatePicker from "react-datepicker";
import { useOnClickOutside } from "./helpers/helpers";
import {
  get_Slot_Apoiment,
  get_Apoiment_Types_Self_Booking,
  get_Doctor_By_Type_Id,
} from "./request/requestSelfBooking";
//import useAuth from "../../Routes/useAuth";
import dateFormat from "dateformat";
import Spinner from "./helpers/Spinner";
import WithoutAvatar from "../assets/images/svg/NoAvatar.svg";
import moment from "moment";
import { DateComponent } from "@fullcalendar/core/internal";
import { HubConnectionState } from "@microsoft/signalr";
import { TRUE } from "sass";
import { createInstance } from "i18next";
import useAuth from "../store/useAuth";

import "react-datepicker/dist/react-datepicker.css"
const sity = ["Warsaw", "Lublin", "Alwernia"];
const SchedulerPage = ({ setSesionStorage }) => {
  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  );
  const [selectedAppointment, setSelectedAppointment] = useState(
    informationWithSorage.apoimentTypeId.id
  );
  const [selectedSity, setSelectedSity] = useState(sity[0]);
  const [types, setTypes] = useState(null);
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const [events, setEvents] = useState(null);
  const [hover, setHover] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [doctors, setDoctors] = useState(null);
  const [doctorsWithEvents, setDoctorsWithEvents] = useState([]);
  const [calendarHover, setCalendarHover] = useState(false);
  const [cityHover, setCityHover] = useState(false);
  const [showSity, setShowSity] = useState(false);
  const [visibleAppList, setVisibleAppList] = useState(false);
  const [startDate, setStartDay] = useState(new Date());
  const [prevButton, setPrevButton] = useState("");
  const widthBlock = SelfBookingStore((state) => state.widthBlock);

  const curDate = new Date();
  const curWeekStart = moment(curDate).format("YYYY-MM-DD");
const {auth} = useAuth();

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
  let calendarRef = useRef(null);
  useEffect(() => {
    if (informationWithSorage) {
      const start = moment(startDate).format("YYYY-MM-DD");
      const endDate = moment(startDate)
  .add(6, 'days')
  .format('YYYY-MM-DD');

      if (curWeekStart === start) {
        setPrevButton("");
      } else {
        setPrevButton("myCustomButtonPrev");
      }
      GetSlotApoimentInformation({
        bookingToken:auth,
        appointmentTypeId:
          selectedAppointment?.id || informationWithSorage.apoimentTypeId.id,
        startDate: start,
        endDate: endDate,
      });
      GetDoctorByTypeIdInformation({
         bookingToken:auth,
        appointmentTypeId:
          selectedAppointment?.id || informationWithSorage.apoimentTypeId.id,
      });
    }
  }, [selectedAppointment, startDate]);

  const {
    data: GetApoimentTypesSelfBookingData,
    isLoading: GetApoimentTypesSelfBookingLoading,
    setText: GetApoimentTypesSelfBookingInformation,
  } = get_Apoiment_Types_Self_Booking();
  useEffect(() => {
    GetApoimentTypesSelfBookingInformation({
      bookingToken:auth,
    });
  }, [auth]);
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
  function formatAMPM(date) {
    let hours = +date?.split(":")[0];
    let minutes = +date?.split(":")[1];
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes =
      minutes === 0 ? "" : minutes < 10 ? ":0" + minutes : ":" + minutes;
    let strTime = hours + minutes + " " + ampm;
    return strTime;
  }

  useEffect(() => {
    if (doctors && events) {
      console.log( events, 'doctors , events');
   
     
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
    }
  }, [doctors, events]);

  const TimeAppointment = (eventInfo) => {
   
    return (
      <div
        className={`bg-white text-[14px]/[19px] text-[#6674F3] font-hebrew tracking-[0.63px] w-24 lg:h-[30px] xl:h-[35px] flex justify-center items-center border-[1px] border-solid border-[#E8E8E9] rounded-[5px] hover:bg-[#F2F3FF] cursor-pointer mb-[10px] active:border-[#8380FF] active:bg-[#F2F3FF]`}
      >
        {eventInfo.event.title}
      </div>
    );
  };

  let calendarRefs = doctorsWithEvents.map((item) => createRef(item.id));

  const dayFormat = (data) => {
    let dayTitle = data.text.split(" ");
    let dayNumber = data.text.split("/");
    return (
      <div
        className={`flex flex-col font-nunito text-[15px]/[20px] tracking-[0.675px] font-normal`}
      >
        <span className={`text-[#64697E]`}>{dayTitle[0]}</span>
        <span className={`text-[#C3C2D1]`}>{dayNumber[1]}</span>
      </div>
    );
  };

  const DatePickerButton = forwardRef(({ onClick ,value  }, ref) => (
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
      <span className={`mr-[15px]`}>{value}</span>
    </div>
  ));

  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const sitySelect = useRef(null);

  const appointmentList = useRef(null);

  let _height = window.innerHeight;
  let _width = window.innerWidth;

  useOnClickOutside(appointmentList, () => {
    if (visibleAppList) {
      setRotate(!rotate);
      setVisibleAppList(!visibleAppList);
    }
  });

  useOnClickOutside(sitySelect, () => {
    setShowSity(false);
  });

  useEffect(() => {
    if (doctorsWithEvents.length !== 0) {
      console.log(calendarRefs , 'calendarRefs');
      if (calendarRefs[0].current !== null) {
        queueMicrotask(() => {
          calendarRefs.forEach((item) => {
            item.current
              .getApi()
              .gotoDate(
                startDate.toLocaleDateString().split(".").reverse().join("-")
              );
          });
        });
      }
    }
  }, [calendarRefs[0]]);
  if (doctorsWithEvents.length === 0) {
    <Spinner />;
  }
  console.log(doctorsWithEvents);
  return (
    <>
      <div
        className={`pt-[30px] pr-[53px] lg:pl-4 xl:pl-[46px] pb-[30px] bg-white mx-auto shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]`}
        style={{
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
        <div className={`flex relative`}>
          <div className={`lg:w-[260px] xl:w-[30%] flex flex-col`}>
            <div
              className={`lg:text-[22px]/[28px] xl:text-[24px]/[33px] font-nunito font-semibold text-[#7C67FF] lg:tracking-[0.675px] xl:tracking-[1.08px] inline-block max-w-max mb-[38px]`}
            >
              Select an appointment
            </div>

            <div
              className={`text-[16px]/[22px] text-[#64697E] font-nunito tracking-[0.72px] lg:w-[230px] xl:w-[265px]`}
            >
              <Listbox
                as={"div"}
                value={selectedAppointment}
                onChange={(e) => {
                  setSelectedAppointment({ id: e.id, label: e.label });
                  setSesionStorage({
                    apoimentTypeId: {
                      id: e.id,
                      label: e.label,
                    },
                  });
                }}
                className={`relative`}
                ref={appointmentList}
                onFocus={() => console.log("focus")}
              >
                <Listbox.Button
                  className={`lg:w-[230px] xl:w-[265px] h-[49px] lg:px-[10px] xl:px-[25px] border-[1px] border-[#E8E8E9] rounded-[10px] text-left relative z-[10] hover:border-[#CACACA] hover: bg-no-repeat bg-[90%_20px] bg-white`}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  onClick={(e) => {
                    setRotate(!rotate);
                    setVisibleAppList(!visibleAppList);
                    // e.stopPropagation();
                  }}
                >
                  {selectedAppointment?.label}
                  <span
                    className={` absolute top-[calc(50%-5px)] lg:right-[10px] xl:right-[25px] w-[18px] h-[10px] ${
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
                    className={`absolute top-[39px] left-0 pt-3 z-[1] bg-white rounded-[10px] border-[1px] border-[#E8E8E9]`}
                  >
                    {types?.map((item, i) => {
                      return (
                        <Listbox.Option
                          key={i}
                          value={item}
                          className={`h-[49px] lg:px-[10px] xl:px-[25px] flex items-center cursor-pointer hover:bg-[#F3F3FF]`}
                          onClick={() => {
                            setRotate(!rotate);
                            setVisibleAppList(false);
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
          </div>
          <div className={`headerCalendar lg:w-[76%] xl:w-[70%]`}>
            <div
              className={`text-[16px]/[22px] text-[#64697E] font-nunito font-normal flex justify-end lg:mb-4 xl:mb-0`}
            >
              <span
                className={` relative w-[143px] pt-[15px] pb-3 px-[25px] rounded-[10px] border-[1px] border-[#E8E8E9] hover:border-[#CACACA] flex ${
                  cityHover
                    ? 'bg-[url("./assets/images/self-booking/geoPointHover.svg")]'
                    : 'bg-[url("./assets/images/self-booking/geoPoint.svg")]'
                } bg-[80%] bg-no-repeat duration-200 cursor-pointer`}
                onMouseEnter={() => setCityHover(true)}
                onMouseLeave={() => setCityHover(false)}
                onClick={() => setShowSity(!showSity)}
                ref={sitySelect}
              >
                <span
                  className={`mr-[14px]`}
                  onClick={(e) => {
                    setShowSity(!showSity);
                    e.stopPropagation();
                  }}
                >
                  {selectedSity}
                </span>
                <div
                  className={`absolute -bottom-[155px] left-0 bg-white w-full py-[10px] rounded-[10px] z-[2] border-[2px] border-[#E8E8E9] ${
                    showSity ? "opacity-100 visible" : "opacity-0 invisible"
                  } duration-200`}
                >
                  {sity.map((item, i) => {
                    return (
                      <div
                        key={i}
                        className={`w-[137px] h-[42px] bg-white flex justify-center items-center hover:bg-[#F3F3FF] duration-300`}
                        onClick={() => {
                          setSelectedSity(item);
                          setShowSity(!showSity);
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              </span>
             <div className="relative z-[20]">
              <DatePicker
              selected={startDate}
              dateFormat={'dd/MM/yyyy'}
                onChange={(date) => {
                  setStartDay(date);
                  calendarRef.current
                    .getApi()
                    .gotoDate(
                      date.toLocaleDateString().split(".").reverse().join("-")
                    );
                }}
              customInput={<DatePickerButton />}
              />
               {/* <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDay(date);
                  calendarRef.current
                    .getApi()
                    .gotoDate(
                      date.toLocaleDateString().split(".").reverse().join("-")
                    );
                }}
                customInput={<DatePickerButton />}
                calendarStartDay={0}
              /> */}
               
               
            
             </div>
            </div>
            <FullCalendar
              ref={calendarRef}
              firstDay={new Date().getDay() }
              headerToolbar={{
                left: prevButton,
                right: "myCustomButtonNext",
                center: "title",
              }}
              titleFormat={{
                month: "long",
              }}
              dayHeaderContent={(data) => dayFormat(data)}
              plugins={[dayGridPlugin]}
              initialView="dayGridWeek"
              customButtons={{
                myCustomButtonPrev: {
                  click: () => {
                    calendarRef.current.getApi().prev();
                    calendarRefs.forEach((item) => {
                      item.current.getApi().prev();
                    });
                    let num = startDate.getTime() - 604800000;
                    setStartDay(new Date(num));
                  },
                },
                myCustomButtonNext: {
                  click: () => {
                    calendarRef.current.getApi().next();
                    calendarRefs.forEach((item) => {
                      item.current.getApi().next();
                    });
                    let num = startDate.getTime() + 604800000;
                    setStartDay(new Date(num));
                  },
                },
              }}
            />
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
          <div className={`shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]`}>
            {doctorsWithEvents?.map((item, i) => {
              return (
                <div
                  className={`flex border-b-[2px] border-b-[#E8E8E9]`}
                  key={i}
                >
                  <div
                    className={`flex lg:flex-col xl:flex-row lg:justify-center xl:justify-normal lg:items-start xl:items-center lg:py-3 xl:py-10 lg:pl-5 xl:pl-10 lg:w-[260px] xl:w-[30%] border-r-[2px] border-r-[#E8E8E9] items-center`}
                  >
                    <div
                      className={` bg-white  w-[50px] h-[50px] mr-[25px] lg:mb-3 xl:mb-0`}
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
                    className={`eachDoctorCalendar lg:w-[77%] xl:w-[70%]  bg-[#FBFCFF]`}
                  >
                    <FullCalendar
                      firstDay={new Date().getDay() }
                      headerToolbar={false}
                      dayHeaders={false}
                      plugins={[dayGridPlugin]}
                      initialView="dayGridWeek"
                      events={item.time}
                      eventContent={TimeAppointment}
                      height={"auto"}
                      ref={calendarRefs[i]}
                      initialDate={startDate}
                      eventClick={(e) => {
                      
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
        </Scrollbar>
      </div>
    </>
  );
};

export default SchedulerPage;
