import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";

import avatar67 from "../assets/images/self-booking/avatar67.png";
import SelfBookingStore from "../store/SelfBookingStore";
import { useOnClickOutside } from "./helpers/helpers";
import moment from "moment";
import WithoutAvatar from "../assets/images/svg/NoAvatar.svg";

// import useAuth from "../../Routes/useAuth";
const gender = ["Male", "Female", "Other"];

const ForSomeoneElsePage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ mode: "all" });
  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  );
  const [selectedGender, setSelectedGender] = useState(gender[0]);
  const [showListGender, setShowListGender] = useState(false);
  const [arrowHover, setArrowHover] = useState(false);
  const [activePatientGuardian, setActivePatientGuardian] = useState("Yes");

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setAppointmentData = SelfBookingStore(
    (state) => state.setAppointmentData
  );
  const appointmentData = SelfBookingStore((state) => state.appointmentData);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const setSomeOneElsePage = SelfBookingStore(
    (state) => state.setSomeOneElsePage
  );
const auth = {
    clinicId: 1,
    companyId: "4b731791-d6f4-4f46-7363-08db9ce8963d",
  }

  const onSubmit = (data) => {
    setAppointmentData({ ...data, activePatientGuardian });
    setAppPage("for guest page");
  };
  useEffect(() => {
    if (Object.keys(appointmentData).length === 0) {
      setValue("gender", selectedGender);
      setActivePatientGuardian("Yes");
    } else {
      setValue("firstName", appointmentData.firstName);
      setValue("dateOfBirth", appointmentData.dateOfBirth);
      setValue("lastName", appointmentData.lastName);
      setSelectedGender(appointmentData.gender);
      setValue("gender", selectedGender);
      setActivePatientGuardian(appointmentData.activePatientGuardian);
    }
  }, []);
  const genderList = gender.map((item, i) => {
    return (
      <div
        className={`h-9 flex items-center pl-[25px] hover:bg-[#F3F3FF] hover:rounded-[10px] hover:text-[#6674F3]`}
        key={i}
        onClick={(e) => {
          setShowListGender(false);
          setSelectedGender(item);
          e.stopPropagation();
          setValue("gender", item, { shouldValidate: true });
        }}
      >
        {item}
      </div>
    );
  });

  let _height = window.innerHeight;
  let _width = window.innerWidth;

  const refGenderList = useRef(null);

  useOnClickOutside(refGenderList, () => {
    setShowListGender(false);
  });

  const onSetActiveGuardianNo = () => {
    setActivePatientGuardian("No");
  };
  const onSetActiveGuardianYes = () => {
    setActivePatientGuardian("Yes");
  };

  return (
    <div
      className={`forSomeoneElseWrapper pb-3 relative mx-auto`}
      style={{
        width: widthBlock,
      }}
    >
      <div
        className={`flex justify-between`}
        style={{
          height:
            _height >= 1080
              ? _width < 1280
                ? 985
                : 955
              : _width <= 1280
              ? _height - 95
              : _height <= 1000
              ? _height - 95
              : _height - 125,
          minHeight: 670,
        }}
      >
        <div
          className={`xl:w-[663px] lg:w-[580px] lg:px-[30px] xl:px-[60px] pt-[76px] bg-white shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)] font-inter`}
        >
          <h1
            className={`text-[24px]/[29px] text-[#7C67FF] font font-medium tracking-[1.08px] mb-[51px]`}
          >
            Who are you scheduling for?
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className={`pb-[10px]`}>
            <div className={`flex flex-wrap justify-between `}>
              <InputBlock
                name={"firstName"}
                id={"firstName"}
                label={"Patient First Name"}
                type={"text"}
                register={register}
                errors={errors}
                trigger={trigger}
              />
              <InputBlock
                name={"lastName"}
                id={"lastName"}
                label={"Patient Last Name"}
                type={"text"}
                register={register}
                errors={errors}
                trigger={trigger}
              />
              <InputBlock
                name={"dateOfBirth"}
                id={"dateOfBirth"}
                label={"Patient Date of Birth"}
                type={"date"}
                register={register}
                errors={errors}
                trigger={trigger}
              />
              <div className={`mb-[25px] flex flex-col`}>
                <span
                  className={`text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px]`}
                >
                  {"Patient Gender"}
                </span>

                {/* Gender select */}
                <div
                  className={`lg:w-[250px] xl:w-[265px] h-9 border-[2px] border-[#E8E8E9] rounded-[10px] cursor-pointer relative flex items-center pl-[25px] text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px] bg-white`}
                  onMouseEnter={() => {
                    setArrowHover(true);
                  }}
                  onMouseLeave={() => {
                    setArrowHover(false);
                  }}
                  onClick={() => {
                    setShowListGender(!showListGender);
                    setValue("gender", selectedGender, {
                      shouldValidate: true,
                    });
                  }}
                  ref={refGenderList}
                  id="gender"
                  {...register("gender", { required: true })}
                >
                  {selectedGender}
                  {errors?.gender?.type === "required" && (
                    <p
                      className={` absolute top-[36px] left-0 text-red-500 text-[12px]/[14px]`}
                    >
                      Select gender!
                    </p>
                  )}
                  <div
                    className={`absolute left-0 top-[36px] bg-white w-full duration-500 ${
                      showListGender
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    } border-[2px] border-[#E8E8E9] rounded-[10px]`}
                  >
                    {genderList}
                  </div>
                  <span
                    className={`${
                      arrowHover
                        ? "bg-[url('./assets/images/self-booking/listArrowHover.svg')]"
                        : "bg-[url('./assets/images/self-booking/listArrow.svg')]"
                    } absolute w-[18px] h-[10px] right-[25px] ${
                      showListGender ? "rotate-180" : "rotate-0"
                    } duration-500`}
                  ></span>
                </div>
              </div>
            </div>
            <div>
              <div
                className={`text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px] mb-[15px]`}
              >
                Are you the parent or legal guardian of the patient?
              </div>
              <div
                className={`flex text-[16px]/[19px] text-[#5E5E5E] font-inter tracking-[0.72px] mb-[30px]`}
              >
                <div className={`flex items-center mr-[38px]`}>
                  <input
                    className={`mr-[10px]`}
                    type="radio"
                    name="yesno"
                    id="yes"
                    checked={activePatientGuardian === "Yes"}
                    onClick={onSetActiveGuardianYes}
                    onChange={() => {}}
                  />
                  <label className={``} htmlFor="yes">
                    Yes
                  </label>
                </div>
                <div className={`flex items-center`}>
                  <input
                    className={`mr-[10px]`}
                    type="radio"
                    name="yesno"
                    id="no"
                    checked={activePatientGuardian === "No"}
                    onClick={onSetActiveGuardianNo}
                    onChange={() => {}}
                  />
                  <label className={``} htmlFor="no">
                    No
                  </label>
                </div>
              </div>
            </div>
            <input
              type="submit"
              value="Next"
              className={`w-full h-[45px] rounded-[10px] bg-[#7C67FF] hover:bg-[#7059F6] text-[16px]/[22px] text-white font-nunito font-semibold tracking-[0.72px] flex items-center justify-center cursor-pointer duration-150`}
            />
          </form>
          <div
            className={`w-full h-[45px] rounded-[10px] bg-white text-[16px]/[22px] text-[#7C67FF] font-nunito font-semibold tracking-[0.72px] flex items-center justify-center cursor-pointer hover:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.11)] duration-150`}
            onClick={() => {
              setAppPage("for who");
              setSomeOneElsePage(false);
            }}
          >
            Back
          </div>
        </div>
        <div
          className={` flex flex-col justify-between h-full`}
          style={{
            width: _width < 1280 ? widthBlock - 595 : widthBlock - 676,
          }}
        >
          <div
            className={`flex bg-white shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]  ${
              _width <= 1400 || _height < 900
                ? "flex-col h-full"
                : "h-[49%] mb-3"
            }`}
          >
            <div
              className={` w-full pl-10 flex flex-col justify-around ${
                _width <= 1400 || _height < 900 ? "h-1/2" : ""
              } ${_height <= 800 ? "min-h-[350px]" : ""}`}
            >
              <div className={`text-[16px]/[22px]`}>
                <div
                  className={`text-[#D9D6EA] font-nunito font-bold tracking-[0.72px] mb-[3px]`}
                >
                  APPOINTMENT
                </div>
                <div
                  className={`text-[#3F4455] font-hebrew tracking-[0.72px] mb-[3px]`}
                >
                  {informationWithSorage?.apoimentTypeId?.label}
                </div>
                <div className={`text-[#3F4455] font-hebrew tracking-[0.72px]`}>
                  {moment(
                    informationWithSorage.doctor.eventStartDateTime,
                    "DD.MM.YYYY HH:mm:ss"
                  ).format("ddd MMM DD YYYY [at] h:mm a")}
                </div>
              </div>
              <div className={``}>
                <div
                  className={`text-[16px]/[22px] text-[#D9D6EA] font-nunito font-bold tracking-[0.72px] mb-2`}
                >
                  ADDRESS
                </div>
                <div>
                  <span
                    className={`text-[18px]/[25px] text-[#3F4455] font-nunito font-semibold tracking-[0.81px] mb-1 inline-block`}
                  >
                    Warsaw Dental Center
                  </span>
                  <br />
                  <span
                    className={`text-[16px]/[26px] text-[#3F4455] font-hebrew tracking-[0.72px]`}
                  >
                    Leończak Kupryś Sp.k. <br />
                    ul. Topiel 11, 00-342 Warszawa
                    <br />
                    +48225421804
                  </span>
                </div>
              </div>
              <div className={`flex items-center`}>
                <div className={`mr-[17px]`}>
                  <img
                    className={`rounded-[100px]`}
                    src={informationWithSorage.doctor.avarar || WithoutAvatar}
                    alt="avatar"
                  />
                </div>
                <div>
                  <div
                    className={`text-[20px]/[27px] text-[#3F4455] font-nunito font-semibold tracking-[0.9px]`}
                  >
                    {informationWithSorage.doctor.name}
                  </div>
                  <div
                    className={`text-[16px]/[22px] text-[#D9D6EA] font-nunito font-bold tracking-[0.72px]`}
                  >
                    {informationWithSorage.doctor.speciality}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`w-full p-5 ${
                _width <= 1400 || _height < 900 ? "h-1/2" : ""
              }`}
            >
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=21.02241396903992%2C52.23806317354728%2C21.02595448493958%2C52.23953814682495&amp;layer=mapnik&marker=52.23880,21.02452"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={``}
              ></iframe>
            </div>
          </div>

          <div
            className={`${
              _width <= 1400 || _height < 900
                ? "absolute -bottom-[235px] left-0 w-full pb-0 h-[235px] items-center"
                : `flex-col justify-center h-[50%]`
            } flex bg-white pl-[48px] shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]`}
          >
            <div className={`${_width > 1400 ? "w-full" : "w-[75%]"}`}>
              <div
                className={`text-[16px]/[22px] text-[#7C67FF] font-nunito font-bold tracking-[0.72px] uppercase mb-[17px]`}
              >
                Information
              </div>
              <div
                className={`${
                  _width <= 1400 || _height < 900
                    ? "w-[70%] mb-[30px]"
                    : "w-[60%] mb-[56px]"
                } flex justify-between`}
              >
                <InfoBlock
                  title={"Patient Name"}
                  info={`${watch("firstName") + " " + watch("lastName")}`}
                />
                <InfoBlock
                  title={"Date of birth"}
                  info={watch("dateOfBirth")}
                />
                <InfoBlock title={"Sex"} info={selectedGender} />
              </div>
              <div
                className={`flex ${
                  _width <= 1400 || _height < 900
                    ? "w-[71%] mb-[30px]"
                    : "w-[61%] mb-[70px]"
                } justify-between`}
              >
                <InfoBlock title={"Guardian"} info={""} />
                <InfoBlock title={"Date of birth"} info={""} />
                <InfoBlock title={"Sex"} info={""} />
              </div>
            </div>
            <div
              className={`${_width <= 1400 || _height < 900 ? "w-[20%]" : ""}`}
            >
              <div
                className={`text-[16px]/[22px] text-[#7C67FF] font-nunito font-bold tracking-[0.72px] uppercase mb-[16px]`}
              >
                contacts
              </div>
              <div
                className={`${
                  _width <= 1400 || _height < 900
                    ? "w-full flex-col h-[70%]"
                    : "w-[70%] flex-row"
                } flex justify-between`}
              >
                <InfoBlock title={"Phone"} info={""} />
                <InfoBlock title={"Email"} info={""} />
                <InfoBlock title={"Address"} info={""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBlock = ({ name, id, label, type, register, errors, trigger }) => {
  return (
    <div className={`flex flex-col mb-[25px] relative`}>
      <label
        htmlFor={id}
        className={`text-[15px]/[18px] text-[#5E5E5E] font-inter font-normal tracking-[0.675px]`}
      >
        {label}
      </label>
      <input
        className={`rounded-[10px] bg-white border-[2px] border-[#E8E8E9] lg:w-[250px] xl:w-[265px] h-9 pl-5`}
        name={name}
        id={id}
        type={type}
        {...register(id, {
          required: true,
        })}
      />
      {errors
        ? Object.keys(errors).includes(id) && (
            <p
              className={` absolute top-[47px] left-[10px] bg-white px-3 text-red-500 text-[12px]/[14px]`}
            >
              {id === "dateOfBirth" ? "Select date!" : "Field is required"}
            </p>
          )
        : null}
    </div>
  );
};

const InfoBlock = ({ title, info }) => {
  let infoClassName =
    "text-[15px]/[20px] text-[#5E5E5E] font-hebrew tracking-[0.675px]";

  if (info === "") {
    infoClassName = `w-[50px] my-[11px] border-[2px] border-[#DCDCDC]`;
  }

  return (
    <div>
      <div
        className={`text-[16px]/[22px] text-[#D9D6EA] font-nunito font-bold uppercase tracking-[0.72px] mb-[5px]`}
      >
        {title}
      </div>
      <div className={infoClassName}>{info}</div>
    </div>
  );
};

export default ForSomeoneElsePage;
