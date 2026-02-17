import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SelfBookingStore from "../store/SelfBookingStore";
import { useOnClickOutside } from "./helpers/helpers";
import PhoneNumberField from "./components/PhoneNumberField";
import {
  DEFAULT_COUNTRY_CODE,
  joinPhoneByCountryCode,
  splitPhoneByCountryCode,
} from "./helpers/phoneCountry";
import DatePickerField from "./components/DatePickerField";

const genderOptions = ["Male", "Female", "Other"];
const emailRegExp =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

const ForUserPage = () => {
  const { register, control, handleSubmit, setValue, trigger, formState: { errors } } = useForm({
    mode: "all",
  });

  const [selectedGender, setSelectedGender] = useState(genderOptions[0]);
  const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = useState(
    DEFAULT_COUNTRY_CODE
  );
  const [showList, setShowList] = useState(false);
  const [arrowHover, setArrowHover] = useState(false);

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setAppointmentData = SelfBookingStore((state) => state.setAppointmentData);
  const appointmentData = SelfBookingStore((state) => state.appointmentData);
  const setConfirmationData = SelfBookingStore((state) => state.setConfirmationData);
  const confirmationData = SelfBookingStore((state) => state.confirmationData);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);

  const genderSelect = useRef(null);
  useOnClickOutside(genderSelect, () => setShowList(false));

  useEffect(() => {
    const savedData =
      confirmationData?.source === "for user"
        ? confirmationData?.formData
        : appointmentData;
    if (!savedData) return;

    setValue("pesel", savedData.pesel || "");
    setValue("firstName", savedData.firstName || "");
    setValue("lastName", savedData.lastName || "");
    setValue("dateOfBirth", savedData.dateOfBirth || "");
    setValue("email", savedData.email || "");
    const parsedPhone = splitPhoneByCountryCode(savedData.cellPhone || "");
    setSelectedPhoneCountryCode(parsedPhone.countryCode);
    setValue("cellPhone", parsedPhone.localNumber || "");
    setValue("cellPhoneCountryCode", parsedPhone.countryCode);
    setValue("city", savedData.city || "");
    setValue("address", savedData.address || "");
    setValue("comment", savedData.comment || "");
    setSelectedGender(savedData.gender || genderOptions[0]);
    setValue("gender", savedData.gender || genderOptions[0]);
  }, [appointmentData, confirmationData, setValue]);

  const onSubmit = (data) => {
    const { cellPhoneCountryCode, ...rest } = data;
    const payload = {
      ...rest,
      gender: selectedGender,
      cellPhone: joinPhoneByCountryCode(
        cellPhoneCountryCode || selectedPhoneCountryCode,
        data.cellPhone
      ),
    };
    setAppointmentData(payload);
    setConfirmationData({
      source: "for user",
      formData: payload,
    });
    setHeaderPage(3);
    setAppPage("appointment confirmation");
  };

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  return (
    <div
      className="forUserPageWrapper pb-[21px] mx-auto"
      style={{ width: widthBlock }}
    >
      <div
        className="bg-white p-6 h-max overflow-auto scrollmainContent rounded-[10px]"
        style={{ boxShadow: "0 4px 20px -1px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="text-[24px] text-[#30343F] font-semibold mb-1">
          Patient Details
        </div>
        <div className="text-[16px] text-[#7A8294] mb-8">
          Please fill in the information below
        </div>
        <form
          id="for-user-form"
          className="max-w-[1120px] mx-auto flex flex-wrap justify-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-[18px] text-[#101828] font-medium mb-4 w-full">
            Personal Information
          </div>
          <InputBlock
            label="PESEL *"
            placeholder="00000000"
            width="w-full"
            id="pesel"
            register={register}
            errors={errors}
            rules={{
              required: "Field is required",
            }}
          />
          <InputBlock
            label="First Name *"
            placeholder="Abhijit"
            width="w-[calc(50%-8px)]"
            id="firstName"
            register={register}
            errors={errors}
            rules={{ required: "Field is required" }}
          />
          <InputBlock
            label="Last Name *"
            placeholder="Chatterjee"
            width="w-[calc(50%-8px)]"
            id="lastName"
            register={register}
            errors={errors}
            rules={{ required: "Field is required" }}
          />
          <DatePickerField
            label="Date of Birth *"
            placeholder="dd.mm.yyyy"
            width="w-[calc(50%-8px)]"
            id="dateOfBirth"
            control={control}
            errors={errors}
            rules={{ required: "Select date" }}
            maxYearsFromToday={10}
            maxDate={new Date()}
          />

          <div className="flex flex-col w-[calc(50%-8px)] mb-[26px] relative z-50">
            <div className="text-[15px]/[18px] text-[#333] font-sans font-[500] mb-[4px]">
              Gender *
            </div>
            <div
              className="border-[2px] border-[#E8E8E9] relative cursor-pointer flex items-center rounded-[10px] text-[15px]/[18px] text-[#333] font-sans tracking-[0.675px] px-[12px] py-[8px]"
              onClick={() => {
                setShowList(!showList);
                setValue("gender", selectedGender, { shouldValidate: true });
              }}
              onMouseEnter={() => setArrowHover(true)}
              onMouseLeave={() => setArrowHover(false)}
              ref={genderSelect}
            >
              {selectedGender}
              <div
                className={`absolute top-[48px] left-0 w-full ${
                  showList ? "opacity-100 visible" : "opacity-0 invisible"
                } duration-200 border border-[#D8DBE2] rounded-[8px]`}
              >
                {genderOptions.map((item) => (
                  <div
                    key={item}
                    className="bg-white h-[42px] flex items-center px-4 text-[15px]/[18px] text-[#333] font-sans tracking-[0.675px] hover:bg-[#F3F3FF] hover:text-[#6674F3] cursor-pointer rounded-[8px]"
                    onClick={() => {
                      setShowList(false);
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
                  showList ? "rotate-180" : "rotate-0"
                } duration-500 ${
                  arrowHover
                    ? 'bg-[url("./assets/images/self-booking/listArrowHover.svg")]'
                    : 'bg-[url("./assets/images/self-booking/listArrow.svg")]'
                }`}
              ></span>
            </div>
            <input
              type="hidden"
              {...register("gender", { required: "Field is required" })}
              value={selectedGender}
            />
            {errors?.gender && (
              <p className="mt-1 text-red-500 text-[12px]/[14px]">
                {errors.gender.message}
              </p>
            )}
          </div>
          <InputBlock
            label="City *"
            width="w-[calc(50%-8px)]"
            id="city"
            register={register}
            errors={errors}
            rules={{ required: "Field is required" }}
          />
          <InputBlock
            label="Address *"
            width="w-[calc(50%-8px)]"
            id="address"
            register={register}
            errors={errors}
            rules={{ required: "Field is required" }}
          />

          <div className="text-[18px] text-[#101828] w-full font-medium mb-4 mt-2">
            Contact Information
          </div>
          <PhoneNumberField
            label="Phone Number *"
            widthClass="w-[calc(50%-8px)]"
            phoneFieldName="cellPhone"
            countryFieldName="cellPhoneCountryCode"
            placeholder="608484004"
            register={register}
            setValue={setValue}
            trigger={trigger}
            errors={errors}
            selectedCountryCode={selectedPhoneCountryCode}
            setSelectedCountryCode={setSelectedPhoneCountryCode}
          />
          <InputBlock
            label="Email *"
            placeholder="svitlanatyshchenko95@gmail.com"
            width="w-[calc(50%-8px)]"
            id="email"
            register={register}
            errors={errors}
            type="email"
            rules={{
              required: "Field is required",
              pattern: { value: emailRegExp, message: "Enter valid email" },
            }}
          />

          <div className="flex flex-col w-full mb-[24px]">
            <label htmlFor="comments" className="text-[18px] text-[#4E5565] font-medium mb-[6px]">
              Comments or special requests (Optional)
            </label>
            <textarea
              id="comments"
              className="border border-[#D8DBE2] bg-white rounded-[8px] h-[72px] outline-none px-4 py-3"
              placeholder="Any additional information or special requirements..."
              {...register("comment")}
            ></textarea>
          </div>

          <input type="submit" className="hidden" />
        </form>
      </div>
    </div>
  );
};

const InputBlock = ({ label, placeholder, width, id, type, register, errors, rules }) => {
  return (
    <div className={`inputBlock flex flex-col ${width} mb-[26px]`}>
      <label htmlFor={id} className="text-[15px]/[18px] text-[#333] font-sans font-[500] tracking-[0.675px] mb-[2px]">
        {label}
      </label>
      <input
        type={type || "text"}
        id={id}
        placeholder={placeholder}
        className="px-[12px] py-[8px] border-[2px] border-[#E8E8E9] bg-white rounded-[10px] text-[15px]/[18px] text-[#333] font-sans tracking-[0.675px]"
        {...register(id, rules)}
      />
      {errors?.[id] && (
        <p className="mt-1 text-red-500 text-[12px]/[14px]">
          {errors[id]?.message || "Field is required"}
        </p>
      )}
    </div>
  );
};

export default ForUserPage;
