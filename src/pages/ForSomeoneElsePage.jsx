import { useRef, useState, useEffect } from "react";
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
import { useAppTranslation } from "../i18n/useAppTranslation";

const emailRegExp =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
const allowedNameCharsRegExp = /[^\p{L}\p{M}\s'-]/gu;

const sanitizeNameInput = (value = "") => value.replace(allowedNameCharsRegExp, "");

const ForSomeoneElsePage = () => {
  const { t } = useAppTranslation();
  const genderOptions = [t("male", "Male"), t("female", "Female"), t("other", "Other")];
  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  const [patientGender, setPatientGender] = useState(genderOptions[0]);
  const [guardianGender, setGuardianGender] = useState(genderOptions[0]);
  const [showPatientGender, setShowPatientGender] = useState(false);
  const [showGuardianGender, setShowGuardianGender] = useState(false);
  const [activePatientGuardian, setActivePatientGuardian] = useState("Yes");
  const [consentChecked, setConsentChecked] = useState(false);
  const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = useState(
    DEFAULT_COUNTRY_CODE
  );

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setAppointmentData = SelfBookingStore((state) => state.setAppointmentData);
  const appointmentData = SelfBookingStore((state) => state.appointmentData);
  const setConfirmationData = SelfBookingStore((state) => state.setConfirmationData);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const setForSomeoneElseConsent = SelfBookingStore((state) => state.setForSomeoneElseConsent);
  const watchedValues = watch();
  const hasHydratedRef = useRef(false);
  const lastDraftRef = useRef("");

  const patientGenderRef = useRef(null);
  const guardianGenderRef = useRef(null);
  const isGuardianDisabled = activePatientGuardian === "No";

  useOnClickOutside(patientGenderRef, () => setShowPatientGender(false));
  useOnClickOutside(guardianGenderRef, () => setShowGuardianGender(false));

  useEffect(() => {
    if (!appointmentData) {
      hasHydratedRef.current = true;
      return;
    }

    if (Object.keys(appointmentData).length === 0) {
      setValue("gender", patientGender);
      setValue("guardianGender", guardianGender);
      setActivePatientGuardian("Yes");
      setForSomeoneElseConsent(false);
      hasHydratedRef.current = true;
      return;
    }

    setValue("firstName", appointmentData.firstName || "");
    setValue("dateOfBirth", appointmentData.dateOfBirth || "");
    setValue("lastName", appointmentData.lastName || "");
    setValue("guardianFirstName", appointmentData.guardianFirstName || "");
    setValue("guardianLastName", appointmentData.guardianLastName || "");
    setValue("guardianPesel", appointmentData.guardianPesel || "");
    setValue("guardianDateOfBirth", appointmentData.guardianDateOfBirth || "");
    setValue("email", appointmentData.email || "");
    const parsedPhone = splitPhoneByCountryCode(appointmentData.phoneNumber || "");
    setSelectedPhoneCountryCode(parsedPhone.countryCode);
    setValue("phoneNumber", parsedPhone.localNumber || "");
    setValue("phoneNumberCountryCode", parsedPhone.countryCode);
    setValue("city", appointmentData.city || "");
    setValue("address", appointmentData.address || "");
    setValue("comment", appointmentData.comment || "");
    setValue("consent", !!appointmentData.consent);

    setPatientGender(appointmentData.gender || genderOptions[0]);
    setGuardianGender(appointmentData.guardianGender || genderOptions[0]);
    setValue("gender", appointmentData.gender || genderOptions[0]);
    setValue("guardianGender", appointmentData.guardianGender || genderOptions[0]);
    setActivePatientGuardian(appointmentData.activePatientGuardian || "Yes");
    setConsentChecked(!!appointmentData.consent);
    setForSomeoneElseConsent(!!appointmentData.consent);
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;

    const payload = {
      ...watchedValues,
      gender: patientGender,
      guardianGender,
      activePatientGuardian,
      consent: consentChecked,
      phoneNumber: joinPhoneByCountryCode(
        watchedValues?.phoneNumberCountryCode || selectedPhoneCountryCode,
        watchedValues?.phoneNumber || ""
      ),
    };

    const nextDraft = JSON.stringify(payload);
    if (lastDraftRef.current === nextDraft) return;
    lastDraftRef.current = nextDraft;
    setAppointmentData(payload);
  }, [
    watchedValues,
    patientGender,
    guardianGender,
    activePatientGuardian,
    consentChecked,
    selectedPhoneCountryCode,
    setAppointmentData,
  ]);

  const onSubmit = (data) => {
    const { phoneNumberCountryCode, ...rest } = data;
    const payload = {
      ...rest,
      gender: patientGender,
      guardianGender,
      activePatientGuardian,
      consent: consentChecked,
      phoneNumber: joinPhoneByCountryCode(
        phoneNumberCountryCode || selectedPhoneCountryCode,
        data.phoneNumber
      ),
    };
    setAppointmentData(payload);
    setConfirmationData({
      source: "for someone else",
      formData: payload,
    });
    setHeaderPage(3);
    setAppPage("appointment confirmation");
  };

  return (
    <div className="pb-3 relative mx-auto" style={{ width: widthBlock }}>
      <div className="bg-white rounded-[10px] p-6 overflow-auto scrollmainContent shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] h-max">
        <div className="text-[24px] font-sans text-[#333] font-semibold mb-1">
          {t("who_are_you_scheduling_for", "Who are you scheduling for?")}
        </div>
        <div className="text-[16px] font-sans text-[#6A7282] mb-8">
          {t("please_fill_below", "Please fill in the information below")}
        </div>

        <form
          id="for-someone-else-form"
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[1040px] mx-auto flex flex-wrap justify-between"
        >
          <SectionTitle text={t("patient_details_short", "Patient details")} />
          <Field label={t("pesel_passport", "PESEL/PASSPORT *")} width="w-full">
            <Input
              register={register}
              id="pesel"
              placeholder={t("enter_pesel_passport", "Enter PESEL/PASSPORT")}
              errors={errors}
              rules={{ required: t("field_required", "Field is required") }}
            />
          </Field>
          <Field label={t("first_name", "First Name *")} width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="firstName"
              placeholder={t("enter_first_name", "Enter first name")}
              errors={errors}
              rules={{ required: t("field_required", "Field is required") }}
              sanitizeInput={sanitizeNameInput}
            />
          </Field>
          <Field label={t("last_name", "Last Name *")} width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="lastName"
              placeholder={t("enter_last_name", "Enter last name")}
              errors={errors}
              rules={{ required: t("field_required", "Field is required") }}
              sanitizeInput={sanitizeNameInput}
            />
          </Field>
          <DatePickerField
            label={t("date_of_birth_required", "Date of Birth *")}
            width="w-[calc(50%-8px)]"
            id="dateOfBirth"
            placeholder={t("enter_date_of_birth", "Enter date of birth")}
            control={control}
            errors={errors}
            rules={{ required: t("select_date", "Select date") }}
            maxDate={new Date()}
          />
          <Field label={t("gender_required", "Gender *")} width="w-[calc(50%-8px)]">
            <GenderDropdown
              options={genderOptions}
              value={patientGender}
              open={showPatientGender}
              setOpen={setShowPatientGender}
              onSelect={(value) => {
                setPatientGender(value);
                setValue("gender", value, { shouldValidate: true });
              }}
              dropdownRef={patientGenderRef}
            />
            <input type="hidden" {...register("gender", { required: true })} value={patientGender} />
            {errors?.gender && (
              <p className="mt-1 text-red-500 text-[12px]/[14px]">
                {t("field_required", "Field is required")}
              </p>
            )}
          </Field>

          <SectionTitle text={t("booking_person", "Booking person")} />
          <Field label={t("first_name", "First Name *")} width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="guardianFirstName"
              placeholder={t("enter_first_name", "Enter first name")}
              disabled={isGuardianDisabled}
              errors={errors}
              rules={{
                validate: (value) =>
                  isGuardianDisabled || value?.trim()
                    ? true
                    : t("field_required", "Field is required"),
              }}
              sanitizeInput={sanitizeNameInput}
            />
          </Field>
          <Field label={t("last_name", "Last Name *")} width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="guardianLastName"
              placeholder={t("enter_last_name", "Enter last name")}
              disabled={isGuardianDisabled}
              errors={errors}
              rules={{
                validate: (value) =>
                  isGuardianDisabled || value?.trim()
                    ? true
                    : t("field_required", "Field is required"),
              }}
              sanitizeInput={sanitizeNameInput}
            />
          </Field>
          <Field label={t("gender_required", "Gender *")} width="w-[calc(50%-8px)]">
            <GenderDropdown
              options={genderOptions}
              value={guardianGender}
              open={showGuardianGender}
              setOpen={setShowGuardianGender}
              disabled={isGuardianDisabled}
              onSelect={(value) => {
                setGuardianGender(value);
                setValue("guardianGender", value, { shouldValidate: true });
              }}
              dropdownRef={guardianGenderRef}
            />
            <input
              type="hidden"
              {...register("guardianGender", {
                validate: (value) =>
                  isGuardianDisabled || value ? true : t("field_required", "Field is required"),
              })}
              value={guardianGender}
              disabled={isGuardianDisabled}
            />
            {errors?.guardianGender && !isGuardianDisabled && (
              <p className="mt-1 text-red-500 text-[12px]/[14px]">
                {errors.guardianGender.message}
              </p>
            )}
          </Field>

          <div className="w-full flex items-center gap-6 mb-6">
            <div className="text-[15px] text-[#333333] font-sans font-medium">
              {t("are_you_parent_guardian", "Are you the parent or legal guardian of the patient?")}
            </div>
            <label className="flex items-center gap-2 text-[15px] font-sans text-[#333333]">
              <input type="radio" name="guardianRadio" checked={activePatientGuardian === "Yes"} onChange={() => setActivePatientGuardian("Yes")} />
              {t("yes", "Yes")}
            </label>
            <label className="flex items-center gap-2 text-[15px] font-sans text-[#333333]">
              <input type="radio" name="guardianRadio" checked={activePatientGuardian === "No"} onChange={() => setActivePatientGuardian("No")} />
              {t("no", "No")}
            </label>
          </div>

          <Field label={t("passport_pesel_required", "Passport/pesel *")} width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="guardianPesel"
              placeholder={t("enter_passport_pesel", "Enter passport/pesel")}
              disabled={isGuardianDisabled}
              errors={errors}
              rules={{
                validate: (value) =>
                  isGuardianDisabled || value?.trim()
                    ? true
                    : t("field_required", "Field is required"),
              }}
            />
          </Field>
          <DatePickerField
            label={t("date_of_birth_required", "Date of Birth *")}
            width="w-[calc(50%-8px)]"
            id="guardianDateOfBirth"
            placeholder={t("enter_date_of_birth", "Enter date of birth")}
            control={control}
            disabled={isGuardianDisabled}
            errors={errors}
            rules={{
              validate: (value) =>
                isGuardianDisabled || value ? true : t("select_date", "Select date"),
            }}
            maxDate={new Date()}
          />

          <SectionTitle text={t("contact_information", "Contact Information")} />
          <PhoneNumberField
            label={t("phone_number", "Phone Number *")}
            widthClass="w-[calc(50%-8px)]"
            phoneFieldName="phoneNumber"
            countryFieldName="phoneNumberCountryCode"
            placeholder="000000000"
            register={register}
            setValue={setValue}
            trigger={trigger}
            errors={errors}
            selectedCountryCode={selectedPhoneCountryCode}
            setSelectedCountryCode={setSelectedPhoneCountryCode}
          />
          <Field label={`${t("email", "Email")} *`} width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="email"
              placeholder={t("enter_email", "Enter email")}
              errors={errors}
              rules={{
                required: t("field_required", "Field is required"),
                pattern: { value: emailRegExp, message: t("enter_valid_email", "Enter valid email") },
              }}
            />
          </Field>
          <Field label={t("city", "City *")} width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="city"
              placeholder={t("enter_city", "Enter city")}
              errors={errors}
              rules={{ required: t("field_required", "Field is required") }}
            />
          </Field>
          <Field label={t("address", "Address *")} width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="address"
              placeholder={t("enter_address", "Enter address")}
              errors={errors}
              rules={{ required: t("field_required", "Field is required") }}
            />
          </Field>

          <div className="w-full mb-6 text-[15px] font-sans text-[#5A6172]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("consent", {
                  required: t("consent_required", "Consent is required"),
                })}
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked);
                  setForSomeoneElseConsent(e.target.checked);
                  setValue("consent", e.target.checked, { shouldValidate: true });
                }}
              />
              {t("consent_label_prefix", "By leaving checked, I agree with the")}{" "}
              <span className="text-[#6A6DE8] underline">
                {t("calling_consent", "Calling Consent")}
              </span>
            </label>
            {errors?.consent && (
              <p className="mt-1 text-red-500 text-[12px]/[14px]">
                {t("consent_required", "Consent is required")}
              </p>
            )}
          </div>

          <SectionTitle text={t("other_details", "Other details")} />
          <div className="w-full mb-3 text-[15px] font-sans text-[#4E5565]">
            {t("comments_optional", "Comments or special requests")}{" "}
            <span className="text-[#95A0B5]">{t("comments_optional_short", "Optional")}</span>
          </div>
          <textarea
            className="w-full h-[86px] border border-[#D8DBE2] rounded-[8px] px-4 py-3 text-[15px] font-sans text-[#4E5565] mb-4"
            placeholder={t(
              "comments_placeholder",
              "Any additional information or special requirements..."
            )}
            {...register("comment")}
          />
          <div className="w-full text-[15px] font-sans text-[#7A8294] mb-6">
            {t(
              "emergency_consultation_note",
              "For Emergency Consultation Appointments, please provide us with more information regarding your appointment request"
            )}
          </div>

          <input type="submit" className="hidden" />
        </form>
      </div>
    </div>
  );
};

