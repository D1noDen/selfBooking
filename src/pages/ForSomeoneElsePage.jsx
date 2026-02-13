import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import SelfBookingStore from "../store/SelfBookingStore";
import { useOnClickOutside } from "./helpers/helpers";

const genderOptions = ["Male", "Female", "Other"];
const emailRegExp =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
const phoneRegExp = /^\+?[0-9]{9,15}$/;

const ForSomeoneElsePage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "all" });

  const [patientGender, setPatientGender] = useState(genderOptions[0]);
  const [guardianGender, setGuardianGender] = useState(genderOptions[0]);
  const [showPatientGender, setShowPatientGender] = useState(false);
  const [showGuardianGender, setShowGuardianGender] = useState(false);
  const [activePatientGuardian, setActivePatientGuardian] = useState("Yes");
  const [consentChecked, setConsentChecked] = useState(false);

  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setAppointmentData = SelfBookingStore((state) => state.setAppointmentData);
  const appointmentData = SelfBookingStore((state) => state.appointmentData);
  const setConfirmationData = SelfBookingStore((state) => state.setConfirmationData);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const setForSomeoneElseConsent = SelfBookingStore((state) => state.setForSomeoneElseConsent);

  const patientGenderRef = useRef(null);
  const guardianGenderRef = useRef(null);
  const isGuardianDisabled = activePatientGuardian === "No";

  useOnClickOutside(patientGenderRef, () => setShowPatientGender(false));
  useOnClickOutside(guardianGenderRef, () => setShowGuardianGender(false));

  useEffect(() => {
    if (!appointmentData) return;

    if (Object.keys(appointmentData).length === 0) {
      setValue("gender", patientGender);
      setValue("guardianGender", guardianGender);
      setActivePatientGuardian("Yes");
      setForSomeoneElseConsent(false);
      return;
    }

    setValue("firstName", appointmentData.firstName || "");
    setValue("dateOfBirth", appointmentData.dateOfBirth || "");
    setValue("lastName", appointmentData.lastName || "");
    setValue("guardianFirstName", appointmentData.guardianFirstName || "");
    setValue("guardianLastName", appointmentData.guardianLastName || "");
    setValue("guardianDateOfBirth", appointmentData.guardianDateOfBirth || "");
    setValue("email", appointmentData.email || "");
    setValue("phoneNumber", appointmentData.phoneNumber || "");
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
  }, []);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      gender: patientGender,
      guardianGender,
      activePatientGuardian,
      consent: consentChecked,
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
      <div className="bg-white rounded-[10px] p-6 overflow-auto shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] h-[calc(100vh-200px)]">
        <div className="text-[24px] font-sans text-[#333] font-semibold mb-1">
          Who are you scheduling for?
        </div>
        <div className="text-[16px] font-sans text-[#6A7282] mb-8">
          Please fill in the information below
        </div>

        <form
          id="for-someone-else-form"
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[1040px] mx-auto flex flex-wrap justify-between"
        >
          <SectionTitle text="Patient details" />
          <Field label="PESEL *" width="w-full">
            <Input
              register={register}
              id="pesel"
              placeholder="00000000"
              errors={errors}
              rules={{ required: "Field is required" }}
            />
          </Field>
          <Field label="First Name *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="firstName"
              placeholder="Abhijit"
              errors={errors}
              rules={{ required: "Field is required" }}
            />
          </Field>
          <Field label="Last Name *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="lastName"
              placeholder="Chatterjee"
              errors={errors}
              rules={{ required: "Field is required" }}
            />
          </Field>
          <Field label="Date of Birth *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="dateOfBirth"
              type="date"
              placeholder="dd.mm.yyyy"
              errors={errors}
              rules={{ required: "Select date" }}
            />
          </Field>
          <Field label="Gender *" width="w-[calc(50%-8px)]">
            <GenderDropdown
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
                Field is required
              </p>
            )}
          </Field>

          <SectionTitle text="Parent/Guardian details" />
          <Field label="First Name *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="guardianFirstName"
              placeholder="Abhijit"
              disabled={isGuardianDisabled}
              errors={errors}
              rules={{
                validate: (value) =>
                  isGuardianDisabled || value?.trim()
                    ? true
                    : "Field is required",
              }}
            />
          </Field>
          <Field label="Last Name *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="guardianLastName"
              placeholder="Chatterjee"
              disabled={isGuardianDisabled}
              errors={errors}
              rules={{
                validate: (value) =>
                  isGuardianDisabled || value?.trim()
                    ? true
                    : "Field is required",
              }}
            />
          </Field>
          <Field label="Date of Birth *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="guardianDateOfBirth"
              type="date"
              placeholder="dd.mm.yyyy"
              disabled={isGuardianDisabled}
              errors={errors}
              rules={{
                validate: (value) =>
                  isGuardianDisabled || value ? true : "Select date",
              }}
            />
          </Field>
          <Field label="Gender *" width="w-[calc(50%-8px)]">
            <GenderDropdown
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
                  isGuardianDisabled || value ? true : "Field is required",
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
              Are you the parent or legal guardian of the patient?
            </div>
            <label className="flex items-center gap-2 text-[15px] font-sans text-[#333333]">
              <input type="radio" name="guardianRadio" checked={activePatientGuardian === "Yes"} onChange={() => setActivePatientGuardian("Yes")} />
              Yes
            </label>
            <label className="flex items-center gap-2 text-[15px] font-sans text-[#333333]">
              <input type="radio" name="guardianRadio" checked={activePatientGuardian === "No"} onChange={() => setActivePatientGuardian("No")} />
              No
            </label>
          </div>

          <SectionTitle text="Contact Information" />
          <Field label="Email *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="email"
              placeholder="svitlanatyshchenko95@gmail.com"
              errors={errors}
              rules={{
                required: "Field is required",
                pattern: { value: emailRegExp, message: "Enter valid email" },
              }}
            />
          </Field>
          <Field label="Phone Number *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="phoneNumber"
              placeholder="+380608484004"
              errors={errors}
              rules={{
                required: "Field is required",
                pattern: { value: phoneRegExp, message: "Phone must be 9-15 digits" },
              }}
            />
          </Field>
          <Field label="City *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="city"
              placeholder="tyu7fg"
              errors={errors}
              rules={{ required: "Field is required" }}
            />
          </Field>
          <Field label="Address *" width="w-[calc(50%-8px)]">
            <Input
              register={register}
              id="address"
              placeholder="hbhj 65"
              errors={errors}
              rules={{ required: "Field is required" }}
            />
          </Field>

          <div className="w-full mb-6 text-[15px] font-sans text-[#5A6172]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("consent", { required: true })}
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked);
                  setForSomeoneElseConsent(e.target.checked);
                  setValue("consent", e.target.checked, { shouldValidate: true });
                }}
              />
              By leaving checked, I agree with the <span className="text-[#6A6DE8] underline">Calling Consent</span>
            </label>
            {errors?.consent && (
              <p className="mt-1 text-red-500 text-[12px]/[14px]">
                Consent is required
              </p>
            )}
          </div>

          <SectionTitle text="Other details" />
          <div className="w-full mb-3 text-[15px] font-sans text-[#4E5565]">
            Comments or special requests <span className="text-[#95A0B5]">Optional</span>
          </div>
          <textarea
            className="w-full h-[86px] border border-[#D8DBE2] rounded-[8px] px-4 py-3 text-[15px] font-sans text-[#4E5565] mb-4"
            placeholder="Any additional information or special requirements..."
            {...register("comment")}
          />
          <div className="w-full text-[15px] font-sans text-[#7A8294] mb-6">
            For Emergency Consultation Appointments, please provide us with more information regarding your appointment request
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
  <div className={`${width} mb-[22px]`}>
    <div className="text-[15px]/[18px] text-[#333] font-sans font-[500] tracking-[0.675px] mb-[2px]">
      {label}
    </div>
    {children}
  </div>
);

const Input = ({ register, id, placeholder, type = "text", disabled = false, errors, rules = {} }) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-[12px] py-[8px] border-[2px] border-[#E8E8E9] rounded-[10px] text-[15px]/[18px] text-[#333] font-sans tracking-[0.675px] ${
        disabled ? "bg-[#F0F2F6] text-[#A4ABBC] cursor-not-allowed" : "bg-white"
      }`}
      {...register(id, rules)}
    />
    {errors?.[id] && (
      <p className="absolute -bottom-[18px] left-1 text-red-500 text-[12px]/[14px]">
        {errors[id]?.message || "Field is required"}
      </p>
    )}
  </div>
);

const GenderDropdown = ({ value, open, setOpen, onSelect, dropdownRef, disabled = false }) => (
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
    <span className={`${open ? "rotate-180" : ""} duration-200`}>v</span>
    {open && !disabled && (
      <div className="absolute top-[48px] left-0 w-full z-20 border border-[#D8DBE2] rounded-[8px] bg-white overflow-hidden">
        {genderOptions.map((item) => (
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
