import { useEffect, useRef } from "react";

import Header from "./Header";
import Footer from "./Footer";
import StepNavigationFooter from "./StepNavigationFooter";
import VisiteTypePage from "./VisiteTypePage";
import SchedulerPage from "./SchedulerPage";
import ForWhoPage from "./ForWhoPage";
import ForSomeoneElsePage from "./ForSomeoneElsePage";
import ForUserPage from "./ForUserPage";
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
  const flashMessage = SelfBookingStore((state) => state.flashMessage);
  const isDesktopNarrow = window.innerWidth < 1024;
  const isVisitTypePage = appPage === "visit type";

  useEffect(() => {
    if (appPage === "continue as") {
      setAppPage("for who");
      setHeaderPage(2);
    }
  }, [appPage, setAppPage, setHeaderPage]);

  useEffect(() => {
    if (!flashMessage) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const prevBody = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overscrollBehavior: document.body.style.overscrollBehavior,
      height: document.body.style.height,
    };
    const prevHtml = {
      overflow: document.documentElement.style.overflow,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
      height: document.documentElement.style.height,
    };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";
    const preventScroll = (event) => {
      event.preventDefault();
    };
    const preventKeys = (event) => {
      const blocked = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar",
      ];
      if (blocked.includes(event.key)) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys);
    document.addEventListener("wheel", preventScroll, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchmove", preventScroll, {
      passive: false,
      capture: true,
    });
    return () => {
      document.body.style.overflow = prevBody.overflow;
      document.body.style.position = prevBody.position;
      document.body.style.top = prevBody.top;
      document.body.style.width = prevBody.width;
      document.body.style.overscrollBehavior = prevBody.overscrollBehavior;
      document.body.style.height = prevBody.height;
      document.documentElement.style.overflow = prevHtml.overflow;
      document.documentElement.style.overscrollBehavior =
        prevHtml.overscrollBehavior;
      document.documentElement.style.height = prevHtml.height;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
      document.removeEventListener("wheel", preventScroll, { capture: true });
      document.removeEventListener("touchmove", preventScroll, {
        capture: true,
      });
      window.scrollTo(0, scrollY);
    };
  }, [flashMessage]);

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
        {flashMessage && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-6">
            <div className="w-full max-w-[520px] rounded-[16px] bg-white px-6 py-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              <div className="text-[18px] font-semibold text-[#1F2937]">
                {flashMessage}
              </div>
            </div>
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
            <ForUserPage />
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
