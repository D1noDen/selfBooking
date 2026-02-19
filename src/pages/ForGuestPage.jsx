import SelfBookingStore from "../store/SelfBookingStore";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import avatar67 from "../assets/images/self-booking/avatar67.png";
import {
  create_Booking,
  create_Patient,
  create_Contact_Person,
} from "./request/requestSelfBooking";
import WithoutAvatar from "../assets/images/svg/NoAvatar.svg";
import useAuth from "../store/useAuth";
// import useAuth from "../../Routes/useAuth";
import { dateHelper } from "./helpers/dateHelper";
import PhoneNumberField from "./components/PhoneNumberField";
import {
  DEFAULT_COUNTRY_CODE,
  joinPhoneByCountryCode,
  splitPhoneByCountryCode,
} from "./helpers/phoneCountry";
import { getBookingInformation } from "../helpers/bookingStorage";

const ForGuestPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    setValue,
    watch,
  } = useForm({ mode: "all" });
  const informationWithSorage = getBookingInformation();
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const appointmentData = SelfBookingStore((state) => state.appointmentData);
  const setAppointmentData = SelfBookingStore(
    (state) => state.setAppointmentData
  );
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const newStartDate = dateHelper(
    informationWithSorage?.doctor?.eventStartDateTime
  );
  const newEndDate = dateHelper(informationWithSorage?.doctor?.eventEnd);
  const someOneElsePage = SelfBookingStore((state) => state.someOneElsePage);
   const chosenDoctor = SelfBookingStore((state) => state.chosenDoctor);
