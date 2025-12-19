import { APIClient } from "./api_helper";
import * as url from "./urlHelpers";

export const selfBookingBackendHelper = () => {
  const apiClient = new APIClient();
  const BASE_URL = url.BASE_URL;

  const getAllApoimentTypesSelfBooking = (params) =>
    apiClient.get(`${BASE_URL}${url.GET_APOIMENT_TYPES_BOOKING}` , params);

  const getSlotApoimet = (params) =>
    apiClient.get(`${BASE_URL}${url.GET_SLOT_APOIMET}`, params);

  const getDoctorByTypeId = (params) =>
    apiClient.get(`${BASE_URL}${url.GET_DOCTOR_BY_TYPEID}`, params);

  const createPatient = (params) =>
    apiClient.create(`${BASE_URL}${url.CREATE_PATIENT}?bookingToken=${params?.token}`, params.data);

  const createContactPerson = (params) =>
    apiClient.create(`${BASE_URL}${url.CREATE_CONTACT_PERSON}?bookingToken=${params?.token}`, params?.data);

  const createBooking = (params) =>
    apiClient.create(`${BASE_URL}${url.CREATE_BOOKING}?bookingToken=${params?.token}`, params?.data);
 const getClinicInfo = (params) => 
  apiClient.get(`${BASE_URL}/api/PatientAppointmentBooking/${params}/clinic-info`);
  return {
    getAllApoimentTypesSelfBooking,
    getSlotApoimet,
    getDoctorByTypeId,
    createPatient,
    createContactPerson,
    createBooking,
    getClinicInfo
  };
};
