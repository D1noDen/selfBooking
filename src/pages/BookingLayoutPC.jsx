import { useEffect, useRef } from "react";

import Header from "./Header";
import Footer from "./Footer";
import VisiteTypePage from "./VisiteTypePage";
import SchedulerPage from "./SchedulerPage";
import ForWhoPage from "./ForWhoPage";
import ForSomeoneElsePage from "./ForSomeoneElsePage";
import ForUserPage from "./ForUserPage";
import ForGuestPage from "./ForGuestPage";
import FinalPage from "./FinalPage";
import AppointmentConfirmationPage from "./AppointmentConfirmationPage";
import SelfBookingStore from "../store/SelfBookingStore";

const BookingLayoutPC = ({
  types,
  setSesionStorage,
  paddingB,
  appPage,
  headerPage,
}) => {
  const mainBlock = useRef(0);
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  let _width = window.innerWidth;
  let _height = window.innerHeight;

  useEffect(() => {
    if (appPage === "continue as") {
      setAppPage("for who");
      setHeaderPage(2);
    }
  }, [appPage, setAppPage, setHeaderPage]);

  return (
    <div
      className={`bookingAppointmentPage  pt-[33px] pb-[35px] w-screen ${
        _width < 1024 ? "bg-[#FFF]" : "bg-[#F4F7FF]"
      } ${paddingB ? "pb-[260px]" : ""}`}
      style={{
        height: _height < mainBlock.current.scrollHeight ? `100%` : `100vh`,
        minHeight: 768,
      }}
      ref={mainBlock}
      onClick={() => {}}
    >
     
      <div className="bookingAppointmentWrapper max-w-[1420px] mx-auto  h-full">
        {appPage !== "complete" && <Header />}
        {appPage === "visit type" ? (
          <VisiteTypePage
            visitTypeArr={types}
            setSesionStorage={setSesionStorage}
          />
        ) : appPage === "scheduler" ? (
          <SchedulerPage
            setSesionStorage={setSesionStorage}
            visitTypeArr={types}
          />
        ) : appPage === "for who" ? (
          <ForWhoPage />
        ) : appPage === "for guest page" ? (
          <ForGuestPage mainBlock={mainBlock} />
        ) : appPage === "for someone else" ? (
          <ForSomeoneElsePage />
        ) : appPage === "for user" ? (
          <ForUserPage />
        ) : appPage === "appointment confirmation" ? (
          <AppointmentConfirmationPage />
        ) : appPage === "complete" ? (
          <FinalPage />
        ) : (
          ""
        )}
        {headerPage === 0 && <Footer />}
      </div>
    </div>
  );
};

export default BookingLayoutPC;