console.log("chosenDoctor:", chosenDoctor);
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = useState(
    DEFAULT_COUNTRY_CODE
  );
  const watchedValues = watch();
  const hasHydratedRef = useRef(false);
  const lastDraftRef = useRef("");
  // const auth = {
  //   clinicId: 1,
  //   companyId: "4b731791-d6f4-4f46-7363-08db9ce8963d",
  //   userId: "7",
  // }
  const {auth} = useAuth();
  const {
    mutate: CreateBookingMutate,
    isLoading: CreateBookingLoading,
    data: CreateBookingData,
  } = create_Booking();
  const {
    mutate: CreatePatientMutate,
    isLoading: CreatePatientLoading,
    data: CreatePatientData,
  } = create_Patient();
  const {
    mutate: CreateContactPersonMutate,
    isLoading: createContactPersonLoading,
    data: createContactPersonData,
  } = create_Contact_Person();
  const onSubmit = async (data) => {
    const { phoneNumberCountryCode, ...rest } = data;
    const payload = {
      ...rest,
      phoneNumber: joinPhoneByCountryCode(
        phoneNumberCountryCode || selectedPhoneCountryCode,
        data.phoneNumber
      ),
    };
    setSubmit(!submit);
    setFormData(payload);
  };

  const onError = (errors) => {
    console.log("Validation errors:", errors);
  };

  const createPatient = async () => {
    CreatePatientMutate(
      {
         data:{
      
      title: "",
      firstName: appointmentData.firstName,
      lastName: appointmentData.lastName,
      email: "",
      cellPhone: "",
      businessPhone: "",
      nip: "",
      mailingStreet: "",
      mailingHouseNumber: "",
      mailingCityId: 0,
      mailingRegionId: 0,
      mailingZipCode: "",
      mailingCountry: "",
      isBlackListed: false,
      dateOfBirth: appointmentData.dateOfBirth,
      gender: appointmentData.gender,
      pesel: "",
      maidenName: "",
      nationality: "",
      allergies: [],
      phobias: [],
      notes: "",
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
    token:auth
      });
  };
  const CreateBooking = async () => {
    
    CreateBookingMutate({
      data:{
        eventStartDateTime: newStartDate,
      eventEndDateTime: newEndDate,
      appointmentDescription: CreatePatientData.data.comments,
      appointmentTypeId: informationWithSorage?.apoimentTypeId?.id,
      userId: informationWithSorage?.doctor?.id,
      patientId: CreatePatientData.data.patientId,
      patientContactPersonId: CreatePatientData.data.patientContactPersonId,
      cabinetId: informationWithSorage?.doctor?.cabinetId,
      },
      token:auth
    });
  };
  
  const CreateContactPerson = async () => {
   
    CreateContactPersonMutate({
      data:{
      patientId: CreatePatientData.data.patientId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      cellPhone: formData.phoneNumber,
      gender: appointmentData.gender,
      pesel: formData.pesel,
      dateOfBirth: formData.dateOfBirth,
      zipCode: "",
      title: "",
      contactPersonTypeId: 0,
      },
      token:auth
    });
  };

  useEffect(() => {
    if (formData) {
      console.log("useEffect formData triggered:", formData);
      (async function () {
        try {
          await createPatient();
        } catch (error) {
          console.error("Error in useEffect:", error);
        }
      })();
    }
  }, [formData]);
  useEffect(() => {
    if (CreatePatientData) {
      console.log("CreatePatientData received:", CreatePatientData);
      (async function () {
        try {
          await CreateContactPerson();
        } catch (error) {
          console.error("Error in useEffect:", error);
        }
      })();
    }
  }, [CreatePatientData]);

  useEffect(() => {
    if (createContactPersonData) {
      console.log("createContactPersonData received:", createContactPersonData);
      (async function () {
        try {
          await CreateBooking();
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [createContactPersonData]);

  useEffect(() => {
    if (CreateBookingData) {
      console.log("CreateBookingData received:", CreateBookingData);
      setAppPage("complete");
      setHeaderPage(4);
      setAppointmentData({});
    }
  }, [CreateBookingData]);

  useEffect(() => {
    const parsedPhone = splitPhoneByCountryCode(appointmentData?.phoneNumber || "");
    setSelectedPhoneCountryCode(parsedPhone.countryCode);
    setValue("phoneNumber", parsedPhone.localNumber || "");
    setValue("phoneNumberCountryCode", parsedPhone.countryCode);
    hasHydratedRef.current = true;
  }, [appointmentData, setValue]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;

    const payload = {
      ...watchedValues,
      phoneNumber: joinPhoneByCountryCode(
        watchedValues?.phoneNumberCountryCode || selectedPhoneCountryCode,
        watchedValues?.phoneNumber || ""
      ),
    };

    const nextDraft = JSON.stringify(payload);
    if (lastDraftRef.current === nextDraft) return;
    lastDraftRef.current = nextDraft;
    setAppointmentData(payload);
  }, [watchedValues, selectedPhoneCountryCode, setAppointmentData]);

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  return (
    <div
      className={`forUserPageWrapper flex pb-[23px] mx-auto relative`}
      style={{
        width: widthBlock,
        height:
          _height >= 1080
            ? _width < 1280
              ? 1010
              : 975
            : _width < 1280
            ? _height - 70
            : _height <= 1000
            ? _height - 70
            : _height - 105,
        minHeight: 688,
      }}
    >
      <div
        className={`xl:w-[663px] lg:w-[570px] bg-white xl:px-[50px] lg:px-[15px] pt-[47px] flex-shrink-0 shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]`}
      >
        <div
          className={`text-[24px]/[29px] text-[#7C67FF] font-inter font-medium tracking-[1.08px] mb-10`}
        >
          Please enter your exact information
        </div>
        <form
          className={`flex flex-wrap justify-between mb-[10px]`}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <InputBlock
            label={`PESEL`}
            mark={"*Optional"}
            placeholder={"Input PESEL"}
            width={"full"}
            id={"pesel"}
            register={register}
            errors={errors}
            optional={true}
          />
          <InputBlock
            label={"First Name"}
            placeholder={"First name"}
            width={"[265px]"}
            value={"Jack"}
            id={"firstName"}
            register={register}
            errors={errors}
          />
          <InputBlock
            label={"Last Name"}
            placeholder={"Last name"}
            width={"[265px]"}
            value={"Smith"}
            id={"lastName"}
            register={register}
            errors={errors}
          />
          <InputBlock
            label={"Email"}
            placeholder={"example@gmail.com"}
            width={"[265px]"}
            id={"email"}
            register={register}
            errors={errors}
            type={"email"}
          />
          <PhoneNumberField
            label="Phone number *"
            widthClass="w-[265px]"
            phoneFieldName="phoneNumber"
            countryFieldName="phoneNumberCountryCode"
            placeholder="608484004"
            register={register}
            setValue={setValue}
            trigger={trigger}
            errors={errors}
            selectedCountryCode={selectedPhoneCountryCode}
            setSelectedCountryCode={setSelectedPhoneCountryCode}
            className="mb-[15px]"
          />
          <div className={`flex flex-col w-full mb-[30px]`}>
            <label
              htmlFor="comments"
              className={`text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px] mb-[2px]`}
            >
              Comments or special requests
            </label>
            <textarea
              id="comments"
              className={`border-[2px] border-[#E8E8E9] bg-white rounded-[10px] h-[71px] outline-none pl-4 py-2 `}
              {...register("comments")}
            ></textarea>
          </div>
          <input
            type="submit"
            value={"Book Appointment"}
            className={`bg-[#7C67FF] hover:bg-[#7059F6] w-full h-[45px] rounded-[10px] text-[16px]/[22px] text-white font-nunito font-semibold tracking-[0.72px] cursor-pointer duration-150`}
          />
        </form>
        <div
          className={`w-full h-[45px] rounded-[10px] text-[16px]/[22px] text-[#7C67FF] font-nunito font-semibold tracking-[0.72px] cursor-pointer flex justify-center items-center hover:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.11)] duration-150`}
          onClick={() =>
            someOneElsePage
              ? setAppPage("for someone else")
              : setAppPage("for who")
          }
        >
          Back
        </div>
      </div>
      <div
        className={` ml-3 flex flex-col`}
        style={{
          width: _width > 1280 ? widthBlock - 673 : widthBlock - 582,
        }}
      >
        <div
          className={` flex bg-white shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)]  ${
            _width <= 1400 || _height < 900
              ? "flex-col h-full mb-0"
              : "mb-3 h-1/2"
          }`}
        >
          <div
            className={`pl-10 flex flex-col justify-around  ${
              _width <= 1400 || _height < 900 ? "w-full h-1/2" : "w-1/2"
            } ${_height <= 800 ? "min-h-[345px]" : ""}`}
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
                {informationWithSorage?.apoimentTypeId?.lebel}
              </div>
              <div className={`text-[#3F4455] font-hebrew tracking-[0.72px]`}>
                {informationWithSorage?.doctor?.eventStartDateTime
                  ? moment(
                      informationWithSorage?.doctor?.eventStartDateTime,
                      "DD.MM.YYYY HH:mm:ss"
                    ).format("ddd MMM DD YYYY [at] h:mm a")
                  : "Not selected"}
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
                  src={informationWithSorage?.doctor?.avarar || WithoutAvatar}
                  alt="avatar"
                />
              </div>
              <div>
                <div
                  className={`text-[20px]/[27px] text-[#3F4455] font-nunito font-semibold tracking-[0.9px]`}
                >
                  {informationWithSorage?.doctor?.name || "Not selected"}
                </div>
                <div
                  className={`text-[16px]/[22px] text-[#D9D6EA] font-nunito font-bold tracking-[0.72px]`}
                >
                  {informationWithSorage?.doctor?.speciality || ""}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`w-1/2 p-5 ${
              _width <= 1400 || _height < 900 ? "w-full h-1/2" : ""
            }`}
          >
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=21.02241396903992%2C52.23806317354728%2C21.02595448493958%2C52.23953814682495&amp;layer=mapnik&marker=52.23880,21.02452"
              width="380"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`w-full`}
            ></iframe>
          </div>
        </div>
        <div
          className={` bg-white flex ${
            _width < 1152 ? " justify-center" : "justify-around"
          }  pl-10 shadow-[0px_4px_17px_0px_rgba(0,0,0,0.08)] ${
            _width <= 1400 || _height < 900
              ? "absolute left-0 -bottom-[240px] w-full h-[250px] pt-[30px]"
              : "flex-col h-1/2"
          }`}
        >
          <div className={`mr-10`}>
            <Title text={"information"} />
            <div className={``}>
              <div className={`flex mb-10`}>
                <InfoBlock
                  title={"Patient Name"}
                  value={""}
                  first={true}
                />
                <InfoBlock
                  title={"Date of birth"}
                  value={""}
                  first={_width <= 1400 || _height < 900 ? true : false}
                />
                <InfoBlock
                  title={"Gender"}
                  value={""}
                  first={_width <= 1400 || _height < 900 ? true : false}
                />
                <InfoBlock />
              </div>
              <div className={`flex`}>
                <InfoBlock
                  title={"Guardian"}
                  value={""}
                  first={true}
                />
                <InfoBlock
                  title={"Date of birth"}
                  value={""}
                  first={_width <= 1400 || _height < 900 ? true : false}
                />
                <InfoBlock
                  title={"Gender"}
                  value={""}
                  first={_width <= 1400 || _height < 900 ? true : false}
                />
                <InfoBlock
                  title={"Zip code"}
                  value={""}
                  first={_width <= 1400 || _height < 900 ? true : false}
                />
              </div>
            </div>
          </div>

          <div>
            <Title text={"contacts"} />
            <div
              className={`flex ${
                _width <= 1280
                  ? "flex-col h-full justify-around pb-[50px]"
                  : "flex-row"
              }`}
            >
              <InfoBlock
                title={"Phone"}
                value={""}
                first={true}
              />
              <InfoBlock
                title={"email"}
                value={""}
                first={_width <= 1400 || _height < 900 ? true : false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <div
      className={` text-[16px]/[22px] text-[#7C67FF] font-nunito font-bold tracking-[0.72px] uppercase mb-[17px]`}
    >
      {text}
    </div>
  );
};

const InfoBlock = ({ title, value, first }) => {
  return (
    <div
      className={`${first ? "" : " items-center"} mb-4 w-[160px] flex flex-col`}
    >
      <div
        className={`text-[16px]/[22px] text-[#D2D2D2] font-nunito font-bold tracking-[0.72px] uppercase mb-[5px]`}
      >
        {title}
      </div>
      <div
        className={`text-[15px]/[20px] text-[#3F4455] font-hebrew tracking-[0.675px]`}
      >
        {value}
      </div>
    </div>
  );
};

const InputBlock = ({
  label,
  placeholder,
  width,
  id,
  type,
  mark,
  register,
  errors,
  optional = false,
}) => {
  const emailRegExp =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  const allowedNameCharsRegExp = /[^\p{L}\p{M}\s'-]/gu;

  let idd = id !== "email" && id !== "phoneNumber" ? id : "";

  return (
    <div className={`inputBlock flex flex-col w-${width} mb-[15px] relative`}>
      <div>
        <label
          htmlFor={id}
          className={`text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px] mb-[2px] mr-[9px]`}
        >
          {label}
        </label>
        <span
          className={`text-[13px]/[16px] text-[#B7B7B7] font-inter tracking-[0.585px]`}
        >
          {mark}
        </span>
      </div>

      <input
        type={id === "phoneNumber" ? "tel" : type || "text"}
        id={id}
        placeholder={placeholder}
        inputMode={id === "phoneNumber" ? "numeric" : undefined}
        pattern={id === "phoneNumber" ? "[0-9]*" : undefined}
        maxLength={id === "phoneNumber" ? 9 : undefined}
        className={` border-[2px] border-[#E8E8E9] bg-white h-9 rounded-[10px] pl-[15px] text-[15px]/[18px] text-[#5E5E5E] font-inter tracking-[0.675px]`}
        onInput={
          id === "phoneNumber"
            ? (event) => {
                event.target.value = event.target.value.replace(/\D/g, "").slice(0, 9);
              }
            : id === "firstName" || id === "lastName"
            ? (event) => {
                event.target.value = event.target.value.replace(allowedNameCharsRegExp, "");
              }
            : undefined
        }
        {...register(id, {
          required: !optional,
          pattern: id === "email" ? emailRegExp : null,
          minLength: id === "phoneNumber" ? 9 : null,
          maxLength: id === "phoneNumber" ? 9 : null,
        })}
      />
      {errors
        ? Object.keys(errors).includes(idd) && (
            <p
              className={` absolute top-[55px] left-[5px] bg-white px-3 text-red-500 text-[12px]/[14px]`}
            >
              Field is requaired!
            </p>
          )
        : null}
      {id === "email"
        ? errors?.email?.type === "pattern" && (
            <p
              className={` absolute top-[55px] left-[5px] bg-white px-3 text-red-500 text-[12px]/[14px]`}
            >
              Wrong email format!
            </p>
          )
        : null}
      {id === "email"
        ? errors?.email?.type === "required" && (
            <p
              className={` absolute top-[55px] left-[5px] bg-white px-3 text-red-500 text-[12px]/[14px]`}
            >
              Field is required!
            </p>
          )
        : null}
      {id === "phoneNumber"
        ? errors?.phoneNumber?.type === "required" && (
            <p
              className={` absolute top-[55px] left-[5px] bg-white px-3 text-red-500 text-[12px]/[14px]`}
            >
              Field is required!
            </p>
          )
        : null}
      {id === "phoneNumber"
        ? (errors?.phoneNumber?.type === "minLength" ||
            errors?.phoneNumber?.type === "maxLength") && (
            <p
              className={`absolute top-[55px] left-[5px] bg-white px-3 text-red-500 text-[12px]/[14px]`}
            >
              Must be 9 digit!
            </p>
          )
        : null}
    </div>
  );
};

export default ForGuestPage;
