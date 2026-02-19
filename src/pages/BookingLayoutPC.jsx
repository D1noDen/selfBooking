import { useEffect, useRef } from "react";

import Header from "./Header";
import Footer from "./Footer";
import StepNavigationFooter from "./StepNavigationFooter";
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
  appPage,
  headerPage,
}) => {
  const mainBlock = useRef(0);
  const setAppPage = SelfBookingStore((state) => state.setAppPage);
  const setHeaderPage = SelfBookingStore((state) => state.setHeaderPage);
  const widthBlock = SelfBookingStore((state) => state.widthBlock);
  const isDesktopNarrow = window.innerWidth < 1024;
  const isVisitTypePage = appPage === "visit type";

  useEffect(() => {
    if (appPage === "continue as") {
      setAppPage("for who");
      setHeaderPage(2);
    }
  }, [appPage, setAppPage, setHeaderPage]);

  return (
    <div
      className={`bookingAppointmentPage w-full ${
        isDesktopNarrow ? "bg-[#FFF]" : "bg-[#F4F7FF]"
      } ${
        isVisitTypePage ? "min-h-[100dvh] overflow-visible" : "h-[100dvh] overflow-hidden"
      }`}
      ref={mainBlock}
      onClick={() => {}}
    >
      <div
        className={`bookingAppointmentWrapper mx-auto flex flex-col pt-[33px] pb-[35px] ${
          isVisitTypePage ? "h-auto" : "h-full min-h-0"
        }`}
        style={{ width: window.innerWidth < 600 ? "auto" : widthBlock }}
      >
        {appPage !== "complete" && (
          <div className="flex-shrink-0">
            <Header />
          </div>
        )}
        <main
          className={`scrollmainContent ${
            isVisitTypePage
              ? "overflow-visible"
              : "flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
          }`}
        >
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
        </main>
        <div className="flex-shrink-0">
          {headerPage === 0 && <Footer />}
          {appPage !== "complete" && <StepNavigationFooter />}
        </div>
      </div>
    </div>
  );
};

export default BookingLayoutPC;
