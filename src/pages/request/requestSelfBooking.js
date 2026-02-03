import { useQuery, useMutation } from "@tanstack/react-query";
import { selfBookingBackendHelper } from "../helpers/backendHelpers";
import { useState } from "react";

export const get_Apoiment_Types_Self_Booking = () => {
  const helper = selfBookingBackendHelper();
  const [text, setText] = useState(null);
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["getApoimentTypesSelfBooking", text],
    queryFn: () => text && helper.getAllApoimentTypesSelfBooking(text),
  });
  return { data, isLoading, isSuccess, error, setText };
};

export const get_Slot_Apoiment = () => {
  const helper = selfBookingBackendHelper();
  const [text, setText] = useState(null);
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: [`getSlotApoiment`, text],
    queryFn: () => text && helper.getSlotApoimet(text),
    cacheTime: 0,
  });
  return { data, isLoading, isSuccess, error, setText };
};

export const get_Doctor_By_Type_Id = () => {
  const helper = selfBookingBackendHelper();
  const [text, setText] = useState(null);
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: [`getDoctorByTypeId`, text],
    queryFn: () => text && helper.getDoctorByTypeId(text),
  });
  return { data, isLoading, isSuccess, error, setText };
};

export const create_Patient = () => {
  const helper = selfBookingBackendHelper();
  const { mutate, data, isLoading, isSuccess, error } = useMutation((data) =>
    helper.createPatient(data)
  );
  return { mutate, data, isLoading, isSuccess, error };
};

export const create_Contact_Person = () => {
  const helper = selfBookingBackendHelper();
  const { mutate, data, isLoading, isSuccess, error } = useMutation((data) =>
    helper.createContactPerson(data)
  );

  return { mutate, data, isLoading, isSuccess, error };
};

export const create_Booking = () => {
  const helper = selfBookingBackendHelper();
  const { mutate, data, isLoading, isSuccess, error } = useMutation((token ,data) =>
    helper.createBooking(token ,data)
  );
  return { mutate, data, isLoading, isSuccess, error };
};

export const get_Clinic_Info = () => {
  const helper = selfBookingBackendHelper();
  const [text, setText] = useState(null);
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: [`getClinicInfo`, text],
    queryFn: () => text && helper.getClinicInfo(text),
  });
  return { data, isLoading, isSuccess, error, setText };
};