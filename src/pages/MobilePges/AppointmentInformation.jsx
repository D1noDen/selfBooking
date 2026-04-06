import { useMemo, useState, useEffect } from "react";
import moment from "moment";
import SelfBookingStore from "../../store/SelfBookingStore";
import useAuth from "../../store/useAuth";
import { submit_Draft, get_Clinic_Info } from "../request/requestSelfBooking";
import { dateHelper } from "../helpers/dateHelper";
import Spinner from "../helpers/Spinner";
import { getBookingInformation } from "../../helpers/bookingStorage";
import { useAppTranslation } from "../../i18n/useAppTranslation";
import { getLocalizedVisitTypeLabel } from "../../i18n/visitTypeLabel";
import { getGenderLabel, normalizeGender } from "../../i18n/gender";
import RecaptchaModal from "../components/RecaptchaModal";
import { formatDateForDisplay } from "../../helpers/dateFormat";

import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";
import WithoutAvatar from "../../assets/images/svg/NoAvatar.svg";

const formatBirthDateForApi = (value) => {
  if (!value || typeof value !== "string") return "";
  const rawValue = value.trim();
  if (!rawValue) return "";

  const normalizedIsoDate = moment(rawValue, "YYYY-MM-DD", true);
  if (normalizedIsoDate.isValid()) return normalizedIsoDate.format("YYYY-MM-DD");

  const dateTimeIso = moment(rawValue, moment.ISO_8601, true);
  if (dateTimeIso.isValid()) return dateTimeIso.format("YYYY-MM-DD");

  const localizedDate = moment(
    rawValue,
    ["DD.MM.YYYY", "D.M.YYYY", "DD/MM/YYYY", "D/M/YYYY"],
    true
  );
  if (localizedDate.isValid()) return localizedDate.format("YYYY-MM-DD");

  return "";
};

const generateIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const AppointmentInformation = () => {
  const { t, language } = useAppTranslation();
  const momentLocale = language === "uk" ? "uk" : language === "pl" ? "pl" : "en";
  moment.locale(momentLocale);
  const { auth, setAuth } = useAuth();
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const confirmationData = SelfBookingStore((state) => state.confirmationData);
  const setConfirmationData = SelfBookingStore((state) => state.setConfirmationData);
  const setAppointmentData = SelfBookingStore((state) => state.setAppointmentData);
  const setForSomeoneElseConsent = SelfBookingStore(
    (state) => state.setForSomeoneElseConsent
  );
  const setFlashMessage = SelfBookingStore((state) => state.setFlashMessage);

  const bookingInfo = useMemo(() => getBookingInformation(), []);
  const data = confirmationData?.formData || {};
  const source = confirmationData?.source || "for user";
  const isForSomeoneElse = source === "for someone else";

  const appointmentStart = dateHelper(bookingInfo?.doctor?.eventStartDateTime);
  const appointmentEnd = dateHelper(bookingInfo?.doctor?.eventEnd);
  const startMoment = moment(appointmentStart);
  const endMoment = moment(appointmentEnd);
  const duration = endMoment.diff(startMoment, "minutes");
  const formattedStartDate = startMoment.isValid() ? startMoment.format("HH:mm") : "-";
  const formattedEndDate = endMoment.isValid() ? endMoment.format("HH:mm") : "-";

  const patientDateOfBirthForApi = formatBirthDateForApi(data.dateOfBirth);
  const contactPersonDateOfBirthForApi = formatBirthDateForApi(
    data.guardianDateOfBirth
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const { data: clinicInfoData, setText: loadClinicInfo } = get_Clinic_Info();

  const { mutate: submitDraft } = submit_Draft();

  const handleInvalidToken = () => {
    setAuth(null);
    setHeaderPage(0);
    setAppPage(window.innerWidth < 1024 ? "visit type mobile" : "visit type");
    setFlashMessage(
      t(
        "invalid_booking_link",
        "Your booking link is invalid or has expired. Please start over."
      )
    );
  };

  useEffect(() => {
    if (auth) {
      loadClinicInfo(auth);
    }
  }, [auth, loadClinicInfo]);

  const clinicInfo = clinicInfoData?.data?.result || {};

  const submitWithCaptcha = (captchaToken) => {
    if (!auth || !data) return;
    const idempotencyKey = generateIdempotencyKey();
    const relationshipType =
      data.activePatientGuardian === "Yes" ? 1 : 3;

    const patient = {
      title: "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: source === "for user" ? data.email || "" : "",
      cellPhone: source === "for user" ? data.cellPhone || data.phoneNumber || "" : "",
      businessPhone: "",
      nip: "",
      mailingStreet: data.address || "",
      mailingHouseNumber: "",
      mailingCity: data.city || "",
      mailingRegion: "",
      mailingZipCode: "",
      mailingCountry: "",
      isBlackListed: false,
      dateOfBirth: patientDateOfBirthForApi || "",
      gender: normalizeGender(data.gender),
      pesel: data.pesel || "",
      maidenName: "",
      nationality: "",
      allergies: [],
      phobias: [],
      notes: data.comment || "",
      patientTypeId: 0,
      primaryDoctorId: 0,
      lastVisitDate: null,
      billingStreet: data.address || "",
      billingHouseNumber: "",
      billingCity: data.city || "",
      billingRegion: "",
      billingZipCode: "",
      billingCountry: "",
      isVip: false,
      isDifficult: false,
      isDeposit: false,
      communicationLanguage: "",
      patientDiscountId: 0,
      referralReversalId: 0,
      patientGuardianId: 0,
      isChild: false,
      patientChildId: 0,
      patientParentId: 0,
    };

    const appointment = {
      companyId: clinicInfo?.companyId || bookingInfo?.companyId,
      clinicId: clinicInfo?.clinicId || bookingInfo?.clinicId,
      eventStartDateTime: appointmentStart,
      eventEndDateTime: appointmentEnd,
      appointmentDescription: data.comment || "",
      appointmentTypeId: bookingInfo?.apoimentTypeId?.id || 0,
      cabinetId: bookingInfo?.doctor?.cabinetId || 0,
      userId: bookingInfo?.doctor?.id || 0,
      patientId: 0,
      patientContactPersonId: 0,
    };

    const contactPerson = isForSomeoneElse
      ? {
          linkedToPatientId: 0,
          isPatinet: false,
          patientId: 0,
          firstName: data.guardianFirstName || "",
          lastName: data.guardianLastName || "",
          email: data.email || "",
          cellPhone: data.phoneNumber || "",
          gender: normalizeGender(data.guardianGender),
          pesel: data.guardianPesel || "",
          dateOfBirth: contactPersonDateOfBirthForApi
            ? contactPersonDateOfBirthForApi
            : null,
          title: "",
          relationshipType,
          mailingStreet: data.address || "",
          mailingHouseNumber: "",
          mailingCity: data.city || "",
          mailingRegion: "",
          mailingZipCode: "",
          mailingCountry: "",
        }
      : null;

    const payload = {
      idempotencyKey,
      captchaToken,
      patient,
      appointment,
      ...(contactPerson ? { contactPerson } : {}),
    };

    submitDraft(
      {
        data: payload,
        token: auth,
      },
      {
        onSuccess: () => {
          setConfirmationData(null);
          setAppointmentData({});
          setForSomeoneElseConsent(false);
          setHeaderPage(4);
          setAppPage("complete mobile");
        },
        onError: (error) => {
          if (error?.response?.status === 404) {
            setIsSubmitting(false);
            handleInvalidToken();
            return;
          }
          setIsSubmitting(false);
        },
      }
    );
  };

  const onConfirm = () => {
    if (!auth || !data || isSubmitting) return;
    if (!recaptchaSiteKey) {
      setIsSubmitting(true);
      submitWithCaptcha(null);
      return;
    }
    setShowCaptcha(true);
  };

  const visitTypeLabel =
    getLocalizedVisitTypeLabel(
      bookingInfo?.apoimentTypeId || {
        label: bookingInfo?.apoimentTypeId?.label || bookingInfo?.apoimentTypeId?.lebel,
      },
      language
    ) ||
    bookingInfo?.apoimentTypeId?.label ||
    bookingInfo?.apoimentTypeId?.lebel ||
    "-";

  return (
    <div>
      {isSubmitting && <Spinner />}
      <RecaptchaModal
        open={showCaptcha}
        siteKey={recaptchaSiteKey}
        onClose={() => setShowCaptcha(false)}
        onVerify={(token) => {
          setShowCaptcha(false);
          setIsSubmitting(true);
          submitWithCaptcha(token);
        }}
      />
      <section className="mobileBG h-[75px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-full max-w-[calc(100%-30px)] mx-auto">
            <p className="text-[24px] text-white text-center leading-normal">
              {t("confirm_appointment_title", "Confirm your appointment")}
            </p>
            <img
              className="absolute top-[10px] left-0 h-[16px] w-[16px]"
              onClick={() => {
                if (confirmationData?.formData) {
                  setAppointmentData(confirmationData.formData);
                }
                setAppPage(
                  source === "for someone else"
                    ? "for someone else guardian mobile"
                    : "for patient mobile"
                );
              }}
              src={chevronLeft}
            />
          </div>
        </div>
      </section>
      <section className="pt-[12px] px-[16px]">
        <div className="flex gap-[12px] py-[17px] border-b border-b-solid border-b-[#0000001f]">
          <img
            className="h-[70px] w-[70px] rounded-[50%]"
            src={bookingInfo?.doctor?.profilePicture || WithoutAvatar}
            alt="Doctor"
          />
          <div className="flex flex-col justify-center">
            <p className="text-[20px] text-[#3F4455] font-medium">
              {bookingInfo?.doctor?.name || "-"}
            </p>
            <p className="text-[16px] text-[#7D749E] font-medium">
              {bookingInfo?.doctor?.speciality || "-"}
            </p>
          </div>
        </div>

        <div className="py-[16px] flex flex-col gap-[12px] border-b border-b-solid border-b-[#0000001f]">
          <p className="text-[18px] font-medium text-[#7C67FF]">
            {t("appointment_details", "Appointment Details")}
          </p>
          <div className="w-full text-[14px] flex flex-col gap-[12px]">
            <Row label={t("visit_type_label", "Visit Type")} value={visitTypeLabel} />
            <Row
              label={t("location", "Location")}
              value={clinicInfo?.clinicAddress || "-"}
            />
            <Row
              label={t("date_time", "Date & Time")}
              value={
                appointmentStart
                  ? `${formatDateForDisplay(appointmentStart) || "-"} ${formattedStartDate} - ${formattedEndDate}`
                  : "-"
              }
            />
            <Row label={t("doctor", "Doctor")} value={bookingInfo?.doctor?.name || "-"} />
          </div>
        </div>

        <div className="py-[16px] flex flex-col gap-[12px] border-b border-b-solid border-b-[#0000001f]">
          <p className="text-[18px] font-medium text-[#7C67FF]">
            {isForSomeoneElse
              ? t("patient_details", "Patient Details")
              : t("your_details", "Your Details")}
          </p>
          <div className="w-full text-[14px] flex flex-col gap-[12px]">
            <Row
              label={t("full_name", "Full Name")}
              value={`${data.firstName || ""} ${data.lastName || ""}`.trim() || "-"}
            />
            <Row label={t("pesel", "PESEL")} value={data.pesel || "-"} />
            <Row
              label={t("date_of_birth", "Date of Birth")}
              value={formatDateForDisplay(data.dateOfBirth) || data.dateOfBirth || "-"}
            />
            <Row label={t("email", "Email")} value={data.email || "-"} />
            <Row
              label={t("phone", "Phone")}
              value={data.cellPhone || data.phoneNumber || "-"}
            />
          </div>
        </div>

        {isForSomeoneElse &&
          (data.guardianFirstName || data.guardianLastName || data.guardianDateOfBirth) && (
            <div className="py-[16px] flex flex-col gap-[12px] border-b border-b-solid border-b-[#0000001f]">
              <p className="text-[18px] font-medium text-[#7C67FF]">
                {data.activePatientGuardian === "No"
                  ? t("contact_person_details", "Contact person details")
                  : t("patient_guardian_parent", "Patient guardian/Parent")}
              </p>
              <div className="w-full text-[14px] flex flex-col gap-[12px]">
                <Row
                  label={t("full_name", "Full Name")}
                  value={`${data.guardianFirstName || ""} ${data.guardianLastName || ""}`.trim() || "-"}
                />
                <Row
                  label={t("date_of_birth", "Date of Birth")}
                  value={
                    formatDateForDisplay(data.guardianDateOfBirth) ||
                    data.guardianDateOfBirth ||
                    "-"
                  }
                />
                <Row
                  label={t("gender", "Gender")}
                  value={getGenderLabel(t, data.guardianGender) || "-"}
                />
                <Row
                  label={t("relation", "Relation")}
                  value={
                    data.activePatientGuardian === "No"
                      ? t("not_guardian", "Not guardian")
                      : t("guardian", "Guardian")
                  }
                />
              </div>
            </div>
          )}

        <div className="py-[16px] flex flex-col gap-[12px] border-b border-b-solid border-b-[#0000001f]">
          <p className="text-[18px] font-medium text-[#7C67FF]">
            {t("clinic_location", "Clinic Location")}
          </p>
          <div className="w-full text-[14px] flex flex-col gap-[12px]">
            <Row label={t("clinic_name", "Clinic")} value={clinicInfo?.clinicName || "-"} />
            <Row label={t("address", "Address")} value={clinicInfo?.clinicAddress || "-"} />
          </div>
        </div>

        <div className="w-full flex flex-wrap gap-[12px] mb-[10px] mt-4">
          <button
            onClick={onConfirm}
            className="w-full h-[44px] font-medium rounded-[12px] bg-[#7C67FF] text-white"
            disabled={isSubmitting}
          >
            {t("confirm_appointment", "Confirm Appointment")}
          </button>
          <button
            onClick={() => {
              if (confirmationData?.formData) {
                setAppointmentData(confirmationData.formData);
              }
              setAppPage(
                source === "for someone else"
                  ? "for someone else guardian mobile"
                  : "for patient mobile"
              );
            }}
            className="w-full h-[44px] font-medium rounded-[12px] border border-solid border-[#7C67FF] bg-white text-[#7C67FF]"
            disabled={isSubmitting}
          >
            {t("edit_details", "Edit Details")}
          </button>
        </div>
      </section>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <p className="text-[#B1B1B1]">{label}</p>
    <p className="text-[#111113] text-right break-words">{value || "-"}</p>
  </div>
);

export default AppointmentInformation;
