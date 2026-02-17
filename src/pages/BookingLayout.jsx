import "../assets/scss/SelfBooking/BookingAppointment.scss";
import useResize from "./pageSize";
import { useEffect, useRef, useState } from "react";
import BookingLayoutPC from "./BookingLayoutPC";
import SelfBookingStore from "../store/SelfBookingStore";
import { GlobalHookWindowSummary } from "../helpers/GlobalHookWindowSummary";
import { GlobalHookWindowHeight } from "../helpers/GlobalHookWindowSummary";
import { get_Apoiment_Types_Self_Booking , get_Clinic_Info} from "./request/requestSelfBooking";
import useAuth from "../store/useAuth";
import BookingLayoutMobile from "./BookingLayoutMobile";
const MainLayout = () => {
  const pageSize = useResize();
 
  const {data:DataClinicInfo , isLoading:LoadingClinicInfo , setText:UseClinicInfo} = get_Clinic_Info()
  const {setAuth , auth} = useAuth();
  const appPage = SelfBookingStore((state) => state.appPage);
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const headerPage = SelfBookingStore((state) => state.headerPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const setWidthBlock = SelfBookingStore((state) => state.setWidthBlock);
  const setPaddingB = SelfBookingStore((state) => state.setPaddingB);
  const paddingB = SelfBookingStore((state) => state.paddingB);
  const [types, setTypes] = useState(null);
  const width = GlobalHookWindowSummary();
  const height = GlobalHookWindowHeight();
  const mainBlock = useRef(0);
  const {
    data: GetApoimentTypesSelfBookingData,
    isLoading: GetApoimentTypesSelfBookingLoading,
    setText: GetApoimentTypesSelfBookingInformation,
  } = get_Apoiment_Types_Self_Booking();
  useEffect(() => {
   if(auth){
     GetApoimentTypesSelfBookingInformation({
      bookingToken:auth
    });
    UseClinicInfo(auth)
    }
  }, [auth]);

  const pageMapping = {
   
    "visit type": "visit type mobile",
    "scheduler": "upcoming schedule",
    "continue as": "continue as mobile",
    "for who": "for who mobile",
    "for guest page": "patient exact information",
    "for someone else": "guardian exact information",
    "for user": "patient exact information",
    "appointment confirmation": "appointment information",
    "final page": "final page",
    
    "visit type mobile": "visit type",
    "upcoming schedule": "scheduler",
    "choose a convenient time": "scheduler",
    "continue as mobile": "continue as",
    "for who mobile": "for who",
    "patient exact information": "for guest page",
    "guardian exact information": "for someone else",
    "appointment information": "appointment confirmation",
  };

  useEffect(() => {
   
    const isMobile = pageSize[0] < 1024;
    const currentPageIsMobile = appPage.includes("mobile") || 
                                appPage === "upcoming schedule" || 
                                appPage === "choose a convenient time" ||
                                appPage === "patient exact information" ||
                                appPage === "guardian exact information" ||
                                appPage === "appointment information";
    

    if (isMobile && !currentPageIsMobile) {
     
      const mappedPage = pageMapping[appPage] || "visit type mobile";
      setAppPage(mappedPage);
    } else if (!isMobile && currentPageIsMobile) {
     
      const mappedPage = pageMapping[appPage] || "visit type";
      setAppPage(mappedPage);
    }
  }, [pageSize[0]]);

  useEffect(() => {
    const bookingInfoRaw = sessionStorage.getItem("BookingInformation");
    let bookingInfo = {};
    if (bookingInfoRaw) {
      try {
        bookingInfo = JSON.parse(bookingInfoRaw);
      } catch {
        bookingInfo = {};
      }
    }
    const hasAppointmentType = Boolean(bookingInfo?.apoimentTypeId?.id);
    const hasSelectedAppointment = Boolean(
      bookingInfo?.doctor?.eventStartDateTime &&
        bookingInfo?.doctor?.eventEnd &&
        bookingInfo?.doctor?.id
    );

    const firstPages = ["visit type", "visit type mobile"];
    const pagesRequiringType = [
      "scheduler",
      "upcoming schedule",
      "choose a convenient time",
      "for who",
      "for who mobile",
      "for user",
      "for someone else",
      "for guest page",
      "for patient mobile",
      "for someone else guardian mobile",
      "appointment confirmation",
      "appointment information",
      "appointment information mobile",
      "complete",
      "complete mobile",
    ];
    const pagesRequiringSelectedAppointment = [
      "for who",
      "for who mobile",
      "for user",
      "for someone else",
      "for guest page",
      "for patient mobile",
      "for someone else guardian mobile",
      "appointment confirmation",
      "appointment information",
      "appointment information mobile",
      "complete",
      "complete mobile",
    ];

    if (firstPages.includes(appPage)) return;

    if (pagesRequiringType.includes(appPage) && !hasAppointmentType) {
      setHeaderPage(0);
      setAppPage(pageSize[0] < 1024 ? "visit type mobile" : "visit type");
      return;
    }

    if (
      pagesRequiringSelectedAppointment.includes(appPage) &&
      !hasSelectedAppointment
    ) {
      setHeaderPage(0);
      setAppPage(pageSize[0] < 1024 ? "visit type mobile" : "visit type");
    }
  }, [appPage, pageSize, setAppPage, setHeaderPage]);
  
  useEffect(() => {
    if (GetApoimentTypesSelfBookingData) {
      setTypes(GetApoimentTypesSelfBookingData?.data?.result);
    }
  }, [GetApoimentTypesSelfBookingData]);
  useEffect(() => {
    if (width.screenSize <= 1500) {
      setWidthBlock(width.screenSize - 80);
    } else {
      setWidthBlock(1420);
    }
  }, [width.screenSize, height.screenHeight]);

  let _width = window.innerWidth;
  let _height = window.innerHeight;

  useEffect(() => {
    if (
      (appPage === "for guest page" ||
        appPage === "for someone else" ||
        appPage === "for user") &&
      (_width <= 1400 || _height < 900)
    ) {
      setPaddingB(true);
    } else {
      setPaddingB(false);
    }
  }, [appPage, _width, _height]);

  const mainLayout = useRef(null);
  const setSesionStorage = (object) => {
    sessionStorage.setItem("BookingInformation", JSON.stringify(object));
  };

  // useEffect(() => {
  //   setAppPage("continue as");
  //   setHeaderPage(2);
  // }, []);
 const token = window.location.pathname.replace("/b/", "");
useEffect(() => {
  if (token) {
    setAuth(token);
  }
}, [token]);
  const content =
    pageSize[0] < 1024 ? (
      <BookingLayoutMobile
        types={types}
        setSesionStorage={setSesionStorage}
        paddingB={paddingB}
        appPage={appPage}
        headerPage={headerPage}
      />
    ) : (
      <BookingLayoutPC
        types={types}
        setSesionStorage={setSesionStorage}
        paddingB={paddingB}
        appPage={appPage}
        headerPage={headerPage}
      />
    );
  return <>{content}</>;
};

export default MainLayout;