const SectionTitle = ({ text }) => (
  <div className="w-full text-[18px] text-[#2D3340] font-medium mb-4">{text}</div>
);

const Field = ({ label, width, children }) => (
  <div className={`${width} mb-[26px]`}>
    <div className="text-[15px]/[18px] text-[#333] font-sans font-[500] tracking-[0.675px] mb-2">
      {label}
    </div>
    {children}
  </div>
);

const Input = ({
  register,
  id,
  placeholder,
  type = "text",
  disabled = false,
  errors,
  rules = {},
  sanitizeInput,
}) => {
  const { t } = useAppTranslation();
  const registerOptions = sanitizeInput
    ? {
        ...rules,
        onChange: (event) => {
          event.target.value = sanitizeInput(event.target.value);
        },
      }
    : rules;

  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-[12px] py-[8px] border-[2px] border-[#E8E8E9] rounded-[10px] text-[15px]/[18px] text-[#333] font-sans tracking-[0.675px] ${
          disabled ? "bg-[#F0F2F6] text-[#A4ABBC] cursor-not-allowed" : "bg-white"
        }`}
        {...register(id, registerOptions)}
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
  options = [],
  value,
  open,
  setOpen,
  onSelect,
  dropdownRef,
  disabled = false,
}) => (
  <div
    ref={dropdownRef}
    className={`relative border-[2px] border-[#E8E8E9] rounded-[10px] px-[12px] py-[8px] flex items-center justify-between ${
      disabled ? "bg-[#F0F2F6] text-[#A4ABBC] cursor-not-allowed" : "bg-white text-[#333] cursor-pointer"
    }`}
    onClick={() => {
      if (!disabled) setOpen(!open);
    }}
  >
    <span className="text-[15px]/[18px] font-sans tracking-[0.675px]">{value}</span>
    <span className={`${open ? "rotate-180" : ""} duration-200`}>
      <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 1L6 6L1 1" stroke="#99A1AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    {open && !disabled && (
      <div className="absolute top-[48px] left-0 w-full z-20 border border-[#D8DBE2] rounded-[8px] bg-white overflow-hidden">
        {options.map((item) => (
          <button
            type="button"
            key={item}
            className="w-full text-left px-3 py-2 text-[15px]/[18px] text-[#333] font-sans tracking-[0.675px] hover:bg-[#F3F3FF]"
            onClick={() => {
              onSelect(item);
              setOpen(false);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default ForSomeoneElsePage;
