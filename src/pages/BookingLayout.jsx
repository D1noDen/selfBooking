import "../assets/scss/SelfBooking/BookingAppointment.scss";
import useResize from "./pageSize";
import { useEffect, useRef, useState } from "react";
import BookingLayoutPC from "./BookingLayoutPC";
import SelfBookingStore from "../store/SelfBookingStore";
import { GlobalHookWindowSummary } from "../helpers/GlobalHookWindowSummary";
import { GlobalHookWindowHeight } from "../helpers/GlobalHookWindowSummary";
import { get_Apoiment_Types_Self_Booking } from "./request/requestSelfBooking";

import BookingLayoutMobile from "./BookingLayoutMobile";
const MainLayout = () => {
  const pageSize = useResize();
  const auth = {
    clinicId: 1,
    companyId: "4b731791-d6f4-4f46-7363-08db9ce8963d",
  }
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
    GetApoimentTypesSelfBookingInformation({
      companyId: auth?.companyId,
      clinicId: auth?.clinicId,
    });
  }, []);
  useEffect(() => {
    if (pageSize[0] < 1024) {
      setAppPage("visit type mobile");
    } else {
      setAppPage("visit type");
    }
    setHeaderPage(0);
  }, [pageSize[0]]);
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
