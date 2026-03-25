import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { patchBookingInformation } from "../helpers/bookingStorage";

const initialState = {
  headerPage: 0,
  language: "en",
  appointmentData: null,
  appPage: "visite type",
  someOneElsePage: false,
  user: false,
  humanStatus: "",
  flashMessage: "",
  widthBlock: 0,
  heigthBlock: 0,
  paddingB: false,
  patientInfo: {},
  chosenDoctor: {},
  calendarApi: {},
  appointmentTime: {},
  schedulerHasSelection: false,
  guardianInfo: {},
  forSomeoneElseConsent: false,
  confirmationData: null,
};

const SelfBookingStore = create(
  persist(
    (set) => ({
      ...initialState,
      setHeaderPage: (page) => set({ headerPage: page }),

      setLanguage: (language) => set({ language }),

      setAppointmentData: (data) => {
        set({ appointmentData: data });
        patchBookingInformation({ appointmentData: data });
      },

      setAppPage: (namePage) => set({ appPage: namePage }),

      setSomeOneElsePage: (bool) => set({ someOneElsePage: bool }),

      setUser: (bool) => set({ user: bool }),

      setHumanStatus: (status) => set({ humanStatus: status }),

      setFlashMessage: (message) => set({ flashMessage: message }),
      clearFlashMessage: () => set({ flashMessage: "" }),

      setWidthBlock: (width) => set({ widthBlock: width }),

      setHeightBlock: (height) => set({ heigthBlock: height }),

      setPaddingB: (bool) => set({ paddingB: bool }),

      setPatientInfo: (dataObj) => {
        set({ patientInfo: dataObj });
        patchBookingInformation({ patientInfo: dataObj });
      },

      setChosenDoctor: (dataObj) => {
        set({ chosenDoctor: dataObj });
        patchBookingInformation({ chosenDoctor: dataObj });
      },

      setCalendarApi: (dataObj) => set({ calendarApi: dataObj }),

      setAppointmentTime: (dataObj) => {
        set({ appointmentTime: dataObj });
        patchBookingInformation({ appointmentTime: dataObj });
      },

      setSchedulerHasSelection: (value) => set({ schedulerHasSelection: value }),

      setGuardianInfo: (dataObj) => {
        set({ guardianInfo: dataObj });
        patchBookingInformation({ guardianInfo: dataObj });
      },

      setForSomeoneElseConsent: (bool) => set({ forSomeoneElseConsent: bool }),

      setConfirmationData: (data) => {
        set({ confirmationData: data });
        patchBookingInformation({ confirmationData: data });
      },

      resetStore: () => set(initialState),
    }),

    {
      name: "selfBooking-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default SelfBookingStore;
