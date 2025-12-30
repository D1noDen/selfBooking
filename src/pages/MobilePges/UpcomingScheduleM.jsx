import { useState, useRef, useEffect ,forwardRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useOnClickOutside } from "../helpers/helpers";
import {
  get_Doctor_By_Type_Id,
  get_Apoiment_Types_Self_Booking,
  get_Slot_Apoiment,
} from "../request/requestSelfBooking";
import dateFormat from "dateformat";
import SelfBookingStore from "../../store/SelfBookingStore";
import moment from "moment";
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
import DatePicker from "react-datepicker";
const CalendarButton = forwardRef(({ onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="text-[12px] text-[#7D99FB]"
  >
    📅 Calendar
  </button>
));
const UpcomingScheduleM = ({ setSesionStorage }) => {
const {auth} = useAuth();
  const languages = [
    { label: "English", id: 0 },
    { label: "Polish", id: 1 },
    { label: "Test", id: 2 },
  ];
  const [doctors, setDoctors] = useState(null);
  const [events, setEvents] = useState(null);
  const [types, setTypes] = useState(null);
  const [doctorsWithEvents, setDoctorsWithEvents] = useState([]);
  const [startDate, setStartDay] = useState(new Date());
  const setAppPage = SelfBookingStore((state) => state.setAppPage);

  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  );
  const [selectedAppointment, setSelectedAppointment] = useState(
    informationWithSorage.apoimentTypeId.id
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
        (item) => item.id === informationWithSorage.apoimentTypeId.id
      );
    }
  }, [GetApoimentTypesSelfBookingData]);

  useEffect(() => {
    if (informationWithSorage) {
      const start = moment(startDate).format("YYYY-MM-DD");
      const endDate = moment(startDate).format("YYYY-MM-DD");
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
                title: time.slice(0, -3),
                date: dateFormat(Date.parse(date), "yyyy-dd-mm"),
                dateStart: apoiment.startTime,
                dateEnd: apoiment.endTime,
              };
            })
          ),
      }));
      console.log(newArrayDoctors , 'newArrayDoctors');
      setDoctorsWithEvents(newArrayDoctors);
    }
  }, [doctors, events]);

  return (
    <div>
      {/* {doctorsWithEvents.length === 0 ? <Spinner /> : null} */}
      <section className="mobileBG h-[120px] p-[16px]">
        <div className="flex h-fit ">
          <div className="relative flex gap-[12px] items-center h-fit w-[290px]">
             <img
              onClick={() => {
                setAppPage("visit type mobile");
              }}
              className=" top-[10px] left-[-18px] h-[16px] w-[16px]"
              src={chevronLeft}
            />
            <p className="text-[24px] text-white text-center leading-normal">
              Upcoming schedule
            </p>
           
          </div>
          
        </div>
        <div className="flex gap-[12px] mt-[16px]">
          <div className="px-[12px] h-[35px]  bg-[rgba(255,255,255,0.10)] flex items-center  gap-[8px]  rounded-[10px] w-[242px]">
           <img className="h-[20px] w-[14px]" src={geoPoint} />
              <p className="text-[14px] text-white font-hebrew ">Warsaw</p>
            </div>
          <LanguageSelector/>
        </div>
        
      </section>
      <section className="px-[16px] pt-[24px] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[8px]">
          <label className="text-[12px] text-[#6A7282]">Service</label>
          <Dropdown
            options={types}
            isIconNeeded={false}
            icon={""}
            iconWidth="0"
            activeOption={informationWithSorage.apoimentTypeId.lebel}
            dropdownWidth={"100%"}
            setSesionStorage={setSesionStorage}
            setSelectedAppointment={setSelectedAppointment}
          />
        </div>
        <DateSwiper selectedDate={startDate} setStartDay={setStartDay}  onDateChange={setStartDay} />
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
              informationWithSorage={informationWithSorage}
              setSesionStorage={setSesionStorage}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default UpcomingScheduleM;

const DateSwiper = ({ selectedDate, onDateChange, setStartDay }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment(selectedDate).startOf('day')
  );

  
  useEffect(() => {
   
    const selected = moment(selectedDate).startOf('day');
    const weekStart = moment(currentWeekStart).startOf('day');
    const weekEnd = moment(weekStart).add(4, 'days').endOf('day');
    if (!selected.isBetween(weekStart.clone().subtract(1, 'ms'), weekEnd.clone().add(1, 'ms'))) {
      setCurrentWeekStart(selected);
    }
  }, [selectedDate]);
  
  const generateWeekDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      days.push(moment(startDate).add(i, 'days'));
    }
    return days;
  };

  const weekDays = generateWeekDays(currentWeekStart);

  const canGoPrev = currentWeekStart.isAfter(moment().startOf('day'));

  const handlePrevWeek = () => {
    if (canGoPrev) {
      const newStart = moment(currentWeekStart).subtract(1, 'days');
      setCurrentWeekStart(newStart);
      onDateChange(newStart.toDate());
    }
  };

  const handleNextWeek = () => {
    const newStart = moment(currentWeekStart).add(1, 'days');
    setCurrentWeekStart(newStart);
    onDateChange(newStart.toDate());
  };

  const handleDateClick = (date) => {
    onDateChange(date.toDate());
  };

  const isToday = (date) => {
    return moment().isSame(date, 'day');
  };

  const isSelected = (date) => {
    return moment(selectedDate).isSame(date, 'day');
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex justify-between items-center">
        <p className="text-[12px] text-[#6A7282]">Select date:</p>
        <DatePicker
        startDate={selectedDate}
        onChange={(date) => setStartDay(date)}
        customInput={<CalendarButton />}
        />
        
      </div>
      
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
                    {day.format('dd')}
                  </span>
                  <span className={`text-[18px] font-semibold mt-[2px] ${selected ? 'text-white' : 'text-[#0D1B34]'}`}>
                    {day.format('D')}
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
  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  );
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

