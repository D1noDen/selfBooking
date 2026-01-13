import SelfBookingStore from "../../store/SelfBookingStore";
import moment from "moment";
import { get_Doctor_By_Type_Id } from "../request/requestSelfBooking";
import { useEffect, useState } from "react";
import { dateHelper } from "../helpers/dateHelper";
//import useAuth from "../../../Routes/useAuth";
import useAuth from "../../store/useAuth";
import {
  create_Booking,
  create_Patient,
  create_Contact_Person,
} from "../request/requestSelfBooking";

import chevronLeft from "../../assets/images/self-booking/chevronLeft.png";
import WithoutAvatar from "../../assets/images/svg/NoAvatar.svg";
import Spinner from "../helpers/Spinner";

const AppointmentInformation = () => {
  const {auth} = useAuth();
  const informationWithSorage = JSON.parse(
    sessionStorage.getItem("BookingInformation")
  );
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
  const [submit, setSubmit] = useState(false);
  const chosenDoctor = SelfBookingStore((state) => state.chosenDoctor);
console.log("informationWithSorage", informationWithSorage);
  let start = moment(
    dateHelper(informationWithSorage.doctor?.eventStartDateTime)
  );
  let end = moment(dateHelper(informationWithSorage?.doctor.eventEnd));
  const duration = end.diff(start, "minutes");
  const formattedStartDate = start.format("HH:mm");
  const formattedEndDate = end.format("HH:mm");

  const newStartDate = dateHelper(
    informationWithSorage.doctor?.eventStartDateTime
  );
  const newEndDate = dateHelper(informationWithSorage?.doctor.eventEnd);

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
    if (informationWithSorage) {
      GetDoctorByTypeIdInformation({
          bookingToken:auth,
        appointmentTypeId: informationWithSorage.apoimentTypeId.id,
      });
    }
  }, []);

  useEffect(() => {
    if (GetDoctorByTypeIdData) {
      const filteredDoctors = GetDoctorByTypeIdData.data.result.filter(
        (item) => item.userId === chosenDoctor.id
      );
      setDoctor(filteredDoctors);
    }
  }, [GetDoctorByTypeIdData]);

  const {
    mutate: CreateBookingMutate,
    isLoading: CreateBookingLoading,
    data: CreateBookingData,
  } = create_Booking();
  const {
    mutate: CreateContactPersonMutate,
    isLoading: createContactPersonLoading,
    data: createContactPersonData,
  } = create_Contact_Person();
  const {
    mutate: CreatePatientMutate,
    isLoading: CreatePatientLoading,
    data: CreatePatientData,
  } = create_Patient();

  useEffect(() => {
    if (submit) {
      (async function () {
        try {
          await createPatient();
        } catch (error) {
          console.error("Error in useEffect:", error);
        }
      })();
    }
  }, [submit]);

  useEffect(() => {
    if (CreateBookingData) {
      setAppPage("complete mobile");
    }
  }, [CreateBookingData]);

  useEffect(() => {
    if (CreatePatientData) {
      if (Object.keys(guardianInfo).length > 0) {
        (async function () {
          try {
            await CreateContactPerson();
          } catch (error) {
            console.error(error);
          }
        })();
      } else {
        (async function () {
          try {
            await CreateBooking();
          } catch (error) {
            console.error(error);
          }
        })();
      }
    }
  }, [CreatePatientData]);

  useEffect(() => {
    if (createContactPersonData) {
      (async function () {
        try {
          await CreateBooking();
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [createContactPersonData]);

  const CreateContactPerson = async () => {
    CreateContactPersonMutate({
      data:{
        patientId: CreatePatientData.data.patientId,
      firstName: guardianInfo.firstName,
      lastName: guardianInfo.lastName,
      email: guardianInfo.email,
      cellPhone: guardianInfo.phoneNumber,
      gender: "Other",
      pesel: guardianInfo.pesel,
      dateOfBirth: patientInfo.dateOfBirth,
      zipCode: "",
      title: "",
      contactPersonTypeId: 0,
      },
      token:auth,
    });
  };
console.log("patientInfo", patientInfo);
  const createPatient = async () => {

    CreatePatientMutate({
     
     data:{
       title: "",
      firstName: patientInfo.firstName,
      lastName: patientInfo.lastName,
      email: patientInfo.email,
      cellPhone: patientInfo.phoneNumber,
      businessPhone: "",
      nip: "",
      mailingStreet: patientInfo.adress,
      mailingHouseNumber: "",
      mailingCityId: 0,
      mailingRegionId: 0,
      mailingZipCode: "",
      mailingCountry: "",
      isBlackListed: false,
      dateOfBirth: patientInfo.dateOfBirth,
      gender: patientInfo.gender,
      pesel: patientInfo.pesel,
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
     token:auth,
    });
  };
  const CreateBooking = async () => {
    CreateBookingMutate({
     data:{
       eventStartDateTime: newStartDate,
      eventEndDateTime: newEndDate,
      appointmentDescription: CreatePatientData.data.comments,
      appointmentTypeId: informationWithSorage?.apoimentTypeId.id,
      userId: informationWithSorage?.doctor.id,
      patientId: CreatePatientData.data.patientId,
      patientContactPersonId: CreatePatientData.data.patientContactPersonId,
      cabinetId: informationWithSorage?.doctor.cabinetId,
     },
      token:auth,
    });
  };

  return (
    <div>
      {CreateBookingLoading && <Spinner />}
      {createContactPersonLoading && <Spinner />}
      {CreatePatientLoading && <Spinner />}
      <section className="mobileBG h-[75px]">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-[290px]">
            <p className="text-[24px] text-white text-center leading-normal">
              Appointment information
            </p>
            <img
              className="absolute top-[10px] left-[-18px] h-[16px] w-[16px]"
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
              <p className="text-[#111113]">
                {Object.keys(guardianInfo).length > 0
                  ? guardianInfo.isParent === "true"
                    ? "Child"
                    : "Adult"
                  : "Self"}
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
              <p className="text-[#B1B1B1] ">Age</p>
              <p className="text-[#111113]">
                {calcAge(patientInfo.dateOfBirth)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#B1B1B1] ">Problem</p>
              <p className="text-[#111113]">{patientInfo.problem}</p>
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
                <p className="text-[#B1B1B1] ">Gender</p>
                <p className="text-[#111113]"></p>
              </div>
              <div className="flex justify-between">
                <p className="text-[#B1B1B1] ">Age</p>
                <p className="text-[#111113]">{}</p>
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
            console.log(submit);
            setSubmit(!submit);
          }}
          className="mt-[22px] w-[340px] h-[44px] font-medium rounded-[12px] bg-[#7C67FF] text-white"
        >
          Book Appointment
        </button>
        <button
          onClick={() => {
            setAppPage("for patient mobile");
          }}
          className="mb-[10px] mt-[12px] w-[340px] h-[44px] font-medium rounded-[12px] border border-solid border-[#7C67FF] bg-white text-[#7C67FF]"
        >
          Edit
        </button>
      </section>
    </div>
  );
};

export default AppointmentInformation;
