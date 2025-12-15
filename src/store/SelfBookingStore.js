import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SelfBookingStore = create(
  persist(
    (set, get) => ({
      headerPage: 0,
      setHeaderPage: (page) => set({ headerPage: page }),

      appPage: "visite type",
      setAppPage: (namePage) => set({ appPage: namePage }),

      someOneElsePage: false,
      setSomeOneElsePage: (bool) => set({ someOneElsePage: bool }),

      user: false,
      setUser: (bool) => set({ user: bool }),

      humanStatus: "",
      setHumanStatus: (status) => set({ humanStatus: status }),

      widthBlock: 0,
      setWidthBlock: (width) => set({ widthBlock: width }),

      heigthBlock: 0,
      setHeightBlock: (height) => set({ heigthBlock: height }),

      paddingB: false,
      setPaddingB: (bool) => set({ paddingB: bool }),

      patientInfo: {},
      setPatientInfo: (dataObj) => set({ patientInfo: dataObj }),

      chosenDoctor: {},
      setChosenDoctor: (dataObj) => set({ chosenDoctor: dataObj }),

      calendarApi: {},
      setCalendarApi: (dataObj) => set({ calendarApi: dataObj }),

      appointmentTime: {},
      setAppointmentTime: (dataObj) => set({ appointmentTime: dataObj }),

      guardianInfo: {},
      setGuardianInfo: (dataObj) => set({ guardianInfo: dataObj }),
    }),
    {
      name: "selfBooking-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default SelfBookingStore;
