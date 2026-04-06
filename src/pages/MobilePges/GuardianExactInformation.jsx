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

const GuardianExactInformation = () => {
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

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setAppointmentData = SelfBookingStore((state) => state.setAppointmentData);
  const appointmentData = SelfBookingStore((state) => state.appointmentData);
  const confirmationData = SelfBookingStore((state) => state.confirmationData);
  const setConfirmationData = SelfBookingStore((state) => state.setConfirmationData);
  const setForSomeoneElseConsent = SelfBookingStore(
    (state) => state.setForSomeoneElseConsent
  );

  const [patientGender, setPatientGender] = useState(genderOptions[0]);
  const [guardianGender, setGuardianGender] = useState(genderOptions[0]);
  const [patientGenderOpen, setPatientGenderOpen] = useState(false);
  const [guardianGenderOpen, setGuardianGenderOpen] = useState(false);
  const [activePatientGuardian, setActivePatientGuardian] = useState("Yes");
  const [consentChecked, setConsentChecked] = useState(false);
  const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = useState(
    DEFAULT_COUNTRY_CODE
  );

  const {screenSize} = GlobalHookWindowSummary();

  const watchedValues = watch();
  const watchedDateOfBirth = watch("dateOfBirth");
  const watchedGuardianDateOfBirth = watch("guardianDateOfBirth");
  const hasHydratedRef = useRef(false);
  const lastDraftRef = useRef("");
  const patientGenderRef = useRef(null);
  const guardianGenderRef = useRef(null);

  const showGuardianIdentityFields = activePatientGuardian !== "No";

  useOnClickOutside(patientGenderRef, () => setPatientGenderOpen(false));
  useOnClickOutside(guardianGenderRef, () => setGuardianGenderOpen(false));

  useEffect(() => {
    if (hasHydratedRef.current) return;

    const savedData =
      confirmationData?.source === "for someone else"
        ? confirmationData?.formData
        : appointmentData;

    if (!savedData || Object.keys(savedData).length === 0) {
      setValue("gender", patientGender);
      setValue("guardianGender", guardianGender);
      setActivePatientGuardian("Yes");
      setForSomeoneElseConsent(false);
      hasHydratedRef.current = true;
      return;
    }

    setValue("firstName", savedData.firstName || "");
    setValue("dateOfBirth", savedData.dateOfBirth || "");
    setValue("lastName", savedData.lastName || "");
    setValue("pesel", savedData.pesel || "");
    setValue("guardianFirstName", savedData.guardianFirstName || "");
    setValue("guardianLastName", savedData.guardianLastName || "");
    setValue("guardianPesel", savedData.guardianPesel || "");
    setValue("guardianDateOfBirth", savedData.guardianDateOfBirth || "");
    setValue("email", savedData.email || "");
    const parsedPhone = splitPhoneByCountryCode(savedData.phoneNumber || "");
    setSelectedPhoneCountryCode(parsedPhone.countryCode);
    setValue("phoneNumber", parsedPhone.localNumber || "");
    setValue("phoneNumberCountryCode", parsedPhone.countryCode);
    setValue("city", savedData.city || "");
    setValue("address", savedData.address || "");
    setValue("comment", savedData.comment || "");
    setValue("consent", !!savedData.consent);

    const normalizedPatientGender = normalizeGender(savedData.gender);
    const normalizedGuardianGender = normalizeGender(savedData.guardianGender);
    setPatientGender(normalizedPatientGender);
    setGuardianGender(normalizedGuardianGender);
    setValue("gender", normalizedPatientGender);
    setValue("guardianGender", normalizedGuardianGender);
    setActivePatientGuardian(savedData.activePatientGuardian || "Yes");
    setConsentChecked(!!savedData.consent);
    setForSomeoneElseConsent(!!savedData.consent);
    hasHydratedRef.current = true;
  }, [
    appointmentData,
    confirmationData,
    guardianGender,
    patientGender,
    setForSomeoneElseConsent,
    setValue,
  ]);

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
    setAppPage("appointment information mobile");
  };

  return (
    <div>
      <section className="mobileBG h-[100px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-[calc(100%-30px)] mx-auto">
            <p className="text-[24px] text-white text-center leading-normal">
              {t("who_are_you_scheduling_for", "Who are you scheduling for?")}
            </p>
            <img
              onClick={() => {
                setAppPage("for who mobile");
              }}
              className="absolute top-[6px] left-0 h-[16px] w-[16px]"
              src={chevronLeft}
            />
          </div>
        </div>
      </section>
      <section>
        <form
          className={`flex flex-col pt-[18px] items-center gap-[0px] px-[16px] [&>div]:mb-4 [&>div]:gap-1 ${screenSize < 768 ? '' : '[&>div]:max-w-[800px]'}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <SectionTitle text={t("patient_details_short", "Patient details")} />

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
            value={patientGender}
            onChange={(value) => {
              setPatientGender(value);
              setValue("gender", value, { shouldValidate: true });
            }}
            options={genderOptions.map((option) => ({
              value: option,
              label: getGenderLabel(t, option),
            }))}
            error={errors?.gender?.message}
            open={patientGenderOpen}
            setOpen={setPatientGenderOpen}
            dropdownRef={patientGenderRef}
          />
          <input
            type="hidden"
            {...register("gender", { required: t("field_required", "Field is required") })}
            value={patientGender}
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

          <SectionTitle text={t("booking_person", "Booking person")} />

          <InputField
            label={t("first_name", "First Name *")}
            id="guardianFirstName"
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
            id="guardianLastName"
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
            value={guardianGender}
            onChange={(value) => {
              setGuardianGender(value);
              setValue("guardianGender", value, { shouldValidate: true });
            }}
            options={genderOptions.map((option) => ({
              value: option,
              label: getGenderLabel(t, option),
            }))}
            error={errors?.guardianGender?.message}
            open={guardianGenderOpen}
            setOpen={setGuardianGenderOpen}
            dropdownRef={guardianGenderRef}
          />
          <input
            type="hidden"
            {...register("guardianGender", { required: t("field_required", "Field is required") })}
            value={guardianGender}
          />

          <div className="w-full max-w-[340px] flex flex-col gap-2">
            <div className="text-[14px] text-[#5E5E5E] font-medium">
              {t(
                "are_you_parent_guardian",
                "Are you the parent or legal guardian of the patient?"
              )}
            </div>
            <div className="flex gap-[16px] text-[14px] text-[#111113]">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="guardianRadio"
                  checked={activePatientGuardian === "Yes"}
                  onChange={() => setActivePatientGuardian("Yes")}
                />
                {t("yes", "Yes")}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="guardianRadio"
                  checked={activePatientGuardian === "No"}
                  onChange={() => setActivePatientGuardian("No")}
                />
                {t("no", "No")}
              </label>
            </div>
          </div>

          {showGuardianIdentityFields && (
            <>
              <InputField
                label={t("passport_pesel_required", "Passport/pesel")}
                id="guardianPesel"
                placeholder={t("enter_passport_pesel", "Enter passport/pesel")}
                register={register}
                errors={errors}
              />
              <DateInputField
                label={t("date_of_birth_required", "Date of Birth *")}
                id="guardianDateOfBirth"
                placeholder={t("enter_date_of_birth", "Enter date of birth")}
                register={register}
                errors={errors}
                rules={{ required: t("select_date", "Select date") }}
                valuePresent={Boolean(watchedGuardianDateOfBirth)}
              />
            </>
          )}

          <SectionTitle text={t("contact_information", "Contact Information")} />

          <PhoneNumberField
            label={t("phone_number", "Phone Number *")}
            widthClass="w-full max-w-[340px]"
            phoneFieldName="phoneNumber"
            countryFieldName="phoneNumberCountryCode"
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

          <div className="w-full max-w-[340px] text-[14px] text-[#5E5E5E]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("consent", {
                  required: t("consent_required", "Consent is required"),
                })}
                checked={consentChecked}
                onChange={(event) => {
                  setConsentChecked(event.target.checked);
                  setForSomeoneElseConsent(event.target.checked);
                  setValue("consent", event.target.checked, { shouldValidate: true });
                }}
              />
              {t("consent_label_prefix", "By leaving checked, I agree with the")} {""}
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

          <div className="w-full max-w-[340px] flex flex-col relative">
            <div className="text-[14px] text-[#5E5E5E] font-medium">
              {t("comments_optional", "Comments or special requests")}
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

const SectionTitle = ({ text }) => (
  <div className="w-full max-w-[340px] !mt-3 !mb-2 text-[16px] font-semibold text-[#30343F]">
    {text}
  </div>
);

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

export default GuardianExactInformation;
