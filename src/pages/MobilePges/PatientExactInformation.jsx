import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SelfBookingStore from "../../store/SelfBookingStore";
import PhoneNumberField from "../components/PhoneNumberField";
import { useOnClickOutside } from "../helpers/helpers";
import {
  DEFAULT_COUNTRY_CODE,
  joinPhoneByCountryCode,
  splitPhoneByCountryCode,
} from "../helpers/phoneCountry";
import { useAppTranslation } from "../../i18n/useAppTranslation";
import { GENDER_VALUES, getGenderLabel, normalizeGender } from "../../i18n/gender";
import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";
import { GlobalHookWindowSummary } from "../../helpers/GlobalHookWindowSummary";

const emailRegExp =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
const allowedNameCharsRegExp = /[^\p{L}\p{M}\s'-]/gu;

const sanitizeNameInput = (value = "") => value.replace(allowedNameCharsRegExp, "");

const PatientExactInformation = () => {
  const { t } = useAppTranslation();
  const genderOptions = GENDER_VALUES;
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  const {screenSize} = GlobalHookWindowSummary();

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setAppointmentData = SelfBookingStore((state) => state.setAppointmentData);
  const appointmentData = SelfBookingStore((state) => state.appointmentData);
  const setConfirmationData = SelfBookingStore((state) => state.setConfirmationData);
  const confirmationData = SelfBookingStore((state) => state.confirmationData);

  const [selectedGender, setSelectedGender] = useState(genderOptions[0]);
  const [genderOpen, setGenderOpen] = useState(false);
  const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = useState(
    DEFAULT_COUNTRY_CODE
  );

  const watchedValues = watch();
  const watchedDateOfBirth = watch("dateOfBirth");
  const hasHydratedRef = useRef(false);
  const lastDraftRef = useRef("");
  const genderDropdownRef = useRef(null);

  useOnClickOutside(genderDropdownRef, () => setGenderOpen(false));

  useEffect(() => {
    if (hasHydratedRef.current) return;

    const savedData =
      confirmationData?.source === "for user"
        ? confirmationData?.formData
        : appointmentData;

    if (!savedData) {
      hasHydratedRef.current = true;
      return;
    }

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
    const normalizedGender = normalizeGender(savedData.gender);
    setSelectedGender(normalizedGender);
    setValue("gender", normalizedGender);
    hasHydratedRef.current = true;
  }, [appointmentData, confirmationData, setValue]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;

    const payload = {
      ...watchedValues,
      gender: selectedGender,
      cellPhone: joinPhoneByCountryCode(
        watchedValues?.cellPhoneCountryCode || selectedPhoneCountryCode,
        watchedValues?.cellPhone || ""
      ),
    };

    const nextDraft = JSON.stringify(payload);
    if (lastDraftRef.current === nextDraft) return;
    lastDraftRef.current = nextDraft;
    setAppointmentData(payload);
  }, [watchedValues, selectedGender, selectedPhoneCountryCode, setAppointmentData]);

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
    setAppPage("appointment information mobile");
  };

  return (
    <div>
      <section className="mobileBG h-[100px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-[calc(100%-30px)] mx-auto">
            <p className="text-[24px] text-white text-center leading-normal">
              {t("patient_details", "Patient Details")}
            </p>
            <img
              className="absolute top-[6px] left-0 h-[16px] w-[16px]"
              src={chevronLeft}
              onClick={() => {
                setAppPage("for who mobile");
              }}
            />
          </div>
        </div>
      </section>
      <section>
        <form
          className={`flex flex-col pt-[18px] items-center gap-[0px] px-[16px] [&>div]:mb-4 [&>div]:gap-1 ${screenSize < 768 ? '' : '[&>div]:max-w-[800px]'}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputField
            label={t("pesel_passport", "PESEL/PASSPORT")}
            id="pesel"
            placeholder={t("enter_pesel_passport", "Enter PESEL/PASSPORT")}
            register={register}
            errors={errors}
          />

          <InputField
            label={t("first_name", "First Name *")}
            id="firstName"
            placeholder={t("enter_first_name", "Enter first name")}
            register={register}
            errors={errors}
            rules={{
              required: t("field_required", "Field is required"),
              onChange: (event) => {
                event.target.value = sanitizeNameInput(event.target.value);
              },
            }}
          />

          <InputField
            label={t("last_name", "Last Name *")}
            id="lastName"
            placeholder={t("enter_last_name", "Enter last name")}
            register={register}
            errors={errors}
            rules={{
              required: t("field_required", "Field is required"),
              onChange: (event) => {
                event.target.value = sanitizeNameInput(event.target.value);
              },
            }}
          />

          <GenderDropdown
            label={t("gender_required", "Gender *")}
            value={selectedGender}
            onChange={(value) => {
              setSelectedGender(value);
              setValue("gender", value, { shouldValidate: true });
            }}
            options={genderOptions.map((option) => ({
              value: option,
              label: getGenderLabel(t, option),
            }))}
            error={errors?.gender?.message}
            open={genderOpen}
            setOpen={setGenderOpen}
            dropdownRef={genderDropdownRef}
          />
          <input
            type="hidden"
            {...register("gender", { required: t("field_required", "Field is required") })}
            value={selectedGender}
          />

          <DateInputField
            label={t("date_of_birth_required", "Date of Birth *")}
            id="dateOfBirth"
            placeholder={t("enter_date_of_birth", "Enter date of birth")}
            register={register}
            errors={errors}
            rules={{ required: t("select_date", "Select date") }}
            valuePresent={Boolean(watchedDateOfBirth)}
          />

          <InputField
            label={`${t("email", "Email")} *`}
            id="email"
            type="email"
            placeholder={t("enter_email", "Enter email")}
            register={register}
            errors={errors}
            rules={{
              required: t("field_required", "Field is required"),
              pattern: { value: emailRegExp, message: t("enter_valid_email", "Enter valid email") },
            }}
          />

          <PhoneNumberField
            label={t("phone_number", "Phone Number *")}
            widthClass="w-full max-w-[340px]"
            phoneFieldName="cellPhone"
            countryFieldName="cellPhoneCountryCode"
            placeholder="000000000"
            register={register}
            setValue={setValue}
            trigger={trigger}
            isMobile={true}
            errors={errors}
            selectedCountryCode={selectedPhoneCountryCode}
            setSelectedCountryCode={setSelectedPhoneCountryCode}
            className="mb-4"
          />

          <InputField
            label={t("city", "City *")}
            id="city"
            placeholder={t("enter_city", "Enter city")}
            register={register}
            errors={errors}
            rules={{ required: t("field_required", "Field is required") }}
          />

          <InputField
            label={t("address", "Address *")}
            id="address"
            placeholder={t("enter_address", "Enter address")}
            register={register}
            errors={errors}
            rules={{ required: t("field_required", "Field is required") }}
          />

          <div className="w-full max-w-[340px] flex flex-col relative">
            <div className="text-[14px] text-[#5E5E5E] font-medium">
              {t("comments_optional", "Comments or special requests (Optional)")}
            </div>
            <textarea
              id="comment"
              {...register("comment")}
              className="text-[15px] border border-solid rounded-[4px] h-[80px] border-[#11111333] text-[#111113] p-[12px]"
              placeholder={t(
                "comments_placeholder",
                "Any additional information or special requirements..."
              )}
            ></textarea>
          </div>
          
          <div className="w-full max-w-[340px] flex flex-wrap gap-[12px] mb-[10px] mt-4">
            <button className="w-full h-[44px] font-medium rounded-[12px] bg-[#7C67FF] text-white">
              {t("continue", "Continue")}
            </button>
            <button
              type="button"
              onClick={() => {
                setAppPage("for who mobile");
              }}
              className="w-full h-[44px] font-medium rounded-[12px] border border-solid border-[#7C67FF] bg-white text-[#7C67FF]"
            >
              {t("cancel", "Cancel")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  register,
  errors,
  rules,
}) => {
  const { t } = useAppTranslation();
  return (
    <div className="w-full max-w-[340px] flex flex-col relative mb-4">
      <div className="text-[14px] text-[#5E5E5E] font-medium">{label}</div>
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px]"
        {...register(id, rules)}
      />
      {errors?.[id] && (
        <p className="mt-1 text-red-500 text-[12px]/[14px]">
          {errors[id]?.message || t("field_required", "Field is required")}
        </p>
      )}
    </div>
  );
};

const DateInputField = ({
  label,
  id,
  placeholder,
  register,
  errors,
  rules,
  valuePresent,
}) => {
  const { t } = useAppTranslation();
  const [inputType, setInputType] = useState("text");

  useEffect(() => {
    setInputType(valuePresent ? "date" : "text");
  }, [valuePresent]);

  return (
    <div className="w-full max-w-[340px] flex flex-col relative mb-4">
      <div className="text-[14px] text-[#5E5E5E] font-medium">{label}</div>
      <input
        type={inputType}
        placeholder={placeholder}
        id={id}
        className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] p-[12px]"
        onFocus={() => setInputType("date")}
        onBlur={(event) => {
          if (!event.target.value) {
            setInputType("text");
          }
        }}
        {...register(id, rules)}
      />
      {errors?.[id] && (
        <p className="mt-1 text-red-500 text-[12px]/[14px]">
          {errors[id]?.message || t("field_required", "Field is required")}
        </p>
      )}
    </div>
  );
};

const GenderDropdown = ({
  label,
  value,
  onChange,
  options = [],
  error,
  open,
  setOpen,
  dropdownRef,
}) => {
  return (
    <div className="w-full max-w-[340px] flex flex-col relative mb-4" ref={dropdownRef}>
      <div className="text-[14px] text-[#5E5E5E] font-medium">{label}</div>
      <button
        type="button"
        className="text-[15px] border border-solid rounded-[4px] border-[#11111333] text-[#111113] py-[8.75px] px-[12px] bg-white flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span>{options.find((option) => option.value === value)?.label}</span>
        <span className={`${open ? "rotate-180" : ""} duration-200`}>
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 1L6 6L1 1" stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute top-[72px] left-0 w-full z-30 border border-[#D8DBE2] rounded-[8px] bg-white overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full text-left px-3 py-2 text-[15px]/[18px] text-[#333] font-sans tracking-[0.675px] hover:bg-[#F3F3FF]"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="mt-1 text-red-500 text-[12px]/[14px]">{error}</p>
      )}
    </div>
  );
};

export default PatientExactInformation;
