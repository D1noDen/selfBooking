import { useMemo, useState, useEffect } from "react";
import moment from "moment";
import SelfBookingStore from "../store/SelfBookingStore";
import useAuth from "../store/useAuth";
import {
  create_Booking,
  create_Contact_Person,
  create_Patient,
  get_Clinic_Info,
} from "./request/requestSelfBooking";
import { dateHelper } from "./helpers/dateHelper";
import Spinner from "./helpers/Spinner";
import { getBookingInformation } from "../helpers/bookingStorage";

const AppointmentConfirmationPage = () => {
  const { auth } = useAuth();
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const confirmationData = SelfBookingStore((state) => state.confirmationData);
  const setConfirmationData = SelfBookingStore((state) => state.setConfirmationData);
  const setAppointmentData = SelfBookingStore((state) => state.setAppointmentData);
  const setForSomeoneElseConsent = SelfBookingStore(
    (state) => state.setForSomeoneElseConsent
  );
  const widthBlock = SelfBookingStore((state) => state.widthBlock);

  const bookingInfo = useMemo(
    () => getBookingInformation(),
    []
  );
  const data = confirmationData?.formData || {};
  const source = confirmationData?.source || "for user";

  console.log('data', data)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: clinicInfoData, setText: loadClinicInfo } = get_Clinic_Info();

  const { mutate: createPatient } = create_Patient();
  const { mutate: createContactPerson } = create_Contact_Person();
  const { mutate: createBooking } = create_Booking();

  useEffect(() => {
    if (auth) {
      loadClinicInfo(auth);
    }
  }, [auth, loadClinicInfo]);

  const clinicInfo = clinicInfoData?.data?.result || {};

  const onConfirm = () => {
    if (!auth || !data || isSubmitting) return;
    setIsSubmitting(true);

    createPatient(
      {
        data: {
          companyId: auth.companyId,
          clinicId: auth.clinicId,
          title: "",
          firstName: data.firstName,
          lastName: data.lastName,
          email: source === "for user" ? data.email : "",
          cellPhone: source === "for user" ? data.cellPhone || data.phoneNumber : "",
          businessPhone: "",
          nip: "",
          isBlackListed: false,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          pesel: data.pesel || "",
          maidenName: "",
          nationality: "",
          allergies: [],
          phobias: [],
          notes: data.comment || "",
          patientTypeId: 0,
          primaryDoctorId: 0,
          lastVisitDate: "2023-11-10T17:29:20.219Z",
          billingStreet: data.address || "",
          billingHouseNumber: "",
          billingCity: data.city || "",
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
        token: auth,
      },
      {
        onSuccess: (patientRes) => {
          const patientId = patientRes?.data?.patientId;
          if (!patientId) {
            setIsSubmitting(false);
            return;
          }

          const finalizeBooking = (contactPersonId = null) => {
            const newStartDate = dateHelper(bookingInfo?.doctor?.eventStartDateTime);
            const newEndDate = dateHelper(bookingInfo?.doctor?.eventEnd);

            createBooking(
              {
                data: {
                  eventStartDateTime: newStartDate,
                  eventEndDateTime: newEndDate,
                  appointmentTypeId: bookingInfo?.apoimentTypeId?.id,
                  userId: bookingInfo?.doctor?.id,
                  cabinetId: bookingInfo?.doctor?.cabinetId,
                  patientContactPersonId: contactPersonId,
                  patientId,
                  appointmentDescription: data.comment || "",
                },
                token: auth,
              },
              {
                onSuccess: () => {
                  setConfirmationData(null);
                  setAppointmentData({});
                  setForSomeoneElseConsent(false);
                  setHeaderPage(4);
                  setAppPage("complete");
                },
                onError: () => setIsSubmitting(false),
              }
            );
          };

          if (source === "for someone else") {
            const usePatientAsGuardian = data.activePatientGuardian === "No";
            createContactPerson(
              {
                data: {
                  patientId,
                  firstName: usePatientAsGuardian
                    ? data.firstName
                    : data.guardianFirstName || data.firstName,
                  lastName: usePatientAsGuardian
                    ? data.lastName
                    : data.guardianLastName || data.lastName,
                  email: data.email || "",
                  cellPhone: data.phoneNumber || "",
                  gender: usePatientAsGuardian
                    ? data.gender
                    : data.guardianGender || data.gender,
                  pesel: data.pesel || "",
                  dateOfBirth: usePatientAsGuardian
                    ? data.dateOfBirth
                    : data.guardianDateOfBirth || data.dateOfBirth,
                  zipCode: "",
                  title: "",
                  contactPersonTypeId: 0,
                },
                token: auth,
              },
              {
                onSuccess: (contactRes) => {
                  const contactPersonId =
                    contactRes?.data?.patientContactPersonId ||
                    contactRes?.data?.contactPersonId ||
                    null;
                  finalizeBooking(contactPersonId);
                },
                onError: () => setIsSubmitting(false),
              }
            );
            return;
          }

          finalizeBooking(null);
        },
        onError: () => setIsSubmitting(false),
      }
    );
  };

  return (
    <div className="mx-auto" style={{ width: widthBlock }}>
      {isSubmitting && <Spinner />}
      <div className="bg-white rounded-[10px] text-[24px] text-[#333] font-sans p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]">
        <div className="text-[40px]/[46px] text-[#2F3441] font-semibold mb-1">
          Confirm your appointment
        </div>
        <div className="text-[16px] text-[#6A7282] mb-6">
          Please review all details before confirming
        </div>

        <div className='grid grid-cols-2 gap-[32px]'>
          <div className="flex flex-col gap-[32px]">
          <div className="rounded-[10px] p-4" style={{boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)"}}>
            <div className="text-[18px] font-sans text-[#101828] font-medium mb-3">
              Appointment Details
            </div>
            <div className="grid grid-cols-2 gap-y-3 text-[18px]/[24px]">
              <LabelValue label="Visit Type" value={bookingInfo?.apoimentTypeId?.lebel} />
              <LabelValue label="Location" value={clinicInfo?.clinicAddress} />
              <LabelValue label="Doctor" value={bookingInfo?.doctor?.name} />
              <LabelValue
                label="Date & Time"
                value={moment(
                  bookingInfo?.doctor?.eventStartDateTime,
                  "DD.MM.YYYY HH:mm:ss"
                ).format("ddd MMM DD, h:mm a")}
              />
            </div>
          </div>
          <div className="rounded-[10px] p-4" style={{boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)"}}>
          <div className="text-[18px] font-sans text-[#101828] font-medium mb-3">Your Details</div>
          <div className="grid grid-cols-2 gap-y-3 text-[18px]/[24px]">
            <LabelValue label="Full Name" value={`${data.firstName || ""} ${data.lastName || ""}`.trim()} />
            <LabelValue label="PESEL" value={data.pesel} />
            <LabelValue label="Email" value={data.email} />
            <LabelValue label="Phone" value={data.cellPhone || data.phoneNumber} />
          </div>
        </div>

        {source === "for someone else" &&
          (data.guardianFirstName || data.guardianLastName || data.guardianDateOfBirth) && (
            <div className="rounded-[10px] p-4" style={{boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)"}}>
              <div className="text-[18px] font-sans text-[#101828] font-medium mb-3">
                Parent/Guardian
              </div>
              <div className="grid grid-cols-2 gap-y-3 text-[18px]/[24px]">
                <LabelValue
                  label="Full Name"
                  value={`${data.guardianFirstName || ""} ${data.guardianLastName || ""}`.trim()}
                />
                <LabelValue label="Date of Birth" value={data.guardianDateOfBirth} />
                <LabelValue label="Gender" value={data.guardianGender} />
                <LabelValue
                  label="Relation"
                  value={data.activePatientGuardian === "No" ? "Not guardian" : "Guardian"}
                />
              </div>
            </div>
          )}
          </div>

          <div className="rounded-[10px] h-max p-4" style={{boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.05)"}}>
            <div className="text-[18px] font-sans text-[#101828] font-medium mb-3">
              Clinic Location
            </div>
            <div className="bg-[#F5F5FF] flex justify-start items-start rounded-[10px] p-[17px] mb-3 text-[16px]/[22px]">
              <div className="rounded-full w-[40px] h-[40px] bg-[#8380FF] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6666 8.33366C16.6666 12.4945 12.0508 16.8278 10.5008 18.1662C10.3564 18.2747 10.1806 18.3335 9.99992 18.3335C9.81925 18.3335 9.64348 18.2747 9.49909 18.1662C7.94909 16.8278 3.33325 12.4945 3.33325 8.33366C3.33325 6.56555 4.03563 4.86986 5.28587 3.61961C6.53612 2.36937 8.23181 1.66699 9.99992 1.66699C11.768 1.66699 13.4637 2.36937 14.714 3.61961C15.9642 4.86986 16.6666 6.56555 16.6666 8.33366Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 10.833C11.3807 10.833 12.5 9.71372 12.5 8.33301C12.5 6.9523 11.3807 5.83301 10 5.83301C8.61929 5.83301 7.5 6.9523 7.5 8.33301C7.5 9.71372 8.61929 10.833 10 10.833Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-[#2F3441] font-semibold">{clinicInfo?.clinicName || '-'}</div>
                <div className="text-[#6B7283]">{clinicInfo?.clinicAddress || "-"}</div>
                {/* <div
                  className="mt-3 flex items-center text-[#8380FF] text-[14px] font-sans font-medium gap-2 cursor-pointer"
                  onClick={() => {
                    const destination = encodeURIComponent(`${clinicInfo?.clinicName || ""} ${clinicInfo?.clinicAddress || ""}`.trim());
                    if (destination) {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "_blank");
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 7.33301L14.6667 1.33301L8.66667 13.9997L7.33333 8.66634L2 7.33301Z" stroke="#8380FF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Get Directions</span>
                </div> */}
              </div>
            </div>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=21.02241396903992%2C52.23806317354728%2C21.02595448493958%2C52.23953814682495&amp;layer=mapnik&marker=52.23880,21.02452"
              className="w-full h-[170px] rounded-[8px]"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-[40px]">
          <button
            type="button"
            className="w-full rounded-[8px] py-[18px] text-[#0A0A0A] font-sans text-[14px]"
            style={{boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.06)"}}
            onClick={() =>
              setAppPage(source === "for someone else" ? "for someone else" : "for user")
            }
            disabled={isSubmitting}
          >
            Edit Details
          </button>
          <button
            type="button"
            className="flex-1 rounded-[8px] py-[18px] bg-[#8380FF] hover:bg-[#7059F6] text-white font-sans text-[14px]"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

const LabelValue = ({ label, value }) => (
  <div>
    <div className="text-[#8A93A6]">{label}</div>
    <div className="text-[#2F3441]">{value || "-"}</div>
  </div>
);

export default AppointmentConfirmationPage;
