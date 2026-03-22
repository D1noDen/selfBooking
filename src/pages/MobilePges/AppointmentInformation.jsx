import SelfBookingStore from "../../store/SelfBookingStore";
import moment from "moment";
import { get_Doctor_By_Type_Id } from "../request/requestSelfBooking";
import { useEffect, useState } from "react";
import { dateHelper } from "../helpers/dateHelper";
//import useAuth from "../../../Routes/useAuth";
import useAuth from "../../store/useAuth";
import {
  submit_Draft,
} from "../request/requestSelfBooking";

import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";
import WithoutAvatar from "../../assets/images/svg/NoAvatar.svg";
import Spinner from "../helpers/Spinner";
import { getBookingInformation } from "../../helpers/bookingStorage";
import { getLocalizedVisitTypeLabel } from "../../i18n/visitTypeLabel";
import RecaptchaModal from "../components/RecaptchaModal";

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

const AppointmentInformation = () => {
  const {auth} = useAuth();
  const informationWithSorage = getBookingInformation() || {};
  const storedAppointmentTypeId = informationWithSorage?.apoimentTypeId?.id || null;
  const {
    data: GetDoctorByTypeIdData,
    isLoading: GetDoctorByTypeIdLoading,
    setText: GetDoctorByTypeIdInformation,
  } = get_Doctor_By_Type_Id();
// const auth = {
//     clinicId: 1,
//     companyId: "4b731791-d6f4-4f46-7363-08db9ce8963d",
//   }
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const guardianInfo = SelfBookingStore((state) => state.guardianInfo);
  const patientInfo = SelfBookingStore((state) => state.patientInfo);
  const appointmentTime = SelfBookingStore((state) => state.appointmentTime);
 
  const [doctor, setDoctor] = useState([]);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [pendingSubmitPayload, setPendingSubmitPayload] = useState(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const chosenDoctor = SelfBookingStore((state) => state.chosenDoctor);
console.log("informationWithSorage", informationWithSorage);
  const guardianIsParent =
    guardianInfo?.isParent === true || guardianInfo?.isParent === "true";
  const bookingForLabel =
    Object.keys(guardianInfo).length > 0
      ? guardianIsParent
        ? "Child"
        : "Adult"
      : "Self";
  const visitTypeLabel =
    getLocalizedVisitTypeLabel(informationWithSorage?.apoimentTypeId, "en") ||
    informationWithSorage?.apoimentTypeId?.label ||
    informationWithSorage?.apoimentTypeId?.lebel ||
    "-";
  let start = moment(
    dateHelper(informationWithSorage.doctor?.eventStartDateTime)
  );
  let end = moment(dateHelper(informationWithSorage?.doctor?.eventEnd));
  const duration = end.diff(start, "minutes");
  const formattedStartDate = start.format("HH:mm");
  const formattedEndDate = end.format("HH:mm");

  const newStartDate = dateHelper(
    informationWithSorage.doctor?.eventStartDateTime
  );
  const newEndDate = dateHelper(informationWithSorage?.doctor?.eventEnd);
  const patientDateOfBirthForApi = formatBirthDateForApi(patientInfo.dateOfBirth);
  const contactPersonDateOfBirthForApi = formatBirthDateForApi(guardianInfo.dateOfBirth);

  const calcAge = (birthdate) => {
    let birthdateObj = new Date(birthdate);
    let currentDate = new Date();
    let age = currentDate.getFullYear() - birthdateObj.getFullYear();
    if (
      currentDate.getMonth() < birthdateObj.getMonth() ||
      (currentDate.getMonth() === birthdateObj.getMonth() &&
        currentDate.getDate() < birthdateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    if (!storedAppointmentTypeId) {
      setAppPage("visit type mobile");
      return;
    }
    if (informationWithSorage) {
      GetDoctorByTypeIdInformation({
          bookingToken:auth,
        appointmentTypeId: storedAppointmentTypeId,
      });
    }
  }, [auth, storedAppointmentTypeId, setAppPage]);

  useEffect(() => {
    if (GetDoctorByTypeIdData) {
      const filteredDoctors = GetDoctorByTypeIdData.data.result.filter(
        (item) => item.userId === chosenDoctor.id
      );
      setDoctor(filteredDoctors);
    }
  }, [GetDoctorByTypeIdData]);

  const {
    mutate: submitDraft,
    isLoading: submitDraftLoading,
  } = submit_Draft();

  const generateIdempotencyKey = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const handleSubmitDraft = () => {
    const hasGuardian = Object.keys(guardianInfo).length > 0;
    const captchaToken = null;
    const idempotencyKey = generateIdempotencyKey();
    const relationshipType = guardianIsParent ? "Parent" : "LegalGuardian";

    const patient = {
      title: "",
      firstName: patientInfo.firstName || "",
      lastName: patientInfo.lastName || "",
      email: patientInfo.email || "",
      cellPhone: patientInfo.phoneNumber || "",
      businessPhone: "",
      nip: "",
      mailingStreet: "",
      mailingHouseNumber: "",
      mailingCity: "",
      mailingRegion: "",
      mailingZipCode: "",
      mailingCountry: "",
      isBlackListed: false,
      dateOfBirth: patientDateOfBirthForApi || "",
      gender: patientInfo.gender || patientInfo.Gender || "",
      pesel: patientInfo.pesel || "",
      maidenName: "",
      nationality: "",
      allergies: [],
      phobias: [],
      notes: patientInfo.comments || "",
      patientTypeId: 0,
      primaryDoctorId: 0,
      lastVisitDate: null,
      billingStreet: patientInfo.adress || "",
      billingHouseNumber: "",
      billingCity: patientInfo.city || "",
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
      eventStartDateTime: newStartDate,
      eventEndDateTime: newEndDate,
      appointmentDescription: patientInfo.comments || "",
      appointmentTypeId: informationWithSorage?.apoimentTypeId?.id || 0,
      userId: informationWithSorage?.doctor?.id || 0,
      cabinetId: informationWithSorage?.doctor?.cabinetId || 0,
      patientId: 0,
      patientContactPersonId: 0,
    };

    const contactPerson = hasGuardian
      ? {
          linkedToPatientId: 0,
          isPatinet: false,
          patientId: 0,
          firstName: guardianInfo.firstName || "",
          lastName: guardianInfo.lastName || "",
          email: guardianInfo.email || "",
          cellPhone: guardianInfo.phoneNumber || "",
          gender: guardianInfo.gender || guardianInfo.Gender || "Other",
          pesel: guardianInfo.pesel || "",
          dateOfBirth: contactPersonDateOfBirthForApi || "",
          title: "",
          relationshipType,
          mailingStreet: guardianInfo.mailingStreet || "",
          mailingHouseNumber: guardianInfo.mailingHouseNumber || "",
          mailingCity: guardianInfo.mailingCity || "",
          mailingRegion: guardianInfo.mailingRegion || "",
          mailingZipCode: guardianInfo.mailingZipCode || "",
          mailingCountry: guardianInfo.mailingCountry || "",
        }
      : null;

    const submitPayload = {
      idempotencyKey,
      captchaToken,
      patient,
      appointment,
      ...(contactPerson ? { contactPerson } : {}),
    };

    if (!recaptchaSiteKey) {
      submitDraft(
        {
          data: submitPayload,
          token: auth,
        },
        {
          onSuccess: () => {
            setAppPage("complete mobile");
          },
          onError: (error) => {
            console.error("submitDraft error:", error);
          },
        }
      );
      return;
    }

    setPendingSubmitPayload(submitPayload);
    setShowCaptcha(true);
  };

  return (
    <div>
      {submitDraftLoading && <Spinner />}
      <RecaptchaModal
        open={showCaptcha}
        siteKey={recaptchaSiteKey}
        onClose={() => {
          setShowCaptcha(false);
          setPendingSubmitPayload(null);
        }}
        onVerify={(token) => {
          if (!pendingSubmitPayload) return;
          const payloadWithCaptcha = {
            ...pendingSubmitPayload,
            captchaToken: token,
          };
          setShowCaptcha(false);
          setPendingSubmitPayload(null);
          submitDraft(
            {
              data: payloadWithCaptcha,
              token: auth,
            },
            {
              onSuccess: () => {
                setAppPage("complete mobile");
              },
              onError: (error) => {
                console.error("submitDraft error:", error);
              },
            }
          );
        }}
      />
      <section className="mobileBG h-[75px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-full max-w-[290px]">
            <p className="text-[24px] text-white text-center leading-normal">
              Appointment information
            </p>
            <img
              className="absolute top-[10px] left-0 h-[16px] w-[16px]"
              onClick={() => {
                setAppPage("for patient mobile");
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
            src={doctor[0]?.profilePicture || WithoutAvatar}
          />
          <div className="flex flex-col justify-center">
            <p className="text-[20px] text-[#3F4455] font-medium">
              {doctor[0]?.firstName} {doctor[0]?.lastName}
            </p>
            <p className="text-[16px] text-[#7D749E] font-medium">
              {doctor[0]?.specializationLabel}
            </p>
          </div>
        </div>
        <div className="py-[16px] flex flex-col gap-[12px] border-b border-b-solid border-b-[#0000001f]">
          <p className="text-[18px] font-medium text-[#7C67FF]">
            Scheduled appointment
          </p>
          <div className="w-full text-[14px] flex flex-col gap-[12px]">
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Visit type</p>
              <p className="text-[#111113]">{visitTypeLabel}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Date</p>
              <p className="text-[#111113]">
                {moment(appointmentTime.eventStartDateTime).format(
                  "MMMM D, YYYY"
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Time</p>
              <p className="text-[#111113]">
                {formattedStartDate} - {formattedEndDate} ({duration} minutes)
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Booking for</p>
              <p className="text-[#111113]">{bookingForLabel}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Doctor</p>
              <p className="text-[#111113]">
                {doctor[0]?.firstName || informationWithSorage?.doctor?.name || "-"}{" "}
                {doctor[0]?.lastName || ""}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Specialty</p>
              <p className="text-[#111113]">
                {doctor[0]?.specializationLabel || informationWithSorage?.doctor?.speciality || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="py-[16px] flex flex-col gap-[12px] border-b border-b-solid border-b-[#0000001f]">
          <p className="text-[18px] font-medium text-[#7C67FF]">Patient Info</p>
          <div className="w-full text-[14px] flex flex-col gap-[12px]">
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Full name</p>
              <p className="text-[#111113]">
                {" "}
                {patientInfo.firstName} {patientInfo.lastName}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Gender</p>
              <p className="text-[#111113]">{patientInfo.Gender}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Date of birth</p>
              <p className="text-[#111113]">{patientInfo.dateOfBirth || "-"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Age</p>
              <p className="text-[#111113]">
                {calcAge(patientInfo.dateOfBirth)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">PESEL/PASSPORT</p>
              <p className="text-[#111113]">{patientInfo.pesel || "-"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Email</p>
              <p className="text-[#111113]">{patientInfo.email || "-"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Phone</p>
              <p className="text-[#111113]">{patientInfo.phoneNumber || "-"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">City</p>
              <p className="text-[#111113]">{patientInfo.city || "-"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Address</p>
              <p className="text-[#111113]">{patientInfo.adress || "-"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Problem</p>
              <p className="text-[#111113]">{patientInfo.problem || "-"}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Comments</p>
              <p className="text-[#111113]">{patientInfo.comments || "-"}</p>
            </div>
          </div>
        </div>
        {Object.keys(guardianInfo).length > 0 ? (
          <div className="py-[16px] flex flex-col gap-[12px] border-b border-b-solid border-b-[#0000001f]">
            <p className="text-[18px] font-medium text-[#7C67FF]">
              Guardian info
            </p>
            <div className="w-full text-[14px] flex flex-col gap-[12px]">
              <div className="flex justify-between">
                <p className="text-[#B1B1B1] ">Full name</p>
                <p className="text-[#111113]">
                  {guardianInfo.firstName} {guardianInfo.lastName}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#B1B1B1] ">Relation</p>
                <p className="text-[#111113]">
                  {guardianIsParent ? "Parent/Guardian" : "Not guardian"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#B1B1B1] ">PESEL/PASSPORT</p>
                <p className="text-[#111113]">{guardianInfo.pesel || "-"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#B1B1B1] ">Email</p>
                <p className="text-[#111113]">{guardianInfo.email || "-"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#B1B1B1] ">Phone</p>
                <p className="text-[#111113]">{guardianInfo.phoneNumber || "-"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#B1B1B1] ">Comments</p>
                <p className="text-[#111113]">{guardianInfo.comments || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="py-[16px] flex flex-col gap-[12px] border-b border-b-solid border-b-[#0000001f]">
          <p className="text-[18px] font-medium text-[#7C67FF]">
            Clinic details
          </p>
          <div className="w-full text-[14px] flex flex-col gap-[12px]">
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">City</p>
              <p className="text-[#111113]">Warsaw</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Street</p>
              <p className="text-[#111113]">Topiel,11</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Phone number</p>
              <p className="text-[#111113]">+4 822 542 184 </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Email</p>
              <p className="text-[#111113]">wdc@gmail.com</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            handleSubmitDraft();
          }}
          className="mt-[22px] w-full max-w-[340px] h-[44px] font-medium rounded-[12px] bg-[#7C67FF] text-white"
        >
          Book Appointment
        </button>
        <button
          onClick={() => {
            setAppPage("for patient mobile");
          }}
          className="mb-[10px] mt-[12px] w-full max-w-[340px] h-[44px] font-medium rounded-[12px] border border-solid border-[#7C67FF] bg-white text-[#7C67FF]"
        >
          Edit
        </button>
      </section>
    </div>
  );
};

export default AppointmentInformation;