const DoctorBlock = ({item ,  name, img, speciality, key, doctorId, date , setSesionStorage , informationWithSorage }) => {
  console.log(item , 'item in doctor block');
  let dateArr = [];
  const options = { weekday: "long", day: "numeric", month: "long" };
  const [open , setOpen] = useState(false);

  const slotDate = dateFormat(Date.parse(dateArr[0]?.date), "yyyy-mm-dd");

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setChosenDoctor = SelfBookingStore((state) => state.setChosenDoctor);
  return (
    <div
      className="px-[12px] doctorBlock py-[16px] rounded-[12px] flex flex-col gap-[12px]"
      key={key}
    >
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
        <span className="text-[#6A7282] font-hebrew text-[12px]">slots {item.time?.length}</span>
         <img onClick={() => {
          setOpen(!open)
         }} className={`h-[18px] w-[18px] duration-300 ${open ? '-rotate-90' :'rotate-90'}`} src={chevronRight} />
      </div>
      </div>
      <div className="h-[1px] background-[#F5F5F5] w-full"></div>
      {
        open  && <div className="flex flex-col gap-[8px]">
        <div className="flex flex-col   ">
          <div className="flex gap-[8px] items-center">
            <p className="font-hebrew text-[14px] text-[#4A5565]">
              {new Date(slotDate).toLocaleDateString("en-US", options)}
            </p>
          </div>
          <div className="flex gap-[4px] flex-wrap items-center">
            {item.time.map((item, i) => {
              return (
                <button
                  key={i}
                  onClick={() => {
                     setAppPage("for who mobile");
                        setSesionStorage({
                          ...informationWithSorage,
                          doctor: {
                            avatar: item.avatar,
                            name: item.name,
                            speciality: item.speciality,
                            id: item.id,
                            eventStartDateTime:
                             item.dateStart,
                            eventEnd: item.dateEnd,
                          },
                        });
                  }}
                  className="w-[100px] text-[#364153] active:text-white active:bg-[#8380FF] h-[53px] rounded-[10px] flex items-center justify-center shadow-[0_2px_10px_0_rgba(0,0,0,0.06),_0_1px_2px_-1px_rgba(0,0,0,0.05)]"
                >
                 
                  <p className=" text-[16px] font-hebrew ">
                    {item.title.toUpperCase()}
                  </p>
                </button>
              );
            })}

           
          </div>
        </div>
      </div>
      }
    </div>
  );
};
