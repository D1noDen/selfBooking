import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SelfBookingStore from "../store/SelfBookingStore";
import moment from "moment";
import avatar67 from "../assets/images/self-booking/avatar67.png";
import { GlobalHookWindowSummary } from "../helpers/GlobalHookWindowSummary";
import { useOnClickOutside } from "./helpers/helpers";
import WithoutAvatar from "../assets/images/svg/NoAvatar.svg";
import { create_Patient, create_Booking } from "./request/requestSelfBooking";
import { dateHelper } from "./helpers/dateHelper"
import useAuth from "../store/useAuth";
// import useAuth from "../../Routes/useAuth";
const ForUserPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({ mode: "all" });
  const {auth} = useAuth();
  const gender = ["Male", "Female", "Other"];
  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  );
  const {
    mutate: CreatePatientMutate,
    isLoading: CreatePatientLoading,
    data: CreatePatientData,
  } = create_Patient();
  const {
    mutate: CreateBookingMuttate,
    isLoading: CreateBookingLoading,
    data: CreateBookingData,
  } = create_Booking();
  const [showList, setShowList] = useState(false);
  const [arrowHover, setArrowHover] = useState(false);
  const [selectedGender, setSelectedGender] = useState(gender[0]);
// const auth = {
//     clinicId: 1,
//     companyId: "4b731791-d6f4-4f46-7363-08db9ce8963d",
//     userId: "7",
//   }
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setUser = SelfBookingStore((state) => state.setUser);
  const user = SelfBookingStore((state) => state.user);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const setPaddingB = SelfBookingStore((state) => state.setPaddingB);
  const someOneElsePage = SelfBookingStore((state) => state.someOneElsePage);

  const onSubmit = (data) => {
    console.log("Submitting data:", data);
    console.log("Auth:", auth);
    CreatePatientMutate({
      data:{
        
      companyId: auth.companyId,
      clinicId: auth.clinicId,
      title: "",
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      cellPhone: data.cellPhone,
      businessPhone: "",
      nip: "",
      mailingStreet: "",
      mailingHouseNumber: "",
      mailingCityId: 0,
      mailingRegionId: 0,
      mailingZipCode: "",
      mailingCountry: "",
      isBlackListed: false,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      pesel: data.pesel,
      maidenName: "",
      nationality: "",
      allergies: [],
      phobias: [],
      notes: data.comments,
      patientTypeId: 0,
      primaryDoctorId: 0,
      lastVisitDate: "2023-11-10T17:29:20.219Z",
      billingStreet: "",
      billingHouseNumber: "",
      billingCityId: 0,
      billingRegionId: 0,
      billingZipCode: "",
      billingCountry: "",
      isVip: false,
      isDifficult: false,
      communicationLanguageId: 0,
      patientDiscountId: 0,
      referralReversalId: 0,
      patientGuardianId: 0,
      isChild: false,
      patientChildId: 0,
      patientParentId: 0,
    
      },
      token: auth
    });
  };
  useEffect(() => {
    if (CreatePatientData) {
      const newStartDate = dateHelper(
        informationWithSorage.doctor?.eventStartDateTime
      );
      const newEndDate = dateHelper(informationWithSorage?.doctor.eventEnd);
      console.log("CreatePatientData received:", CreatePatientData);
      CreateBookingMuttate({
       data:{
         eventStartDateTime: newStartDate,
        eventEndDateTime: newEndDate,
        appointmentTypeId: informationWithSorage?.apoimentTypeId.id,
        userId: informationWithSorage?.doctor.id,
        patientContactPersonId: null,
        patientId: CreatePatientData.data.patientId,
        appointmentDescription: getValues("comment"),
       },
       token:auth
       
       
      });
    }
  }, [CreatePatientData]);

  useEffect(() => {
    setValue("gender", selectedGender);
  }, []);

  useEffect(() => {
    if (CreateBookingData) {
      console.log("CreateBookingData received:", CreateBookingData);
      setHeaderPage(4);
      setAppPage("complete");
    }
  }, [CreateBookingData]);

  const onError = (errors) => {
    console.log("Validation errors:", errors);
  };

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  const rightBlock = useRef(null);

  useEffect(() => {
    if (_width < 1400) {
      setPaddingB(true);
    }
  }, [_width]);

  const genderSelect = useRef(null);

  useOnClickOutside(genderSelect, () => {
    setShowList(false);
  });

  return (
    <div
      className={`forUserPageWrapper flex pb-[21px] mx-auto relative`}
      style={{
        width: widthBlock,
        height:
          _height >= 1080
            ? _width < 1280
              ? 1005
              : 975
            : _width < 1280
            ? _height - 70
            : _height <= 1000
            ? _height - 70
            : _height - 110,
        minHeight: 688,
      }}
    >
      <div
        className={`bg-white lg:px-5 xl:px-[60px] lg:min-w-[550px] xl:min-w-[663px] lg:max-w-[550px] xl:max-w-[663px] mr-3 shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)] ${
          _height < 930 ? "pt-4" : "pt-[47px]"
        }  flex flex-col`}
      >
        <div
          className={`text-[24px]/[29px] text-[#7C67FF] font-inter font-medium tracking-[1.08px] ${
            _height < 930 ? "mb-4" : "mb-10"
          } `}
        >
          Please enter your exact information
        </div>
        <form
          className={`flex flex-wrap justify-between mb-[10px]`}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <InputBlock
            label={"PESEL"}
            placeholder={"Input PESEL"}
            width={"w-full"}
            id={"pesel"}
            register={register}
            errors={errors}
          />
          <InputBlock
            label={"First Name"}
            placeholder={"First name"}
            width={"lg:w-[250px] xl:w-[265px]"}
            id={"firstName"}
            register={register}
            errors={errors}
          />
          <InputBlock
            label={"Last Name"}
            placeholder={"Last name"}
            width={"lg:w-[250px] xl:w-[265px]"}
            id={"lastName"}
            register={register}
            errors={errors}
          />
          <InputBlock
            label={"Date of Birth"}
            placeholder={"MM/DD/YY"}
            type={"date"}
            width={"lg:w-[250px] xl:w-[265px]"}
            id={"dateOfBirth"}
            register={register}
            errors={errors}
          />
          <div
            className={`flex flex-col lg:w-[250px] xl:w-[265px] mb-[15px] relative z-50`}
          >
            <div
              className={`text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px]`}
            >
              Gender
            </div>
            <div
              className={`border-[2px] border-[#E8E8E9] rounded-[10px] ${
                _height < 930 ? "h-8" : "h-9"
              } relative cursor-pointer flex items-center pl-5 text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px]`}
              onClick={() => {
                setShowList(!showList);
                setValue("gender", selectedGender, { shouldValidate: true });
              }}
              onMouseEnter={() => setArrowHover(true)}
              onMouseLeave={() => setArrowHover(false)}
              ref={genderSelect}
              {...register("gender", {
                required: true,
              })}
            >
              {selectedGender}
              {errors?.gender?.type === "required" && (
                <p
                  className={`absolute top-[25px] bg-white px-3 left-[5px] text-red-500 text-[12px]/[14px]`}
                >
                  Select gender!
                </p>
              )}
              <div
                className={`absolute top-[36px] left-0 w-full ${
                  showList ? "opacity-100 visible" : "opacity-0 invisible"
                } duration-500 border-[2px] border-[#E8E8E9] rounded-[10px]`}
              >
                {gender.map((item, i) => (
                  <div
                    key={i}
                    className={`bg-white h-9 flex items-center pl-5 text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px] hover:bg-[#F3F3FF] hover:text-[#6674F3] cursor-pointer rounded-[10px]`}
                    onClick={() => {
                      setShowList(!showList);
                      setSelectedGender(item);
                      setValue("gender", item, { shouldValidate: true });
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <span
                className={`w-[18px] h-[10px] absolute top-[calc(50%-5px)] right-5 ${
                  showList ? " rotate-180" : " rotate-0"
                } duration-500 ${
                  arrowHover
                    ? 'bg-[url("./assets/images/self-booking/listArrowHover.svg")]'
                    : 'bg-[url("./assets/images/self-booking/listArrow.svg")]'
                }`}
              ></span>
            </div>
          </div>
          <InputBlock
            label={"Email"}
            placeholder={"example@gmail.com"}
            width={"lg:w-[250px] xl:w-[265px]"}
            id={"email"}
            register={register}
            errors={errors}
            type={"email"}
          />
          <InputBlock
            label={"Phone number"}
            placeholder={"(000) 000 0000"}
            width={"lg:w-[250px] xl:w-[265px]"}
            id={"cellPhone"}
            register={register}
            errors={errors}
            type={"number"}
          />
          <InputBlock
            label={"City"}
            width={"lg:w-[250px] xl:w-[265px]"}
            id={"city"}
            register={register}
            errors={errors}
          />
          <InputBlock
            label={"Address"}
            width={"lg:w-[250px] xl:w-[265px]"}
            id={"address"}
            register={register}
            errors={errors}
          />
          <div
            className={`flex flex-col w-full ${
              _height < 930 ? "mb-5" : "mb-[30px]"
            } `}
          >
            <label
              htmlFor="comments"
              className={`text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px] mb-[2px]`}
            >
              Comments or special requests
            </label>
            <textarea
              id="comments"
              className={`border-[2px] border-[#E8E8E9] bg-white rounded-[10px] ${
                _height < 930 ? "h-[60px]" : "h-[71px]"
              } outline-none pl-4 py-2`}
              {...register("comment")}
            ></textarea>
          </div>
          <input
            type="submit"
            value={"Book Appointment"}
            className={`bg-[#7C67FF] hover:bg-[#7059F6] w-full ${
              _height < 930 ? "h-[40px]" : "h-[45px]"
            } rounded-[10px] text-[16px]/[22px] text-white font-nunito font-semibold tracking-[0.72px] cursor-pointer duration-150`}
          />
        </form>
        <div
          className={`w-full ${
            _height < 930 ? "h-[40px]" : "h-[45px]"
          } rounded-[10px] text-[16px]/[22px] text-[#7C67FF] font-nunito font-semibold tracking-[0.72px] cursor-pointer flex justify-center items-center hover:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.11)] duration-150`}
          onClick={() => {
            someOneElsePage
              ? setAppPage("for someone else")
              : setAppPage("for who");
            setUser(!user);
          }}
        >
          Back
        </div>
      </div>
      <div
        className={`flex flex-col h-full`}
        style={{
          width: widthBlock < 1280 ? widthBlock - 559 : widthBlock - 673,
        }}
      >
        <div
          className={` flex bg-white shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]  ${
            _width <= 1400 || _height < 900
              ? "flex-col h-full"
              : "flex-row h-1/2"
          }`}
          ref={rightBlock}
        >
          <div
            className={` flex flex-col-reverse justify-around pl-[42px] ${
              _width <= 1400 || _height < 900
                ? "h-1/2 min-h-[350px] w-full"
                : "w-1/2"
            }`}
          >
            <div className={`text-[16px]/[22px] `}>
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
            <div className={` `}>
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
            <div className={`flex items-center `}>
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
            className={` p-5 ${
              _width <= 1400 || _height < 900 ? "h-1/2 w-full" : "w-1/2"
            }`}
          >
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=21.02241396903992%2C52.23806317354728%2C21.02595448493958%2C52.23953814682495&amp;layer=mapnik&marker=52.23880,21.02452"
              width="380px"
              height="402"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`w-full h-full`}
            ></iframe>
          </div>
        </div>
        <div
          className={`bg-white shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)] flex justify-around  ${
            _width <= 1400 || _height < 900
              ? " absolute left-0 -bottom-[232px] w-full flex-row h-[240px] pt-10"
              : "mt-[12px] flex-col h-1/2 pl-[48px]"
          }`}
        >
          <div className={``}>
            <Title text={"information"} style={""} />
            <div>
              <div
                className={` flex  ${_height <= 1030 ? "mb-7" : "mb-[56px]"}`}
              >
                <InfoBlock
                  title={"Patient Name"}
                  value={`${watch("firstName") + " " + watch("lastName")}`}
                  first={true}
                />
                <InfoBlock
                  title={"Date of birth"}
                  value={watch("dateOfBirth")}
                  first={_width < 1400 ? true : false}
                />
                <InfoBlock
                  title={"Gender"}
                  value={selectedGender}
                  first={_width < 1400 ? true : false}
                />
                <InfoBlock
                  title={"Zip code"}
                  value={"99950"}
                  first={_width < 1400 ? true : false}
                />
              </div>
            </div>
          </div>

          <div className={` `}>
            <Title text={"contacts"} style={"text-center"} />
            <div
              className={`flex w-full gap-[10px] ${
                _width <= 1280
                  ? "flex-col justify-between h-[120px]"
                  : "flex-row"
              }`}
            >
              <InfoBlock
                title={"Phone"}
                value={watch("cellPhone")}
                first={true}
              />
              <InfoBlock
                title={"email"}
                value={watch("email")}
                first={_width < 1400 ? true : false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Title = ({ text, style }) => {
  return (
    <div
      className={` text-[16px]/[22px] ${style} text-[#7C67FF] font-nunito font-bold tracking-[0.72px] uppercase mb-[17px]`}
    >
      {text}
    </div>
  );
};

const InfoBlock = ({ title, value, first }) => {
  const width = GlobalHookWindowSummary();

  return (
    <div className={`${first ? "" : " items-center"} min-w-[160px] flex flex-col`}>
      <div
        className={`text-[16px]/[22px] text-[#D2D2D2] text-center font-nunito font-bold tracking-[0.72px] uppercase mb-[5px]`}
      >
        {title}
      </div>
      <div
        className={`text-[15px]/[20px] flex justify-center text-[#3F4455] font-hebrew tracking-[0.675px]`}
      >
        {value !== "" || value ? (
          value
        ) : (
          <div className="border border-solid border-[#DCDCDC] w-[50px] "></div>
        )}
      </div>
    </div>
  );
};

export const InputBlock = ({
  label,
  placeholder,
  width,
  value,
  id,
  type,
  register,
  errors,
}) => {
  let _height = window.innerHeight;

  const emailRegExp =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  let idd = id !== "email" && id !== "cellPhone" ? id : "";

  return (
    <div
      className={`inputBlock flex flex-col ${width} ${
        _height < 930 ? "mb-[13px]" : "mb-[15px]"
      } relative`}
    >
      <label
        htmlFor={id}
        className={`text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px] mb-[2px]`}
      >
        {label}
      </label>
      <input
        type={type || "text"}
        id={id}
        placeholder={placeholder}
        className={` border-[2px] border-[#E8E8E9] bg-white ${
          _height < 930 ? "h-8" : "h-9"
        } rounded-[10px] pl-[15px] text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px]`}
        value={value}
        {...register(id, {
          required: true,
          pattern: id === "email" ? emailRegExp : null,
          minLength: id === "cellPhone" ? 9 : null,
          maxLength: id === "cellPhone" ? 9 : null,
        })}
      />
      {errors
        ? Object.keys(errors).includes(idd) && (
            <p
              className={` absolute top-[47px] bg-white px-3 left-[5px] text-red-500 text-[12px]/[14px]`}
            >
              {id === "dateOfBirth" ? "Select date!" : "Field is required!"}
            </p>
          )
        : null}
      {id === "email"
        ? errors?.email?.type === "pattern" && (
            <p
              className={`absolute top-[47px] bg-white px-3 left-[5px] text-red-500 text-[12px]/[14px]`}
            >
              Wrong email format!
            </p>
          )
        : null}
      {id === "email"
        ? errors?.email?.type === "required" && (
            <p
              className={`absolute top-[47px] bg-white px-3 left-[5px] text-red-500 text-[12px]/[14px]`}
            >
              Field is required!
            </p>
          )
        : null}
      {id === "cellPhone"
        ? errors?.cellPhone?.type === "required" && (
            <p
              className={`absolute top-[47px] bg-white px-3 left-[5px] text-red-500 text-[12px]/[14px]`}
            >
              Field is required!
            </p>
          )
        : null}
      {id === "cellPhone"
        ? (errors?.cellPhone?.type === "minLength" ||
            errors?.cellPhone?.type === "maxLength") && (
            <p
              className={` absolute top-[47px] bg-white px-3 left-[5px] text-red-500 text-[12px]/[14px]`}
            >
              Must be 9 digit!
            </p>
          )
        : null}
    </div>
  );
};

export default ForUserPage;
